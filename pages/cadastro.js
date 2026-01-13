import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Cadastro() {
  const { status } = useSession();
  const router = useRouter();

  // 🔥 Se já estiver logado, não pode ficar no cadastro
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/painel");
    }
  }, [status, router]);

  // evita flicker / erro
  if (status === "loading") return null;

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
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>
          Cadastro na Certificação BCT
        </h1>

        <p style={{ marginBottom: 30 }}>
          Faça login com Google para iniciar sua certificação.
        </p>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/painel", // 🎯 DESTINO FINAL
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
          Continuar com Google
        </button>
      </div>
    </div>
  );
}

/**
 * 🚨 FUNDAMENTAL
 * Impede o Next de tentar SSG nessa página
 */
export async function getServerSideProps() {
  return { props: {} };
}