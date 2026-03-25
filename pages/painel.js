import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { modules } from "../lib/modules";

export default function Painel() {
  const router = useRouter();
  const totalModulos = modules.length;

  // 🔑 FONTE ÚNICA DE IDENTIDADE (GOOGLE)
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

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
    const interval = setInterval(() => {
      atualizarUsuario();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // Carregar usuário ao abrir
  // ======================================================
  useEffect(() => {
    atualizarUsuario();
  }, []);

  async function atualizarUsuario() {
    try {
      if (!email) {
        setLoading(false);
        return;
      }

      // 🔹 USUÁRIO
      const resUser = await fetch(`/api/usuario?email=${email}`);
      const dataUser = await resUser.json();

      if (dataUser.ok) {
        const user = dataUser.usuario;
        setUsuario(user);

        // 🎉 Se pagamento foi confirmado e estava no PIX
        if (user.is_paid_certification && modalPix) {
          setPagamentoConfirmado(true);
          setModalPix(false);

          setTimeout(() => {
            setPagamentoConfirmado(false);
          }, 2500);
        }
      }

      // 🔹 PROGRESSO
      const resProg = await fetch(
        `/api/modulos/progresso?email=${email}`
      );
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
      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          cpf: usuario.cpf,
          name: usuario.name,
        }),
      });

      const data = await res.json();

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

  if (loading) return (
    <div style={center}>
      <Head>
        <title>Painel | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>
      <p style={{ fontSize: 18, color: "#555" }}>Carregando painel…</p>
    </div>
  );

  // ======================================================
  // 🎉 Tela de pagamento confirmado
  // ======================================================
  if (pagamentoConfirmado) {
    return (
      <div style={center}>
        <Head>
          <title>Pagamento Confirmado | BEM Concreto</title>
          <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
        </Head>
        <div style={card}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#27ae60", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Pagamento Confirmado!
          </h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: "1.6" }}>
            Seu acesso foi liberado com sucesso. Prepare-se para iniciar sua certificação.
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // 💰 Tela de pagamento
  // ======================================================
  if (!usuario?.is_paid_certification) {
    return (
      <div style={center}>
        <Head>
          <title>Pagamento | Certificação BEM Concreto</title>
          <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
        </Head>
        <div style={card}>
          {/* Logo */}
          <div style={logoContainer}>
            <div style={logoAccent} />
            <img src="/logo-bct2.png" alt="Logo BEM" style={logoImg} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#101820", marginBottom: 8 }}>
            Falta pouco!
          </h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: "1.6", marginBottom: 24 }}>
            Finalize o pagamento único para liberar todos os módulos da certificação.
          </p>

          <div style={{
            background: "#f8f6f5",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 28,
            border: "1px solid #e8e4e1",
          }}>
            <p style={{ fontSize: 13, color: "#888", margin: 0, marginBottom: 4 }}>Valor da certificação</p>
            <h1 style={{ fontSize: 36, color: "#101820", fontWeight: 800, margin: 0 }}>
              R$ 17,77
            </h1>
          </div>

          <button style={btnPrimary} onClick={gerarPagamento}>
            Pagar via PIX
          </button>

          {modalPix && pagamento && (
            <div style={{
              marginTop: 20,
              background: "#f9f9f9",
              borderRadius: 12,
              padding: 20,
              border: "1px solid #e0e0e0",
            }}>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px 0" }}>Código PIX Copia e Cola:</p>
              <textarea
                readOnly
                value={pagamento.pixCopyPaste}
                style={textarea}
              />
              <button
                style={btnSecondary}
                onClick={() =>
                  navigator.clipboard.writeText(pagamento.pixCopyPaste)
                }
              >
                📋 Copiar código PIX
              </button>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 12, marginBottom: 0 }}>
                Aguardando confirmação do pagamento…
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======================================================
  // 🎓 PAINEL COMPLETO
  // ======================================================
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
      <Head>
        <title>Painel | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div style={{ width: "100%", maxWidth: "900px" }}>
        {/* Header */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "35px 40px",
          marginBottom: 24,
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#f8f6f5",
            border: "2px solid #e8e4e1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #7a5d53, #101820)",
              borderRadius: "16px 16px 0 0",
            }} />
            <img src="/logo-bct2.png" alt="Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#101820", margin: 0 }}>
              Olá, {usuario?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#888", margin: "4px 0 0 0", fontSize: 14 }}>
              Acompanhe sua jornada de certificação BEM Concreto.
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div
          style={{
            background: "white",
            padding: "30px 40px",
            borderRadius: 20,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#101820" }}>
              Progresso da Certificação
            </h2>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: percent === 100 ? "#27ae60" : "#624b43",
            }}>
              {percent}%
            </span>
          </div>

          <div style={progressBar}>
            <div style={{
              ...progressFill,
              width: `${percent}%`,
              background: percent === 100
                ? "linear-gradient(90deg, #27ae60, #2ecc71)"
                : "linear-gradient(90deg, #624b43, #7a5d53)",
            }} />
          </div>

          <p style={{ fontSize: 13, color: "#aaa", margin: "12px 0 20px 0" }}>
            {progresso.length} de {totalModulos} módulos concluídos
          </p>

          <button
            onClick={() =>
              atual === "concluido"
                ? router.push("/certificado")
                : router.push(`/modulos/${atual}`)
            }
            style={btnPrimary}
          >
            {atual === "concluido"
              ? "🎓 Emitir Certificado"
              : `Continuar Módulo ${atual}`}
          </button>
        </div>

        {/* Lista de módulos */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#101820", marginBottom: 16, marginTop: 32 }}>
          Módulos da Certificação
        </h3>

        {modules.map((mod) => {
          const completed = progresso.includes(mod.id);
          const isCurrent = mod.id === atual;
          const locked = !completed && mod.id > atual;

          return (
            <div
              key={mod.id}
              style={{
                ...moduleCard,
                borderLeft: `4px solid ${
                  completed ? "#27ae60" : isCurrent ? "#624b43" : "#e0e0e0"
                }`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    background: completed ? "#e8f8ef" : isCurrent ? "#f5f0ed" : "#f5f5f5",
                    color: completed ? "#27ae60" : isCurrent ? "#624b43" : "#bbb",
                  }}>
                    {completed ? "✓" : mod.id}
                  </span>
                  <strong style={{ fontSize: 15, color: locked ? "#bbb" : "#101820" }}>
                    {mod.title}
                  </strong>
                </div>
                <p style={{
                  margin: "0 0 0 38px",
                  fontSize: 13,
                  color: completed ? "#27ae60" : isCurrent ? "#624b43" : "#bbb",
                  fontWeight: 500,
                }}>
                  {completed ? "Concluído" : isCurrent ? "Em andamento" : "Bloqueado"}
                </p>
              </div>

              <button
                disabled={locked}
                onClick={() => router.push(`/modulos/${mod.id}`)}
                style={{
                  padding: "10px 20px",
                  background: locked
                    ? "#eee"
                    : completed
                    ? "#27ae60"
                    : "#624b43",
                  color: locked ? "#bbb" : "white",
                  borderRadius: 10,
                  border: "none",
                  cursor: locked ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {completed ? "Revisar" : locked ? "🔒" : "Acessar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================== ESTILOS ================== */

const center = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#d9d9d6",
};

const card = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  maxWidth: 500,
  width: "100%",
  textAlign: "center",
  border: "1px solid #ccc",
};

const btnPrimary = {
  marginTop: 20,
  padding: "14px 22px",
  background: "#101820",
  color: "white",
  borderRadius: 12,
  width: "100%",
  fontWeight: 600,
};

const btnSecondary = {
  marginTop: 10,
  padding: "12px",
  background: "#624b43",
  color: "white",
  borderRadius: 10,
  width: "100%",
};

const textarea = {
  width: "100%",
  height: 120,
  marginTop: 10,
};

const progressBar = {
  width: "100%",
  height: 18,
  background: "#eee",
  borderRadius: 20,
  overflow: "hidden",
  marginBottom: 20,
};

const progressFill = {
  height: "100%",
  background: "#624b43",
};

const moduleCard = {
  background: "white",
  padding: 20,
  marginBottom: 14,
  borderRadius: 12,
  border: "1px solid #ccc",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoContainer = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 120,
  height: 120,
  borderRadius: 28,
  background: "#fff",
  border: "2px solid #e8e4e1",
  boxShadow: "0 2px 8px rgba(122,93,83,0.08), 0 12px 40px rgba(16,24,32,0.06)",
  marginBottom: 30,
  position: "relative",
  overflow: "hidden",
};

const logoAccent = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: "linear-gradient(90deg, #7a5d53, #101820)",
  borderRadius: "28px 28px 0 0",
};

const logoImg = {
  width: 75,
  height: 75,
  objectFit: "contain",
  marginTop: 2,
};