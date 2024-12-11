"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import crypto from "crypto";

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hashPassword = (password: string) => {
    return crypto
      .createHash("sha256")
      .update(password + process.env.DATABASE_URL)
      .digest("hex");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: hashPassword(password),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password: hashPassword(password),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 font-mono">
      <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
        <div className="space-y-4">
          <Header />
          <div className="border border-gray-800 bg-black/50 p-4 rounded">
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex gap-4 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`pb-2 ${
                    activeTab === "login"
                      ? "text-green-500"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {"> "}Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`pb-2 ${
                    activeTab === "register"
                      ? "text-green-500"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {"> "}Register
                </button>
              </div>

              {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "> Sign In"}
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-black text-gray-500">Or</span>
                    </div>
                  </div>
                  <button className="w-full p-2 border border-gray-800 text-gray-400 hover:bg-gray-900 flex items-center justify-center gap-2">
                    {"> "}Sign In With Google
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3">
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <input
                    name="username"
                    type="text"
                    required
                    placeholder="Username"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm Password"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "> Register"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
