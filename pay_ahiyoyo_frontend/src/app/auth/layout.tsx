// app/auth/layout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <div className="auth-container">{children}</div>
      </body>
    </html>
  );
}
