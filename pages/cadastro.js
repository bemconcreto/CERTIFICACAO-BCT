import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { validarCPF } from "../lib/cpfUtils";

export default function Cadastro() {
  const router = useRouter();

  const consultorIdFromUrl = router.query.consultorId || null;

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    email: "",
    telefone: "",
    instagram: "",
    senha: "",
    confirmarSenha: "",
    consultorId: consultorIdFromUrl,
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    if (!validarCPF(form.cpf)) {
      alert("CPF inválido!");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error);
      return;
    }

    await fetch("/api/auth/sendVerificationEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        userId: data.user.id,
      }),
    });

    alert("Conta criada! Confirme seu e-mail para continuar.");
    router.push("/login");
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
          Criar Conta
        </h1>

        {/* Nome */}
        <label style={labelStyle}>Nome Completo</label>
        <input name="name" value={form.name} onChange={handle} style={inputStyle} />

        {/* CPF */}
        <label style={labelStyle}>CPF</label>
        <input name="cpf" value={form.cpf} onChange={handle} style={inputStyle} />

        {/* Email */}
        <label style={labelStyle}>Email</label>
        <input name="email" value={form.email} onChange={handle} style={inputStyle} />

        {/* Telefone */}
        <label style={labelStyle}>Telefone</label>
        <input name="telefone" value={form.telefone} onChange={handle} style={inputStyle} />

        {/* Instagram */}
        <label style={labelStyle}>Instagram</label>
        <input name="instagram" value={form.instagram} onChange={handle} style={inputStyle} />

        {/* Senha */}
        <label style={labelStyle}>Senha</label>
        <div style={{ position: "relative" }}>
          <input
            type={mostrarSenha ? "text" : "password"}
            name="senha"
            value={form.senha}
            onChange={handle}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <span onClick={() => setMostrarSenha(!mostrarSenha)} style={eyeIconStyle}>
            {mostrarSenha ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirmar Senha */}
        <label style={labelStyle}>Confirmar Senha</label>
        <div style={{ position: "relative" }}>
          <input
            type={mostrarConfirmarSenha ? "text" : "password"}
            name="confirmarSenha"
            value={form.confirmarSenha}
            onChange={handle}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <span
            onClick={() =>
              setMostrarConfirmarSenha(!mostrarConfirmarSenha)
            }
            style={eyeIconStyle}
          >
            {mostrarConfirmarSenha ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Botões */}
        <button onClick={submit} style={buttonPrimary}>Cadastrar</button>

        <button
          onClick={() => router.push("/login")}
          style={buttonSecondary}
        >
          Já tenho conta
        </button>
      </div>
    </div>
  );
}

const eyeIconStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: 18,
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginTop: 15,
  marginBottom: 5,
  color: "#101820",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 15,
  marginBottom: 12,
  boxSizing: "border-box",
};

const buttonPrimary = {
  width: "100%",
  background: "#101820",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: 16,
  fontWeight: 600,
  marginTop: 20,
  cursor: "pointer",
};

const buttonSecondary = {
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
};