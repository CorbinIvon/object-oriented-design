"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/utils/auth";

// Add this interface near the top of the file
interface ApiError {
  response?: {
    data?: {
      details?: Array<{
        message: string;
      }>;
    };
  };
}

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "password") {
      checkPassword(value);
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: hashPassword(formData.password),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userChange"));
        router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(`An error occurred during login: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { isValid } = validatePassword(formData.password);
    if (!isValid) {
      setError("Password doesn't meet requirements");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: hashPassword(formData.password),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userChange"));
        router.push("/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        (err as ApiError).response?.data?.details
      ) {
        const apiError = err as ApiError;
        const errorDetails = apiError.response?.data?.details;
        if (errorDetails) {
          setError(errorDetails.map((detail) => detail.message).join(", "));
        } else {
          setError(`An error occurred during registration: ${err}`);
        }
      } else {
        setError(`An error occurred during registration: ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-black/50 p-4 rounded">
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
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
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
              {/* <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-500">Or</span>
              </div> */}
            </div>
            {/* <button className="w-full p-2 border border-gray-800 text-gray-400 hover:bg-gray-900 flex items-center justify-center gap-2">
              {"> "}Sign In With Google
            </button> */}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
            />
            <div className="space-y-1">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
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
