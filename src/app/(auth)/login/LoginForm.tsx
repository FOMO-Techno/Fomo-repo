"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission with field-by-field validation
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email field
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password field
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Attempt login via API
      await axios.post("/api/login", { email, password, remember });
      toast.success("Logged in successfully");
      router.push("/home");
    } catch {
      // Handle login failure
      toast.error("Login failed. Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email input field */}
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
        />

        {/* Password input field */}
        <input
          id="password"
          type="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
        />

        {/* Remember me checkbox */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mr-2"
          />
          Remember me?
        </label>

        <a href="/forgot" className="text-sm text-blue-600 hover:underline">
          Forgot?
        </a>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "…" : "Log In"}
        </button>
      </form>

    </>
  );
}
