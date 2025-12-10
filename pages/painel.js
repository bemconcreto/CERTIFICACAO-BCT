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

  // ------------------------------------------------------
  // Carregar usuário + progresso inicial
  // ------------------------------------------------------
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    async function carregar() {
      try {
        const resUser = await fetch(`/api/usuario?id=${userId}`);
        const dataUser = await resUser.json();

        if (!dataUser.ok) {
          setLoading(false);
          return;
        }

        setUsuario(dataUser.usuario);

        const resProg = await fetch(`/api/modulos/progresso?userId=${userId}`);
        const dataProg = await resProg.json();
        if (dataProg.ok) setProgresso(dataProg.modulos);

      } catch (err) {
        console.log("Erro carregar painel:", err);
      }

      setLoading(false);
    }

    carregar();
  }, []);

  // ------------------------------------------------------
  // 🔥 AUTO-REFRESH (verifica pagamento a cada 3s)
  // ------------------------------------------------------
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/usuario?id=${userId}`);
      const data = await res.json();

      if (data.ok) {
        setUsuario(data.usuario);

        if (data.usuario.is_paid_certification) {
          router.push("/painel");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------
  // FUNÇÃO PARA GERAR PAGAMENTO PIX
  // ------------------------------------------------------
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

  // ------------------------------------------------------
  // Calcular módulo atual
  // ------------------------------------------------------
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) return <div style={{ padding: 40 }}>Carregando painel…</div>;

  // ------------------------------------------------------
  // TELA DE PAGAMENTO (quando ainda não foi pago)
  // ------------------------------------------------------
  if (!usuario?.is_paid_certification) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d6",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
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
          <h2 style={{ marginBottom: 10 }}>🎓 Falta Pouco!</h2>
          <p>Para acessar a Certificação BCT, finalize o pagamento único:</p>

          <h1 style={{ color: "#624b43", margin: "20px 0" }}>R$ 17,77</h1>

          <button
            onClick={gerarPagamento}
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: 12,
              cursor: "pointer",
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
                background: "#ffffff",
                border: "1px solid #ccc",
                width: "100%",
                maxWidth: "460px",
                marginLeft: "auto",
                marginRight: "auto",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ textAlign: "center" }}>Código PIX Copia e Cola:</h3>

              <textarea
                readOnly
                wrap="soft"
                value={pagamento.pixCopyPaste}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: 140,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontSize: 14,
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
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

  // ------------------------------------------------------
  // PAINEL LIBERADO APÓS PAGAMENTO
  // ------------------------------------------------------
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
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#101820" }}>
          Bem-vindo(a), {usuario?.name} 👋
        </h1>

        <p style={{ color: "#333", marginTop: 10 }}>
          Acompanhe sua jornada de certificação.
        </p>

        {/* Aqui você coloca o restante do painel */}
      </div>
    </div>
  );
}