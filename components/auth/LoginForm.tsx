"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Globe } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";

export default function LoginForm() {
  return (
    <div className="w-full">

      {/* Language */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-600">
          <Globe size={18} />
          English
        </button>
      </div>

      {/* Heading */}
      <h1 className="mt-10 text-5xl font-bold text-slate-900">
        Welcome back 👋
      </h1>

      <p className="mt-3 text-lg text-slate-500">
        Sign in to continue to ElectroHub
      </p>

      {/* Form */}
      <div className="mt-10 space-y-6">

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Email address
          </label>

          <Input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Password
          </label>

          <Input
            type="password"
            placeholder="Enter your password"
          />
        </div>

      </div>

      {/* Remember */}
      <div className="mt-6 flex items-center justify-between">

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember me
        </label>

        <button className="font-medium text-blue-600 hover:underline">
          Forgot password?
        </button>

      </div>

      {/* Login */}
      <div className="mt-8">
        <Button type="submit">
          ⚡ Sign In
        </Button>
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-slate-400">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-3 gap-4">

        <button className="flex items-center justify-center rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FcGoogle size={30} />
        </button>

        <button className="flex items-center justify-center rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FaApple size={28} className="text-black" />
        </button>

        <button className="flex items-center justify-center rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <FaGithub size={28} className="text-black" />
        </button>

      </div>

      {/* Signup */}
      <p className="mt-10 text-center text-slate-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign up →
        </Link>
      </p>

    </div>
  );
}