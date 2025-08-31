import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Optional: fetch all interviews or just return a success message
    // Example: return success true
    return NextResponse.json(
      { success: true, message: "API is working" },
      { status: 200 }
    );

    // Or, to return all interviews:
    // const interviews = await prisma.interview.findMany();
    // return NextResponse.json({ success: true, interviews }, { status: 200 });
  } catch (error) {
    console.error("GET API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, level, techstack, type, amount, userId } = body;

    // Validate required fields
    if (!role || !level || !techstack || !type || !amount || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Logging for debugging
    console.log(`
Role: ${role}
Level: ${level}
Techstack: ${techstack}
Type: ${type}
Amount: ${amount}
UserId: ${userId}
    `);

    // Ensure techstack is always an array
    const techStackArray = Array.isArray(techstack) ? techstack : [techstack];

    // Generate questions using AI
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStackArray.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    let questionsArray;
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
        amount: Number(amount),
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
