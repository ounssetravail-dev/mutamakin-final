"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError("فشل إنشاء الحساب");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("تم إنشاء الحساب لكن فشل تسجيل الدخول");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-slate-100 rounded-xl p-8 space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold">إنشاء حساب</h1>
          <p className="text-sm text-slate-500 mt-2">
            انضم إلى منصة Mutamakin
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              required
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-md text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-md text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="password"
              required
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-md text-sm outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 text-white py-3 rounded-md font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                إنشاء الحساب
                <ArrowRight size={14} />
              </>
            )}
          </button>

        </form>

        <p className="text-xs text-center text-slate-400">
          لديك حساب؟{" "}
          <Link href="/login" className="text-sky-600">
            تسجيل الدخول
          </Link>
        </p>

      </div>
    </div>
  );
}