import { signIn } from "next-auth/react";

export default function Cadastro() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#d9d9d6",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "50px 60px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0px 6px 10px rgba(0,0,0,0.1)",
          border: "1px solid #cfcfcf",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <h1
          style={{
            marginBottom: 20,
            fontSize: 28,
            fontWeight: 700,
            color: "#101820",
          }}
        >
          Iniciar Certificação
        </h1>

        <p
          style={{
            fontSize: 15,
            marginBottom: 35,
            lineHeight: "1.5",
            color: "#333",
          }}
        >
          Faça seu cadastro com Google para iniciar sua certificação
          e dobrar sua comissão como consultor BCT.
        </p>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
          style={{
            background: "#101820",
            color: "white",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}