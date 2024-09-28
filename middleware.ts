import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (!auth.userId) {
      const orgSelection = new URL("/sign-in", req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (
      auth.userId &&
      !auth.orgId &&
      req.nextUrl.pathname !== "/create-organization"
    ) {
      const orgSelection = new URL("/create-organization", req.url);
      return NextResponse.redirect(orgSelection);
    } /* else {
      const signIn = new URL("/sign-in", req.url);
      return NextResponse.redirect(signIn);
    } */
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|sign-in|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
