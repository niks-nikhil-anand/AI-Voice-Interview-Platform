import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { msg: "Logged out successfully" },
      { status: 200 }
    );

    // ✅ Clear the cookie
    response.cookies.set("userAuth", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0), // Expire immediately 
    });

    return response; // ✅ return the response
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ msg: "Failed to log out" }, { status: 500 });
  }
}