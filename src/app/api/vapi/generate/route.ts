import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, level, techstack, type, amount, userId } = body;

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

    const questionsArray = JSON.parse(text);

    // Save in DB
    const interview = await prisma.interview.create({
      data: {
        role,
        level,
        techStack: techStackArray, // ✅ save as array
        type,
        amount: Number(amount),
        question: questionsArray,
        userId,
      },
    });

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
