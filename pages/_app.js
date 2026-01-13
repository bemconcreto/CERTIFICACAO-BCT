import "../styles/layout.css"; // 🔥 mantém a fonte e o layout
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    async function syncAndLogin(decoded) {
      try {
        await fetch("/api/auth/sync-consultor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(decoded),
        });

        localStorage.setItem("token", router.query.token);
        localStorage.setItem("userId", decoded.userId);
        localStorage.setItem("cpf", decoded.cpf);
        localStorage.setItem("consultorId", decoded.consultorId || "");

        router.replace("/painel");
      } catch (error) {
        console.log("Erro ao sincronizar consultor:", error);
      }
    }

    if (router.query.token) {
      try {
        const decoded = jwt.decode(router.query.token);

        if (decoded?.userId) {
          syncAndLogin(decoded);
        }
      } catch {
        console.log("Token inválido");
      }
    }
  }, [router.query.token]);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}