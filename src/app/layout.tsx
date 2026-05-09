export const dynamic = "force-dynamic";
import "./globals.css";
import { Tajawal } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "منصة متمكن",
  description: "منصة متمكن لتعلم المهارات واللغات باحتراف",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.className} bg-slate-50 text-slate-800 antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-mutamakin.png"
                  alt="Mutamakin"
                  fill
                  sizes="40px"
                  priority
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-sky-600 text-lg tracking-wide">
                  متمكن
                </span>
                <span className="text-[10px] text-slate-400">
                  Mutamakin Platform
                </span>
              </div>
            </Link>

            {/* NAV */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <NavItem href="/" label="الرئيسية" />
              <NavItem href="/language/technical" label="اللغة التقنية" />
              <NavItem href="/language/fusha" label="اللغة الفصيحة" />
            </nav>

            {/* 🔥 LOGOUT ICON ONLY */}
            <form action={logout}>
              <button
                type="submit"
                className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
              </button>
            </form>

          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 bg-white">
          <p className="font-medium text-slate-500">
            منصة متمكن © 2026
          </p>
        </footer>
      </body>
    </html>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-slate-600 hover:text-sky-600 transition group"
    >
      {label}
      <span className="absolute right-0 -bottom-1 h-[2px] w-0 bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}