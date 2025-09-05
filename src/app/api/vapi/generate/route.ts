import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Function to extract JSON from potentially markdown-wrapped text
function extractJsonFromText(text: string): any {
  try {
    // First, try to parse as-is
    return JSON.parse(text);
  } catch {
    try {
      // If that fails, try to extract JSON from markdown
      const jsonMatch = text.match(/``````/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Try to find JSON object in the text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }

      throw new Error("No valid JSON found in text");
    } catch {
      // Clean the response manually
      const cleanText = text.replace(/```/g, "").replace(/`/g, "").trim();
      return JSON.parse(cleanText);
    }
  }
}

interface ExtractedParams {
  role: string;
  type: string;
  level: string;
  techstack: string[];
  amount: number;
}

interface DecodedToken {
  userId: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const {
      userResponses,
      assistantPrompts,
    }: { userResponses: string[]; assistantPrompts: string[] } = body;

    // Validate required fields
    if (!userResponses || !assistantPrompts) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const authToken = cookieStore.get("userAuth")?.value;
    console.log(authToken);

    if (!authToken) {
      return NextResponse.json({ msg: "No auth token found" }, { status: 401 });
    }

    // Verify and decode token
    const decodeToken = jwt.decode(authToken) as DecodedToken | null;
    console.log(decodeToken);
    const id = decodeToken?.userId;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use Gemini to extract parameters from conversation
    const conversationText = userResponses.join(" ");

    const extractionPrompt = `
Extract interview parameters from this conversation and return ONLY a valid JSON object.

Conversation: "${conversationText}"

Extract these 5 parameters:
1. role: The job position mentioned (string)
2. type: Interview type - technical, behavioral, or mixed (string)
3. level: Experience level - beginner, intermediate, or hard (string)
4. techstack: Array of technologies mentioned (array of strings)
5. amount: Number of questions requested (number, default 5)

If any parameter is missing from the conversation, use these defaults:
- role: "Software Developer"
- type: "mixed"
- level: "intermediate"
- techstack: ["JavaScript"]
- amount: 5

Return ONLY the JSON object with no markdown formatting, no code blocks, no additional text:
{"role": "value", "type": "value", "level": "value", "techstack": ["value"], "amount": 5}
`;

    const { text: extractedParamsText } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: extractionPrompt,
    });

    console.log("Raw Gemini response:", extractedParamsText);

    let extractedParams: ExtractedParams;
    try {
      extractedParams = extractJsonFromText(extractedParamsText);
    } catch (parseError) {
      console.error("Error parsing parameter extraction:", parseError);
      console.error("Raw text:", extractedParamsText);

      // Fallback to defaults
      extractedParams = {
        role: "Software Developer",
        type: "mixed",
        level: "intermediate",
        techstack: ["JavaScript"],
        amount: 5,
      };
    }

    // Extract parameters
    const { role, type, level, techstack, amount } = extractedParams;
    const userId = user.id;

    console.log("Extracted parameters:", {
      role,
      type,
      level,
      techstack,
      amount,
    });

    // Validate extracted parameters
    if (!role || !level || !techstack || !type || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to extract valid interview parameters",
        },
        { status: 400 }
      );
    }

    // Ensure techstack is always an array
    const techStackArray: string[] = Array.isArray(techstack)
      ? techstack
      : [techstack];

    // Validate amount is a valid number
    let questionAmount = Number(amount);
    if (isNaN(questionAmount) || questionAmount <= 0) {
      console.log("Invalid amount, using default of 5");
      questionAmount = 5;
    }

    // Logging for debugging
    console.log(`
      Role: ${role}
      Level: ${level}
      Techstack: ${techStackArray.join(", ")}
      Type: ${type}
      Amount: ${questionAmount}
      UserId: ${userId}
    `);

    // Generate questions using AI
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStackArray.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${questionAmount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    let questionsArray: string[];
    try {
      questionsArray = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "AI returned empty questions" },
        { status: 500 }
      );
    }

    console.log("Gemini generated the Question array:", questionsArray);

    // Save in DB
    const interview = await prisma.interview.create({
      data: {
        role,
        level,
        techStack: techStackArray,
        type,
        amount: questionAmount,
        question: questionsArray,
        userId,
      },
    });

    console.log("Interview saved in the DB:", interview.id);

    return NextResponse.json(
      {
        success: true,
        questions: questionsArray,
        interviewId: interview.id,
        extractedParams: extractedParams, // Optional: return what was extracted for debugging
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Interview generation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
