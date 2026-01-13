import { signIn } from "next-auth/react";

export default function Login() {
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
            marginBottom: 25,
            fontSize: 28,
            fontWeight: 700,
            color: "#101820",
          }}
        >
          Continuar Certificação
        </h1>

        <p
          style={{
            fontSize: 15,
            marginBottom: 35,
            color: "#333",
          }}
        >
          Entre com sua conta Google para continuar sua certificação.
        </p>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
          style={{
            background: "#624b43",
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