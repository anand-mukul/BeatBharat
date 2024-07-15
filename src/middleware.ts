import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const publicRoutes = ["/sign-in", "/sign-up", "/"];
const protectedRoutes = ["/playlist", "/library", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (protectedRoutes.includes(pathname) && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );
      const { accessToken: newAccessToken } = response.data.data;

      const response2 = NextResponse.next();
      response2.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return response2;
    } catch (error) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  if (accessToken) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/current-user`, {
        headers: headers,
        withCredentials: true,
      });

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};