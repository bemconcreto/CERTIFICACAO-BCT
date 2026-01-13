import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { modules } from "../lib/modules";

export default function Painel() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [usuario, setUsuario] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagamento, setPagamento] = useState(null);
  const [modalPix, setModalPix] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const totalModulos = modules.length;

  /* ================= PROTEÇÃO ================= */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div style={{ padding: 40 }}>Carregando sessão…</div>;
  }

  if (!session?.user?.email) {
    return null;
  }

  /* ================= USUÁRIO ================= */
  useEffect(() => {
    carregarUsuario();
    const interval = setInterval(carregarUsuario, 5000);
    return () => clearInterval(interval);
  }, []);

  async function carregarUsuario() {
    try {
      const res = await fetch("/api/usuario/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
        }),
      });

      const data = await res.json();
      if (!data.ok) return;

      setUsuario(data.usuario);

      const resProg = await fetch(
        `/api/modulos/progresso?email=${session.user.email}`
      );
      const dataProg = await resProg.json();
      if (dataProg.ok) setProgresso(dataProg.modulos);

      if (data.usuario.is_paid_certification && modalPix) {
        setPagamentoConfirmado(true);
        setModalPix(false);
        setTimeout(() => setPagamentoConfirmado(false), 2500);
      }
    } catch (err) {
      console.error("Erro painel:", err);
    }

    setLoading(false);
  }

  /* ================= PAGAMENTO ================= */
  async function gerarPagamento() {
    try {
      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: usuario.name,
          cpf: usuario.cpf,
        }),
      });

      const data = await res.json();
      if (!data.ok) return alert("Erro ao gerar pagamento");

      setPagamento({
        pixCopyPaste: data.pixCopyPaste,
        chargeId: data.charge_id,
      });

      setModalPix(true);
    } catch {
      alert("Erro interno");
    }
  }

  /* ================= PROGRESSO ================= */
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) return <div style={{ padding: 40 }}>Carregando painel…</div>;

  /* ================= CONFIRMADO ================= */
  if (pagamentoConfirmado) {
    return (
      <div style={center}>
        <div style={card}>
          <h2 style={{ color: "#2ecc71" }}>✔ Pagamento confirmado</h2>
          <p>Acesso liberado.</p>
        </div>
      </div>
    );
  }

  /* ================= PIX ================= */
  if (!usuario?.is_paid_certification) {
    return (
      <div style={center}>
        <div style={card}>
          <h2>🎓 Falta pouco!</h2>
          <p>Pagamento único:</p>

          <h1 style={{ color: "#624b43" }}>R$ 17,77</h1>

          <button style={btnPrimary} onClick={gerarPagamento}>
            Pagar via PIX
          </button>

          {modalPix && pagamento && (
            <>
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
                Copiar código PIX
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ================= PAINEL ================= */
  return (
    <div style={container}>
      <h1>Bem-vindo(a), {usuario.name} 👋</h1>
      <p>Progresso da Certificação</p>

      <div style={progressBar}>
        <div style={{ ...progressFill, width: `${percent}%` }} />
      </div>

      <button
        style={btnPrimary}
        onClick={() =>
          atual === "concluido"
            ? router.push("/certificado")
            : router.push(`/modulos/${atual}`)
        }
      >
        {atual === "concluido"
          ? "Emitir Certificado"
          : `Continuar no Módulo ${atual}`}
      </button>

      {modules.map((mod) => {
        const completed = progresso.includes(mod.id);
        const locked = !completed && mod.id > atual;

        return (
          <div key={mod.id} style={moduleCard}>
            <strong>{mod.title}</strong>
            <button
              disabled={locked}
              onClick={() => router.push(`/modulos/${mod.id}`)}
            >
              {completed ? "Revisar" : "Acessar"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= ESTILOS ================= */

const center = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#d9d9d6",
};

const container = {
  padding: 40,
  background: "#d9d9d6",
  minHeight: "100vh",
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
  margin: "20px 0",
};

const progressFill = {
  height: "100%",
  background: "#624b43",
};

const moduleCard = {
  background: "white",
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
};