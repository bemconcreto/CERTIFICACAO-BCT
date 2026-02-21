import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Cadastro() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔥 PASSO 2 — AQUI
  useEffect(() => {
    if (session?.user?.email) {
      // ✅ salva quem é o usuário
      localStorage.setItem("email", session.user.email);

      // ✅ vai para o painel
      router.replace("/painel");
    }
  }, [session, router]);

  if (status === "loading") return null;

  return (
    <>
      <Head>
        <title>Cadastro | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>
      <div
        style={{
          display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#d9d9d6",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "55px 50px 45px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          maxWidth: 440,
          width: "100%",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "28px",
            background: "#fff",
            border: "2px solid #e8e4e1",
            boxShadow:
              "0 2px 8px rgba(122,93,83,0.08), 0 12px 40px rgba(16,24,32,0.06)",
            marginBottom: 30,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #7a5d53, #101820)",
              borderRadius: "28px 28px 0 0",
            }}
          />
          <img
            src="/logo-bct2.png"
            alt="Logo BEM"
            style={{
              width: 75,
              height: 75,
              objectFit: "contain",
              marginTop: 2,
            }}
          />
        </div>

        <h1
          style={{
            marginBottom: 8,
            fontSize: 26,
            fontWeight: 700,
            color: "#101820",
            letterSpacing: "-0.3px",
          }}
        >
          Criar Conta
        </h1>

        <p
          style={{
            fontSize: 15,
            marginBottom: 36,
            lineHeight: "1.6",
            color: "#666",
          }}
        >
          Cadastre-se para iniciar sua certificação de consultor BEM Concreto.
        </p>

        <button
          onClick={() => signIn("google")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#101820",
            color: "white",
            padding: "14px 25px",
            borderRadius: "10px",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
            marginBottom: 16,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.9 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.4-4.9l-6.2-5.2C29.3 35.5 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continuar com Google
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            background: "#624b43",
            color: "white",
            padding: "14px 25px",
            borderRadius: "10px",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Voltar
        </button>

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            color: "#aaa",
            letterSpacing: "0.3px",
          }}
        >
          Plataforma oficial de certificação BEM Concreto
        </p>
      </div>
    </div>
    </>
  );
}