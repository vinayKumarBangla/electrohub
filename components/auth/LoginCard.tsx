"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";

export default function LoginCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful!");

    router.push("/");
  }

  return (
    <div className="w-full">

      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
          <Globe size={18} />
          English
        </button>
      </div>

      <h1 className="mt-8 text-4xl font-bold">
        Welcome Back 👋
      </h1>

      <p className="mt-3 text-slate-500">
        Sign in to continue to ElectroHub
      </p>

      <div className="mt-8 space-y-5">

        <div>
          <label className="mb-2 block font-semibold">
            Email Address
          </label>

          <div className="flex items-center rounded-2xl border px-5 py-4">

            <Mail className="text-slate-400" size={22} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="ml-3 w-full outline-none"
            />

          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Password
          </label>

          <div className="flex items-center rounded-2xl border px-5 py-4">

            <Lock className="text-slate-400" size={22} />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="ml-3 w-full outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={22} />
              ) : (
                <Eye size={22} />
              )}
            </button>

          </div>
        </div>
              </div>

      <div className="mt-6 flex items-center justify-between">

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="font-medium text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.02]"
      >
        {loading ? "Signing In..." : "⚡ Sign In"}
      </button>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-slate-400">
          or continue with
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-3 gap-4">

        <button className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FcGoogle className="mx-auto text-3xl" />
        </button>

        <button className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FaApple className="mx-auto text-3xl" />
        </button>

        <button className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FaGithub className="mx-auto text-3xl" />
        </button>

      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign Up →
        </Link>
      </p>

    </div>
  );
}