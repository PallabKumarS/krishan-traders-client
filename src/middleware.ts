import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./lib/verifyToken";

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/login"];

const roleBasedPrivateRoutes = {
  admin: [/^\/dashboard\/admin/, /^\/dashboard\/staff/],
  staff: [/^\/dashboard\/staff/],
  guest: [],
};

const sharedRoutes = [/^\/dashboard\/settings/, /^\/dashboard\/profile/];

export const middleware = async (request: NextRequest) => {
  const userInfo = await getCurrentUser();

  const { pathname } = request.nextUrl;

  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url)
      );
    }
  }

  if (sharedRoutes.some((route) => pathname.match(route))) {
    return NextResponse.next();
  }

  if (userInfo?.role && roleBasedPrivateRoutes[userInfo.role as Role]) {
    const routes = roleBasedPrivateRoutes[userInfo.role as Role];

    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
