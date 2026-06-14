import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerificarEmail() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("validando");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const res = await fetch("/api/auth/verifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("sucesso");
        localStorage.setItem("emailVerified", "true");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setStatus("erro");
      }
    }

    verify();
  }, [token]);

  const content = {
    validando: {
      iconBg: "bg-[#8D6E63]/10",
      title: "Validando seu e-mail…",
      desc: "Aguarde enquanto verificamos seu token.",
      titleColor: "text-[#101820]",
    },
    sucesso: {
      iconBg: "bg-emerald-50",
      title: "E-mail confirmado!",
      desc: "Tudo certo! Você será redirecionado para o login em instantes.",
      titleColor: "text-emerald-700",
    },
    erro: {
      iconBg: "bg-red-50",
      title: "Token inválido ou expirado",
      desc: "Não conseguimos validar seu e-mail. Solicite um novo link de verificação.",
      titleColor: "text-red-700",
    },
  };

  const c = content[status];

  return (
    <>
      <Head>
        <title>Verificar E-mail | BEM Concreto</title>
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
            </div>

            {/* Ícone de status */}
            <div className={`w-16 h-16 rounded-full ${c.iconBg} flex items-center justify-center mx-auto mb-5`}>
              {status === "validando" && <Loader2 className="w-7 h-7 text-[#8D6E63] animate-spin" />}
              {status === "sucesso" && <CheckCircle2 className="w-7 h-7 text-emerald-600" />}
              {status === "erro" && <XCircle className="w-7 h-7 text-red-600" />}
            </div>

            <h2 className={`text-xl font-bold ${c.titleColor} mb-2`}>
              {c.title}
            </h2>
            <p className="text-sm text-[#6B7280] mb-7 leading-relaxed">
              {c.desc}
            </p>

            {status === "validando" && (
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="w-3/5 h-full bg-[#8D6E63] rounded-full animate-pulse" />
              </div>
            )}

            {status === "erro" && (
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Ir para o login
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Voltar ao início
                </Button>
              </div>
            )}

            {status === "sucesso" && (
              <p className="text-xs text-[#9CA3AF]">
                Redirecionando para o login…
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
