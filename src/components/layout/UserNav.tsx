"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export function UserNav() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser(data.user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, xp")
          .eq("id", data.user.id)
          .single();

        setProfile(profileData);
      }
    }

    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="btn btn-primary h-9"
      >
        تسجيل الدخول
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">

      {/* USER INFO */}
      <div className="hidden sm:flex flex-col text-right">
        <p className="text-sm font-semibold text-slate-800">
          {profile?.full_name || "مستخدم"}
        </p>

        <p className="text-xs text-slate-400">
          {profile?.xp || 0} XP
        </p>
      </div>

      {/* AVATAR */}
      <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
        <User size={18} />
      </div>

      {/* 🔥 LOGOUT BUTTON (محسّن) */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">
          تسجيل الخروج
        </span>
      </button>

    </div>
  );
}