import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Validar() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function validate(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/certificado/validate?code=${code}`);
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: "Erro ao validar. Tente novamente." });
    }

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Validar Certificado | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        <button
          onClick={() => router.push("/")}
          className="absolute top-5 left-5 flex items-center gap-1.5 text-xs font-semibold text-[#8D6E63] hover:underline z-10"
        >
          ← Voltar para o Início
        </button>

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#8D6E63]/[0.04] blur-[80px]" />
        </div>

        <div className="relative w-full max-w-[480px]">
          <form
            onSubmit={validate}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center"
          >
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
                Validar Certificado
              </h1>
              <p className="text-sm text-[#6B7280] mt-1.5">
                Insira o código do certificado para verificar sua autenticidade.
              </p>
            </div>

            <div className="text-left mb-5">
              <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
                Código do certificado
              </label>
              <Input
                type="text"
                placeholder="Ex: BEM-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-11 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? "Validando…" : "Validar"}
            </Button>

            {/* Resultado */}
            {result && (
              <div
                className={`mt-6 p-5 rounded-2xl border text-left ${
                  result.ok
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      result.ok ? "bg-emerald-100" : "bg-red-100"
                    }`}
                  >
                    {result.ok ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4.5 h-4.5 text-red-600" />
                    )}
                  </span>
                  <strong className={`text-sm ${result.ok ? "text-emerald-700" : "text-red-700"}`}>
                    {result.ok ? "Certificado válido!" : "Certificado não encontrado"}
                  </strong>
                </div>

                {result.ok && result.certificado && (
                  <div className="ml-12 space-y-1">
                    <p className="text-sm text-[#374151]">
                      <span className="font-semibold text-[#6B7280]">Nome:</span>{" "}
                      {result.certificado.name || result.certificado.nome}
                    </p>
                    {result.certificado.cpf && (
                      <p className="text-sm text-[#374151]">
                        <span className="font-semibold text-[#6B7280]">CPF:</span> {result.certificado.cpf}
                      </p>
                    )}
                    {result.certificado.date && (
                      <p className="text-sm text-[#374151]">
                        <span className="font-semibold text-[#6B7280]">Data:</span> {result.certificado.date}
                      </p>
                    )}
                  </div>
                )}

                {!result.ok && result.error && (
                  <p className="ml-12 text-sm text-red-700">
                    {result.error}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
