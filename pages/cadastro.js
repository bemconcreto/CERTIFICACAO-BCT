import { useEffect } from "react";

export default function Cadastro() {
  useEffect(() => {
    // Redireciona para login central do ecossistema BCT
    window.location.href = "https://consultor.bemconcreto.com";
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#d9d9d6",
        fontSize: 16,
        color: "#101820",
      }}
    >
      Redirecionando para login…
    </div>
  );
}