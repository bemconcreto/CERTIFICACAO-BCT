import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", cpf: "", email: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErro("");

    if (!form.name || !form.cpf || !form.email || !form.pass) {
      setErro("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        window.location.href = "/checkout";
      } else {
        setErro(data.error || "Erro ao criar conta.");
      }
    } catch {
      setErro("Erro interno. Tente novamente.");
    }

    setLoading(false);
  }

  return (
    <div style={container}>
      <Head>
        <title>Criar Conta | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <form onSubmit={submit} style={card}>
        {/* Logo */}
        <div style={logoContainer}>
          <div style={logoAccent} />
          <img src="/logo-bct2.png" alt="Logo BEM" style={logoImg} />
        </div>

        <h1 style={titulo}>Criar Conta</h1>
        <p style={subtitulo}>
          Preencha seus dados para iniciar a certificação.
        </p>

        {erro && (
          <div style={erroBox}>
            <span style={{ fontSize: 14 }}>⚠</span> {erro}
          </div>
        )}

        <div style={inputGroup}>
          <label style={label}>Nome completo</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={input}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            style={input}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={input}
          />
        </div>

        <div style={inputGroup}>
          <label style={label}>Senha</label>
          <input
            type="password"
            placeholder="Crie uma senha"
            value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
            style={input}
          />
        </div>

        <button type="submit" disabled={loading} style={btnPrimary}>
          {loading ? "Criando conta…" : "Cadastrar"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          style={btnSecondary}
        >
          Já tenho conta → Entrar
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          style={btnLink}
        >
          ← Voltar ao início
        </button>
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
  maxWidth: 460,
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

const erroBox = {
  background: "#fef3f2",
  border: "1px solid #fecaca",
  borderRadius: 10,
  padding: "10px 14px",
  marginBottom: 20,
  fontSize: 14,
  color: "#b91c1c",
  textAlign: "left",
};

const inputGroup = {
  marginBottom: 18,
  textAlign: "left",
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
  transition: "border 0.2s",
};

const btnPrimary = {
  marginTop: 8,
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

const btnSecondary = {
  marginTop: 10,
  padding: "12px 20px",
  background: "#624b43",
  color: "white",
  borderRadius: 10,
  width: "100%",
  fontWeight: 600,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
};

const btnLink = {
  marginTop: 16,
  padding: 0,
  background: "none",
  color: "#888",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
};