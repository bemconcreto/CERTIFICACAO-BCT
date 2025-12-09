import { useRouter } from "next/router";
import { modules } from "../../lib/modules";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Modulo() {
  const router = useRouter();
  const { id } = router.query;

  const [modulo, setModulo] = useState(null);

  // 🔒 BLOQUEIO DE ACESSO A MÓDULOS
  useEffect(() => {
    async function validarAcesso() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        return router.replace("/login");
      }

      // Carregar progresso real do Supabase
      const resProg = await fetch(`/api/modulos/progresso?userId=${userId}`);
      const dataProg = await resProg.json();

      const concluidos = dataProg.modulos || [];
      const moduloNumero = Number(id);

      // 🔐 Regra: usuário só pode acessar até (último concluído + 1)
      if (moduloNumero > concluidos.length + 1) {
        alert("Você não pode acessar este módulo antes de concluir os anteriores.");
        return router.replace("/painel");
      }
    }

    if (id) validarAcesso();
  }, [id]);

  // 🔹 Carrega conteúdo do módulo
  useEffect(() => {
    if (id) {
      const mod = modules.find((m) => m.id === Number(id));
      setModulo(mod);
    }
  }, [id]);

  if (!modulo) {
    return (
      <div style={{ padding: 40, fontSize: 18 }}>
        Carregando módulo...
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>{modulo.title}</h1>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 style={{ fontSize: "28px", marginTop: 30 }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ fontSize: "24px", marginTop: 25 }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ fontSize: "20px", marginTop: 20 }} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p style={{ marginBottom: 14, lineHeight: 1.6 }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ marginBottom: 14, paddingLeft: 22 }} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: 6 }} {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr
              style={{
                margin: "30px 0",
                border: 0,
                borderBottom: "1px solid #ccc",
              }}
              {...props}
            />
          ),
        }}
      >
        {modulo.content}
      </ReactMarkdown>

      {/* BOTÃO PARA PROVA */}
      <button
        onClick={() => router.push(`/prova/${modulo.id}`)}
        style={{
          marginTop: 30,
          padding: "14px 22px",
          background: "#101820",
          color: "white",
          borderRadius: 10,
          fontSize: 18,
          border: "none",
          cursor: "pointer",
        }}
      >
        Iniciar Prova do Módulo
      </button>
    </div>
  );
}