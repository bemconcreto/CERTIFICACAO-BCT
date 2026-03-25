import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function VerificarEmail() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("validando");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const res = await fetch("/api/auth/verifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("sucesso");
        localStorage.setItem("emailVerified", "true");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setStatus("erro");
      }
    }

    verify();
  }, [token]);

  const content = {
    validando: {
      iconBg: "#f0f4ff",
      title: "Validando seu e-mail…",
      desc: "Aguarde enquanto verificamos seu token.",
      titleColor: "#101820",
    },
    sucesso: {
      icon: "✅",
      iconBg: "#f0fdf4",
      title: "E-mail confirmado!",
      desc: "Tudo certo! Você será redirecionado para o login em instantes.",
      titleColor: "#166534",
    },
    erro: {
      icon: "❌",
      iconBg: "#fef3f2",
      title: "Token inválido ou expirado",
      desc: "Não conseguimos validar seu e-mail. Solicite um novo link de verificação.",
      titleColor: "#991b1b",
    },
  };

  const c = content[status];

  return (
    <div style={container}>
      <Head>
        <title>Verificar E-mail | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div style={card}>
        {/* Logo */}
        <div style={logoContainer}>
          <div style={logoAccent} />
          <img src="/logo-bct2.png" alt="Logo BEM" style={logoImg} />
        </div>

        {/* Ícone de status */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: c.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 28,
        }}>
          {c.icon}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: c.titleColor, margin: "0 0 8px 0" }}>
          {c.title}
        </h2>
        <p style={{ color: "#888", fontSize: 15, lineHeight: "1.6", margin: "0 0 28px 0" }}>
          {c.desc}
        </p>

        {status === "validando" && (
          <div style={{
            width: "100%",
            height: 6,
            background: "#eee",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, #624b43, #7a5d53)",
              borderRadius: 10,
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          </div>
        )}

        {status === "erro" && (
          <>
            <button
              onClick={() => router.push("/login")}
              style={btnPrimary}
            >
              Ir para o login
            </button>
            <button
              onClick={() => router.push("/")}
              style={btnSecondary}
            >
              Voltar ao início
            </button>
          </>
        )}

        {status === "sucesso" && (
          <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
            Redirecionando para o login…
          </p>
        )}
      </div>
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
  maxWidth: 440,
  width: "100%",
  textAlign: "center",
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
};

const logoContainer = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 90,
  height: 90,
  borderRadius: 22,
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
  borderRadius: "22px 22px 0 0",
};

const logoImg = {
  width: 55,
  height: 55,
  objectFit: "contain",
  marginTop: 2,
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