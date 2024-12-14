"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user && !window.location.pathname.includes("LoginRegister")) {
      router.push("/LoginRegister");
    }
  }, [router]);

  if (!localStorage.getItem("user")) {
    return null;
  }

  return <>{children}</>;
}
