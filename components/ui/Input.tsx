"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

type InputProps = {
  type?: "text" | "email" | "password";
  placeholder: string;
};

export default function Input({
  type = "text",
  placeholder,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
  {isPassword ? <Lock size={20} /> : <Mail size={20} />}
</div>
      <input
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        placeholder={placeholder}
        className="
w-full
rounded-2xl
border
border-slate-300
bg-white
pl-12
pr-12
py-3.5
outline-none
transition-all
duration-300
focus:border-blue-600
focus:ring-4
focus:ring-blue-100
"
      />

      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      )}
    </div>
  );
}