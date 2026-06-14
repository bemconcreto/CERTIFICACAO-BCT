import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#8D6E63]/[0.04] blur-[80px]" />
        </div>

        <div className="relative w-full max-w-[440px]">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8D6E63]/20 to-[#CBA35C]/10 blur-xl" />
                <div className="relative w-24 h-24 rounded-2xl bg-white border border-[#E5E7EB]/60 flex items-center justify-center shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D6E63] to-[#101820]" />
                  <img src="/logo-bct2.png" alt="Logo BEM" className="w-14 h-14 object-contain" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
                Entrar na Certificação BEM
              </h1>
              <p className="text-sm text-[#6B7280] mt-1.5">
                Acesse sua conta para continuar a certificação.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => signIn("google")}
                className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white border border-[#E5E7EB] text-[#101820] font-medium text-sm shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.4-4.9l-6.2-5.2C29.3 35.5 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
                </svg>
                Entrar com Google
              </button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Voltar
              </Button>
            </div>

            <p className="mt-7 text-xs text-[#9CA3AF] tracking-wide">
              Plataforma oficial de certificação BEM Concreto
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
