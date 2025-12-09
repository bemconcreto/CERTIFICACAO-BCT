import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../lib/session";

export default function Pagamento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, []);

  async function gerarCobranca() {
    setLoading(true);

    const userId = localStorage.getItem("userId");

    const res = await fetch("/api/asaas/gerar-cobranca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Erro ao gerar cobrança.");
      setLoading(false);
      return;
    }

    // link retornado pela Asaas
    window.location.href = data.checkoutUrl;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        background: "#d9d9d6",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px 35px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontWeight: 700,
            fontSize: 28,
            color: "#101820",
          }}
        >
          Pagamento da Certificação
        </h1>

        <p style={{ textAlign: "center", marginBottom: 25 }}>
          Para iniciar a certificação, realize o pagamento único de:
        </p>

        <h2
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 30,
            color: "#624b43",
          }}
        >
          R$ 17,77
        </h2>

        <button
          onClick={gerarCobranca}
          disabled={loading}
          style={{
            width: "100%",
            background: "#101820",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 10,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Gerando cobrança..." : "Pagar e Iniciar Certificação"}
        </button>

        <button
          onClick={() => router.push("/painel")}
          style={{
            width: "100%",
            background: "#624b43",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}