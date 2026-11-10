import type { Metadata } from "next";
import AuthForm from "@/components/site/AuthForm";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
