import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordClient"; // extrait dans un composant séparé

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
