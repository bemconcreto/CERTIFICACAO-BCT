import { useState } from "react";
import Head from "next/head";

export default function Validar() {
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
    <div style={container}>
      <Head>
        <title>Validar Certificado | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <form onSubmit={validate} style={card}>
        {/* Logo */}
        <div style={logoContainer}>
          <div style={logoAccent} />
          <img src="/logo-bct2.png" alt="Logo BEM" style={logoImg} />
        </div>

        <h1 style={titulo}>Validar Certificado</h1>
        <p style={subtitulo}>
          Insira o código do certificado para verificar sua autenticidade.
        </p>

        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <label style={label}>Código do certificado</label>
          <input
            type="text"
            placeholder="Ex: BEM-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={input}
          />
        </div>

        <button type="submit" disabled={loading} style={btnPrimary}>
          {loading ? "Validando…" : "Validar"}
        </button>

        {/* Resultado */}
        {result && (
          <div style={{
            marginTop: 24,
            padding: "20px 20px",
            borderRadius: 14,
            background: result.ok ? "#f0fdf4" : "#fef3f2",
            border: `1px solid ${result.ok ? "#bbf7d0" : "#fecaca"}`,
            textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: result.ok ? "#dcfce7" : "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}>
                {result.ok ? "✅" : "❌"}
              </span>
              <strong style={{
                fontSize: 16,
                color: result.ok ? "#166534" : "#991b1b",
              }}>
                {result.ok ? "Certificado válido!" : "Certificado não encontrado"}
              </strong>
            </div>

            {result.ok && result.certificado && (
              <div style={{ marginLeft: 46 }}>
                <p style={resultLine}><span style={resultLabel}>Nome:</span> {result.certificado.name || result.certificado.nome}</p>
                {result.certificado.cpf && <p style={resultLine}><span style={resultLabel}>CPF:</span> {result.certificado.cpf}</p>}
                {result.certificado.date && <p style={resultLine}><span style={resultLabel}>Data:</span> {result.certificado.date}</p>}
              </div>
            )}

            {!result.ok && result.error && (
              <p style={{ margin: "0 0 0 46px", fontSize: 14, color: "#b91c1c" }}>
                {result.error}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

/* ================== ESTILOS ================== */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#d9d9d6",
  padding: "40px 20px",
};

const card = {
  background: "white",
  padding: "40px 36px",
  borderRadius: 20,
  maxWidth: 480,
  width: "100%",
  textAlign: "center",
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
};

const logoContainer = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 100,
  height: 100,
  borderRadius: 24,
  background: "#fff",
  border: "2px solid #e8e4e1",
  boxShadow: "0 2px 8px rgba(122,93,83,0.08), 0 12px 40px rgba(16,24,32,0.06)",
  marginBottom: 24,
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
  borderRadius: "24px 24px 0 0",
};

const logoImg = {
  width: 62,
  height: 62,
  objectFit: "contain",
  marginTop: 2,
};

const titulo = {
  fontSize: 24,
  fontWeight: 700,
  color: "#101820",
  margin: "0 0 6px 0",
};

const subtitulo = {
  fontSize: 15,
  color: "#888",
  margin: "0 0 28px 0",
  lineHeight: "1.5",
};

const label = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#555",
  marginBottom: 6,
};

const input = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  background: "#fafafa",
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "14px 22px",
  background: "#101820",
  color: "white",
  borderRadius: 12,
  width: "100%",
  fontWeight: 600,
  fontSize: 16,
  border: "none",
  cursor: "pointer",
};

const resultLine = {
  margin: "4px 0",
  fontSize: 14,
  color: "#333",
};

const resultLabel = {
  fontWeight: 600,
  color: "#555",
};