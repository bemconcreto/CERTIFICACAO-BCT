import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { modules } from "../lib/modules";

export default function Painel() {
  const router = useRouter();
  const totalModulos = modules.length;

  const [usuario, setUsuario] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagamento, setPagamento] = useState(null);
  const [modalPix, setModalPix] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  // ======================================================
  // 🔄 Auto-refresh a cada 5 segundos
  // ======================================================
  useEffect(() => {
    const interval = setInterval(() => atualizarUsuario(), 5000);
    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // Carregar ao abrir
  // ======================================================
  useEffect(() => {
    atualizarUsuario();
  }, []);

  async function atualizarUsuario() {
    const userId = localStorage.getItem("userId");

    if (!userId) return router.push("/login");

    try {
      const resUser = await fetch(`/api/usuario?id=${userId}`);
      const dataUser = await resUser.json();

      if (dataUser.ok) {
        const user = dataUser.usuario;
        setUsuario(user);

        // 🔥 Se pagamento foi confirmado → mostrar tela de sucesso
        if (user.is_paid_certification && modalPix) {
          setPagamentoConfirmado(true);
          setModalPix(false);

          setTimeout(() => {
            setPagamentoConfirmado(false);
          }, 2500);
        }
      }

      const resProg = await fetch(`/api/modulos/progresso?userId=${userId}`);
      const dataProg = await resProg.json();
      if (dataProg.ok) setProgresso(dataProg.modulos);

    } catch (err) {
      console.log("Erro atualizar painel:", err);
    }

    setLoading(false);
  }

  // ======================================================
  // Criar pagamento PIX
  // ======================================================
  async function gerarPagamento() {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: usuario.email,
          cpf: usuario.cpf,
          name: usuario.name,
        }),
      });

      const data = await res.json();
      console.log("RESPOSTA FRONT:", data);

      if (!data.ok) {
        alert("Erro ao gerar pagamento.");
        return;
      }

      setPagamento({
        pixCopyPaste: data.pixCopyPaste,
        chargeId: data.charge_id,
      });

      setModalPix(true);

    } catch (err) {
      console.log("Erro pagamento:", err);
      alert("Erro interno ao criar pagamento.");
    }
  }

  // ======================================================
  // Progresso
  // ======================================================
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) return <div style={{ padding: 40 }}>Carregando painel…</div>;

  // ======================================================================
  // 🎉 Tela suave de "Pagamento Confirmado"
  // ======================================================================
  if (pagamentoConfirmado) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#d9d9d6",
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px 30px",
            borderRadius: 20,
            maxWidth: 500,
            width: "100%",
            boxShadow: "0px 6px 14px rgba(0,0,0,0.1)",
            border: "1px solid #ccc",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2ecc71" }}>
            ✔ Pagamento Confirmado!
          </h2>

          <p style={{ marginTop: 10, fontSize: 16 }}>
            Seu acesso foi liberado com sucesso.
          </p>

          <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
            Redirecionando…
          </p>
        </div>
      </div>
    );
  }

  // ======================================================================
  // 🟡 Tela do PIX
  // ======================================================================
  if (!usuario?.is_paid_certification) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d6",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px 30px",
            borderRadius: 20,
            maxWidth: "520px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #ccc",
            boxShadow: "0px 6px 14px rgba(0,0,0,0.08)",
          }}
        >
          <h2>🎓 Falta Pouco!</h2>
          <p>Finalize o pagamento único:</p>

          <h1 style={{ color: "#624b43", margin: "20px 0" }}>R$ 17,77</h1>

          <button
            onClick={gerarPagamento}
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: 12,
              fontWeight: 600,
              width: "100%",
            }}
          >
            Pagar Agora via PIX
          </button>

          {modalPix && pagamento && (
<div
  style={{
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    background: "white",
    border: "1px solid #ccc",
    maxWidth: "460px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
  }}
>
              <h3 style={{ textAlign: "center" }}>Código PIX Copia e Cola:</h3>

              <textarea
                readOnly
                value={pagamento.pixCopyPaste}
                style={{
                  width: "100%",
                  height: 140,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                }}
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(pagamento.pixCopyPaste);
                  alert("Código PIX copiado!");
                }}
                style={{
                  marginTop: 12,
                  padding: "12px 16px",
                  background: "#624b43",
                  color: "white",
                  borderRadius: 10,
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                Copiar Código PIX
              </button>

              <p
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Assim que o pagamento for confirmado, seu acesso será liberado automaticamente.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======================================================================
  // 🎓 PAINEL COMPLETO (após pagamento)
  // ======================================================================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#d9d9d6",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 900, width: "100%" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>
          Bem-vindo(a), {usuario?.name} 👋
        </h1>

        <p style={{ marginBottom: 30 }}>
          Acompanhe sua jornada de certificação:
        </p>

        {/* Barra de Progresso */}
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 16,
            border: "1px solid #ccc",
            marginBottom: 40,
          }}
        >
          <h2>Progresso da Certificação</h2>

          <div
            style={{
              width: "100%",
              height: 18,
              background: "#eee",
              borderRadius: 20,
              overflow: "hidden",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: "#624b43",
              }}
            />
          </div>

          <button
            onClick={() =>
              atual === "concluido"
                ? router.push("/certificado")
                : router.push(`/modulos/${atual}`)
            }
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {atual === "concluido"
              ? "Emitir Certificado"
              : `Continuar no Módulo ${atual}`}
          </button>
        </div>

        {/* Lista de Módulos */}
        {modules.map((mod) => {
          const completed = progresso.includes(mod.id);
          const locked = !completed && mod.id > atual;

          return (
            <div
              key={mod.id}
              style={{
                background: "white",
                padding: 20,
                marginBottom: 14,
                borderRadius: 12,
                border: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{mod.title}</strong>
                <p style={{ margin: 0 }}>
                  {completed
                    ? "✔ Concluído"
                    : locked
                    ? "🔒 Bloqueado"
                    : "▶ Disponível"}
                </p>
              </div>

              <button
                disabled={locked}
                onClick={() => router.push(`/modulos/${mod.id}`)}
                style={{
                  padding: "10px 18px",
                  background: locked
                    ? "#bbb"
                    : completed
                    ? "#2ecc71"
                    : "#624b43",
                  color: "white",
                  borderRadius: 10,
                }}
              >
                {completed ? "Revisar" : "Acessar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}