import { useEffect } from "react";

export default function Cadastro() {
  useEffect(() => {
    const callbackUrl =
      "https://certificacao.bemconcreto.com/painel";

    const loginUrl =
      "https://consultor.bemconcreto.com/?callbackUrl=" +
      encodeURIComponent(callbackUrl);

    window.location.href = loginUrl;
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