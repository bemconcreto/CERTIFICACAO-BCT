import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    if (!form.email || !form.senha) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          pass: form.senha,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        if (data.requiresEmailVerification) {
          alert(
            "Confirme seu e-mail antes de fazer login. Você pode reenviar o e-mail de verificação abaixo."
          );
          setLoading(false);
          return;
        }

        alert(data.error || "Erro no login.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("cpf", data.user.cpf || "");
      localStorage.setItem("consultorId", data.user.consultorId || "");
      setLoading(false);

      router.push("/painel");
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro interno. Tente novamente.");
      setLoading(false);
    }
  }

  // 🔥 NOVA FUNÇÃO: AGORA ENVIA email + userId (OBRIGATÓRIO)
  async function resendVerification() {
    if (!form.email) {
      alert("Digite seu e-mail no campo acima para reenviar o link.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Buscar userId no backend
      const findUser = await fetch("/api/auth/sync-consultor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const userData = await findUser.json();

      if (!userData.ok || !userData.userId) {
        alert(userData.error || "Usuário não encontrado.");
        setLoading(false);
        return;
      }

      const userId = userData.userId;

      // 2️⃣ Enviar reenvio com email + userId
      const resend = await fetch("/api/auth/resendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, userId }),
      });

      const data = await resend.json();
      setLoading(false);

      if (data.ok) {
        alert("E-mail de verificação reenviado. Verifique sua caixa e spam.");
      } else {
        alert(data.error || "Não foi possível reenviar. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro reenviando email:", err);
      alert("Erro interno ao reenviar. Tente novamente.");
      setLoading(false);
    }
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
          Entrar
        </h1>

        <label style={labelStyle}>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handle}
          placeholder="email@exemplo.com"
          style={inputStyle}
        />

        <label style={labelStyle}>Senha</label>
        <div style={{ position: "relative" }}>
          <input
            type={mostrarSenha ? "text" : "password"}
            name="senha"
            value={form.senha}
            onChange={handle}
            placeholder="Sua senha"
            style={{ ...inputStyle, paddingRight: 44 }}
          />
          <span
            onClick={() => setMostrarSenha(!mostrarSenha)}
            style={eyeIconStyle}
          >
            {mostrarSenha ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={submit} style={buttonPrimary} disabled={loading}>
          {loading ? "Aguarde..." : "Entrar"}
        </button>

        <button
          onClick={resendVerification}
          style={buttonSecondary}
          disabled={loading}
        >
          Reenviar e-mail de verificação
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            router.push("/cadastro");
          }}
          style={buttonTertiary}
          disabled={loading}
        >
          Criar conta
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
  background: "#888",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: 15,
  fontWeight: 600,
  marginTop: 12,
  cursor: "pointer",
};

const buttonTertiary = {
  width: "100%",
  background: "#624b43",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: 15,
  fontWeight: 600,
  marginTop: 12,
  cursor: "pointer",
};