"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import {
  Globe,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";

export default function SignupCard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

   setLoading(true);

console.log({
  name,
  email,
  password,
});

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: name,
    },
  },
});

    if (error) {
  console.error("Signup Error:", error);
  setLoading(false);
  alert(error.message);
  return;
}

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: name,
        email,
        role: "customer",
      });
    }

    setLoading(false);

    alert("Account created successfully!");

    router.push("/login");
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
        Create Account 🚀
      </h1>

      <p className="mt-3 text-slate-500">
        Create your ElectroHub account
      </p>

      <div className="mt-8 space-y-5">

        <div>
          <label className="mb-2 block font-semibold">
            Full Name
          </label>

          <div className="flex items-center rounded-2xl border px-5 py-4">

            <User className="text-slate-400" size={22} />

            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your full name"
              className="ml-3 w-full outline-none"
            />

          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Email Address
          </label>

          <div className="flex items-center rounded-2xl border px-5 py-4">

            <Mail className="text-slate-400" size={22} />

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter password"
              className="ml-3 w-full outline-none"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={22}/> : <Eye size={22}/>}
            </button>

          </div>
        </div>
                <div>
          <label className="mb-2 block font-semibold">
            Confirm Password
          </label>

          <div className="flex items-center rounded-2xl border px-5 py-4">

            <Lock className="text-slate-400" size={22} />

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="ml-3 w-full outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={22} />
              ) : (
                <Eye size={22} />
              )}
            </button>

          </div>
        </div>

      </div>

      <label className="mt-6 flex items-center gap-2">
        <input type="checkbox" />
        <span className="text-sm text-slate-600">
          I agree to the Terms & Conditions
        </span>
      </label>

      <button
        onClick={handleSignup}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.02]"
      >
        {loading ? "Creating..." : "🚀 Create Account"}
      </button>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-slate-400">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-3 gap-4">

        <button className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
          <FcGoogle className="mx-auto text-3xl" />
        </button>

        <button className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
          <FaApple className="mx-auto text-3xl" />
        </button>

        <button className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
          <FaGithub className="mx-auto text-3xl" />
        </button>

      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign In →
        </Link>
      </p>

    </div>
  );
}