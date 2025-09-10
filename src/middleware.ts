import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export async function middleware(req:NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = parse(cookieHeader || "");
  const userAuthToken = cookies.userAuth;

  const { pathname } = req.nextUrl;

  const SignInPage = pathname === "/sign-in";
  const SignUpPage = pathname === "/sign-up";
  const GenerateInterview = pathname === "/interview"
  const resumeDetail = pathname.startsWith("/resume/");


  // If user is logged in, prevent access to auth pages
  if (userAuthToken && (SignInPage || SignUpPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!userAuthToken && (GenerateInterview || resumeDetail)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }


  // Allow the request if no condition matched
  return NextResponse.next();
}
