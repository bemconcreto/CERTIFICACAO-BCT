import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Loader2, CheckCircle2, XCircle, GraduationCap } from "lucide-react";
import { modules } from "../../lib/modules";
import { concluirModulo } from "../../lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Prova() {
  const router = useRouter();
  const { id } = router.query;

  const [modulo, setModulo] = useState(null);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);

  // ======================================================
  // 🔹 Carregar módulo
  // ======================================================
  useEffect(() => {
    if (!id) return;
    const mod = modules.find((m) => m.id === Number(id));
    setModulo(mod);
  }, [id]);

  // ======================================================
  // 🔹 Salvar progresso ao passar na prova
  // ======================================================
  useEffect(() => {
    async function salvarProgresso() {
      if (score !== 100) return;

      const email = localStorage.getItem("email");
      if (!email) {
        alert("Sessão expirada. Faça login novamente.");
        router.replace("/login");
        return;
      }

      await concluirModulo(email, Number(id));
    }

    salvarProgresso();
  }, [score, id, router]);

  // ======================================================
  // 🔹 Criar certificado automaticamente no último módulo
  // ======================================================
  useEffect(() => {
    async function criarCertificado() {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        await fetch("/api/certificado/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            modulesCount: 11,
            note: "Concluiu toda certificação BEM",
          }),
        });
      } catch (err) {
        console.error("Erro criando certificado:", err);
      }
    }

    if (score === 100 && Number(id) === 11) {
      criarCertificado();
    }
  }, [score, id]);

  // ======================================================
  // 🔹 Enviar prova
  // ======================================================
  const enviarProva = () => {
    let acertos = 0;

    modulo.questions.forEach((q, index) => {
      if (selected[index] === q.a) acertos++;
    });

    const nota = Math.round(
      (acertos / modulo.questions.length) * 100
    );

    setScore(nota);
  };

  // ======================================================
  // 🔹 Loading
  // ======================================================
  if (!modulo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#8D6E63] animate-spin" />
          <p className="text-sm text-[#6B7280]">Carregando módulo...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // 🔹 Render
  // ======================================================
  return (
    <div className="min-h-screen bg-[#F7F8F9] flex justify-center px-5 py-10">
      <Head>
        <title>Prova — {modulo.title} | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="w-full max-w-[900px] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/painel")}
            className="self-start flex items-center gap-2 text-sm font-semibold text-[#8D6E63] bg-white border border-[#8D6E63]/40 rounded-xl px-4 py-2 hover:bg-[#8D6E63]/5 hover:border-[#8D6E63] transition-all shadow-sm"
          >
            ← Voltar para o Início
          </button>
          <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
            Prova — {modulo.title}
          </h1>
        </div>

        {/* ===================== */}
        {/* PROVA */}
        {/* ===================== */}
        {score === null && (
          <>
            <div className="flex flex-col gap-4">
              {modulo.questions.map((q, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[#101820]">{q.q}</p>

                    <div className="flex flex-col gap-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors",
                            selected[index] === opt
                              ? "border-[#8D6E63] bg-[#8D6E63]/[0.06] text-[#101820]"
                              : "border-[#E5E7EB] text-[#374151] hover:border-[#8D6E63]/30"
                          )}
                        >
                          <input
                            type="radio"
                            name={`q${index}`}
                            value={opt}
                            checked={selected[index] === opt}
                            onChange={() =>
                              setSelected((prev) => ({
                                ...prev,
                                [index]: opt,
                              }))
                            }
                            className="accent-[#8D6E63]"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={enviarProva}
              className="w-full sm:w-auto self-start rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm px-6 py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
            >
              Enviar Prova
            </Button>
          </>
        )}

        {/* ===================== */}
        {/* RESULTADO */}
        {/* ===================== */}
        {score !== null && (
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    score === 100 ? "bg-emerald-50" : "bg-red-50"
                  )}
                >
                  {score === 100 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#101820]">Resultado: {score}%</h2>
                  {score === 100 ? (
                    <p className="text-sm text-emerald-600 font-medium">
                      Parabéns! Você foi aprovado.
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      Você não atingiu 100%. Tente novamente.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push(`/modulos/${Number(id) + 1}`)}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm px-6 py-3.5 h-auto shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Ir para o próximo módulo
                </Button>

                <Button
                  onClick={() => router.push("/painel")}
                  variant="outline"
                  className="rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm px-6 py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
                >
                  Voltar ao Painel
                </Button>

                {Number(id) === 11 && score === 100 && (
                  <Button
                    onClick={() => router.push("/certificado")}
                    className="rounded-xl bg-gradient-to-r from-[#101820] to-[#101820]/85 text-white font-semibold text-sm px-6 py-3.5 h-auto shadow-md shadow-[#101820]/20 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Gerar Certificado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
