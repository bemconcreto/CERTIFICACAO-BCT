import { useRouter } from "next/router";
import { modules } from "../../lib/modules";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Head from "next/head";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Modulo() {
  const router = useRouter();
  const { id } = router.query;

  const [modulo, setModulo] = useState(null);

  // ======================================================
  // 🔒 BLOQUEIO DE ACESSO A MÓDULOS (PADRÃO FINAL)
  // ======================================================
  useEffect(() => {
    async function validarAcesso() {
      const email = localStorage.getItem("email");

      // 🔥 SEM EMAIL = SEM SESSÃO
      if (!email) {
        router.replace("/cadastro");
        return;
      }

      try {
        // 🔹 BUSCA PROGRESSO PELO EMAIL (FONTE ÚNICA)
        const resProg = await fetch(
          `/api/modulos/progresso?email=${email}`
        );
        const dataProg = await resProg.json();

        const concluidos = dataProg.modulos || [];
        const moduloNumero = Number(id);

        // 🔐 Regra: só acessa até (último concluído + 1)
        if (moduloNumero > concluidos.length + 1) {
          alert(
            "Você não pode acessar este módulo antes de concluir os anteriores."
          );
          router.replace("/painel");
        }
      } catch (err) {
        console.error("Erro validando acesso ao módulo:", err);
        router.replace("/painel");
      }
    }

    if (id) validarAcesso();
  }, [id, router]);

  // ======================================================
  // 🔹 CARREGA CONTEÚDO DO MÓDULO
  // ======================================================
  useEffect(() => {
    if (id) {
      const mod = modules.find((m) => m.id === Number(id));
      setModulo(mod);
    }
  }, [id]);

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

  return (
    <div className="min-h-screen bg-[#F7F8F9] flex justify-center px-5 py-10">
      <Head>
        <title>{modulo.title} | Certificação BEM Concreto</title>
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
            {modulo.title}
          </h1>
        </div>

        <Card>
          <CardContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold text-[#101820] mt-8 mb-3" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-bold text-[#101820] mt-7 mb-2.5" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-base font-semibold text-[#101820] mt-6 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-sm text-[#374151] leading-relaxed mb-3.5" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="text-sm text-[#374151] leading-relaxed mb-3.5 pl-5 list-disc space-y-1.5" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-8 border-t border-[#E5E7EB]" {...props} />
                ),
              }}
            >
              {modulo.content}
            </ReactMarkdown>
          </CardContent>
        </Card>

        {/* BOTÃO PARA PROVA */}
        <Button
          onClick={() => router.push(`/prova/${modulo.id}`)}
          className="w-full sm:w-auto self-start rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm px-6 py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
        >
          Iniciar Prova do Módulo
        </Button>
      </div>
    </div>
  );
}
