import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Cadastro() {
  const { status } = useSession();
  const router = useRouter();

  // 🔐 Se já está logado, manda direto pro painel
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/painel");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Consultor BCT</h1>

        <button
          style={googleButton}
          onClick={() =>
            signIn("google", {
              callbackUrl: "/painel",
            })
          }
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

/**
 * 🚨 Mantém SSR para evitar bug de build / loop
 */
export async function getServerSideProps() {
  return { props: {} };
}

/* ================== ESTILOS ================== */

const page = {
  minHeight: "100vh",
  background: "#efede9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const card = {
  background: "white",
  borderRadius: 24,
  padding: "40px 30px",
  width: "100%",
  maxWidth: 420,
  textAlign: "center",
  boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
};

const title = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 30,
  color: "#101820",
};

const googleButton = {
  width: "100%",
  padding: "16px",
  background: "#000",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};