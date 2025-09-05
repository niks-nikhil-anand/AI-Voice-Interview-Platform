import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("userAuth")?.value;
    console.log(authToken)

    if (!authToken) {
      return NextResponse.json({ msg: "No auth token found" }, { status: 401 });
    }

    // Verify and decode token
   const decodeToken = jwt.decode(authToken)


    console.log(decodeToken)
    const email = decodeToken?.email;
    console.log(email)

     if (!email) {
      return NextResponse.json({ msg: "No email found in token" }, { status: 400 });
    }


    // find the user in the Database

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    console.log(user)
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}