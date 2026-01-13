import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Cadastro() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      // 🔥 AQUI ESTAVA O BUG
      localStorage.setItem("userId", session.user.id);
      router.replace("/painel");
    }
  }, [status, session, router]);

  if (status === "loading") return null;

  return (
    <div style={wrap}>
      <div style={box}>
        <h1>Cadastro na Certificação BCT</h1>
        <p>Faça login com Google para iniciar sua certificação.</p>

        <button
          onClick={() => signIn("google")}
          style={btn}
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

const wrap = {
  display: "flex",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  background: "#d9d9d6",
};

const box = {
  background: "white",
  padding: "50px",
  borderRadius: 16,
  textAlign: "center",
  maxWidth: 420,
};

const btn = {
  marginTop: 20,
  background: "#101820",
  color: "white",
  padding: 14,
  borderRadius: 10,
  width: "100%",
};