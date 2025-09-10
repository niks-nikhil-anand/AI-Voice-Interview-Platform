"use server";
import { prisma } from "../prisma";


export async function getInterviews() {
  try {
    const interviews = await prisma?.interview.findMany({
      include: {
        user: true, 
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return interviews;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw new Error("Failed to fetch interviews");
  }
}

// Fetch single interview by id
export async function getInterviewById(id: string) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    return interview;
  } catch (error) {
    console.error("Error fetching interview:", error);
    throw new Error("Failed to fetch interview");
  }
}
