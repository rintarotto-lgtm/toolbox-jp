export { auth as middleware } from "@/lib/auth";

export const config = {
  // Only protect specific routes that require auth
  matcher: ["/settings/:path*", "/billing/:path*", "/api/stripe/portal/:path*"],
};
