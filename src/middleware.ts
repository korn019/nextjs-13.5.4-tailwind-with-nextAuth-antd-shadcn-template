import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  //   function middleware(req) {
  //     if (
  //       req.nextUrl.pathname.startsWith("/admin") &&
  //       !req.nextauth.token?.user.roles?.includes("admin")
  //     ) {
  //       return new NextResponse("Unauthorized", { status: 401 });
  //     }
  //   },
  //   {
  //     callbacks: {
  //       authorized: ({ token }) => {
  //         console.log("🚀 ~ file: middleware.ts:16 ~ token:", token);
  //         return true;
  //       },
  //     },
  //   }
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Check if the middleware is processing the
        // route which requires a specific role
        if (path.startsWith("/admin")) {
          return token?.user?.roles?.includes("admin") ?? false;
        }

        // By default return true only if the token is not null
        // (this forces the users to be signed in to access the page)
        return token !== null;
      },
    },
    pages: {
      signIn: "/",
      signOut: "/",
      error: "/",
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
