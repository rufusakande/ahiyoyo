import type { Metadata } from "next";
import "./globals.css";
import PrelineScript from "../components/PrelineScript";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "Auth Ahiyoyo",
  description: "Gestion de compte Ahiyoyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="dark:bg-neutral-900">
      <AuthProvider>
      <main>{children}</main>
      </AuthProvider>
      </body>
      <PrelineScript />
    </html>
  );
}
