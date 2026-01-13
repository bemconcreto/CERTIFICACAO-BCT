import { signIn } from "next-auth/react";

export default function Cadastro() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background: "#d9d9d6",
    }}>
      <div style={{
        background: "white",
        padding: "50px 60px",
        borderRadius: "16px",
        textAlign: "center",
        border: "1px solid #cfcfcf",
        maxWidth: 420,
        width: "100%",
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>
          Cadastro na Certificação BCT
        </h1>

        <p style={{ marginBottom: 30 }}>
          Faça login com Google para iniciar sua certificação.
        </p>

        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/painel" })
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
          Continuar com Google
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}