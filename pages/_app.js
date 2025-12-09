import "../styles/layout.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    async function syncAndLogin(decoded) {
      try {
        // Cria o usuário automaticamente, caso tenha vindo do Consultor-BCT
        await fetch("/api/auth/sync-consultor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(decoded)
        });

        // Salva dados no localStorage
        localStorage.setItem("token", router.query.token);
        localStorage.setItem("userId", decoded.userId);
        localStorage.setItem("cpf", decoded.cpf);
        localStorage.setItem("consultorId", decoded.consultorId || "");

        // Redireciona para o painel após sincronizar
        router.replace("/painel");
      } catch (error) {
        console.log("Erro ao sincronizar consultor:", error);
      }
    }

    // Se o consultor veio do Consultor-BCT com ?token=
    if (router.query.token) {
      try {
        const decoded = jwt.decode(router.query.token);

        if (decoded && decoded.userId) {
          syncAndLogin(decoded);
        }
      } catch (e) {
        console.log("Token inválido");
      }
    }
  }, [router.query.token]);

  return <Component {...pageProps} />;
}