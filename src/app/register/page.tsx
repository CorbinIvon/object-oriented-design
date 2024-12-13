"use client";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = searchParams.get("email") || "";
  const password = searchParams.get("password") || "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          username: formData.get("username"),
        }),
      });
      // ...rest of registration handling...
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="...">
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          required
          defaultValue={email}
          placeholder="Email"
          className="..."
        />
        <input
          name="username"
          type="text"
          required
          placeholder="Username"
          className="..."
        />
        <input
          name="password"
          type="password"
          required
          defaultValue={password}
          placeholder="Password"
          className="..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
