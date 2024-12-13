"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import crypto from "crypto";

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const checkPassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
    setPasswordChecks(checks);
    setIsPasswordValid(Object.values(checks).every((check) => check));
  };

  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    return {
      isValid: Object.values(validations).every((v) => v),
      validations,
    };
  };

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

    const { isValid, validations } = validatePassword(password);
    if (!isValid) {
      setError("Password doesn't meet requirements");
      setLoading(false);
      return;
    }

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
      if (err instanceof Error && (err as any).response?.data?.details) {
        setError(
          (err as any).response.data.details
            .map((d: any) => d.message)
            .join(", ")
        );
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <div className="space-y-1">
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPassword(e.target.value);
                }}
              />
              <div className="text-sm space-y-1">
                {Object.entries({
                  "longer than 12 characters": passwordChecks.length,
                  "has uppercase letter": passwordChecks.uppercase,
                  "has lowercase letter": passwordChecks.lowercase,
                  "has number": passwordChecks.number,
                  "has special character": passwordChecks.special,
                }).map(([text, check]) => (
                  <div
                    key={text}
                    className={check ? "text-green-500" : "text-red-500"}
                  >
                    {check ? "- [x] " : "- [ ] "}
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "> Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
