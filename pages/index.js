import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Certificação Consultor | BEM Concreto</title>
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
                Certificação Consultor
              </h1>
              <h2 className="mt-1 text-sm font-semibold text-[#8D6E63] uppercase tracking-[2px]">
                BEM Concreto
              </h2>
            </div>

            {/* Divider */}
            <div className="w-12 h-[3px] bg-[#8D6E63] rounded-full mx-auto mb-6" />

            <p className="text-sm leading-relaxed text-[#6B7280] mb-8">
              Torne-se um consultor certificado e aumente sua comissão de{" "}
              <span className="font-bold text-[#101820] bg-[#8D6E63]/10 px-2 py-0.5 rounded-md">
                2% para 4%
              </span>
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/cadastro")}
                className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Iniciar Certificação
              </Button>

              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Continuar Certificação
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
