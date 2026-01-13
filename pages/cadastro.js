import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
    <div style={{ padding: 40 }}>
      <h1>Cadastro Certificação BCT</h1>

      <button onClick={() => signIn("google")}>
        Continuar com Google
      </button>
    </div>
  );
}