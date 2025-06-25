import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  // Si pas de token, rediriger vers login
  if (token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Pages réservées aux admins
  const adminOnlyPaths = [
    "/dashboard/update-pay-alipay",
    "/dashboard/update-pay-bank",
    "/dashboard/settings",
    "/dashboard/admin-historiques",
  ];

  // Vérifier si l'utilisateur tente d'accéder à une page admin sans être admin
  if (adminOnlyPaths.includes(pathname) && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/profil", req.url));
  }

  return NextResponse.next();
}

// Appliquer le middleware à toutes les routes du dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
