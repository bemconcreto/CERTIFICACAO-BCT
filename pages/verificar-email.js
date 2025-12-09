import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerificarEmail() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("validando");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const res = await fetch("/api/auth/verifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("sucesso");

        // Guardar no localStorage
        localStorage.setItem("emailVerified", "true");

        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("erro");
      }
    }

    verify();
  }, [token]);

  return (
    <div style={{ padding: 40 }}>
      {status === "validando" && <h2>Validando seu e-mail...</h2>}
      {status === "sucesso" && <h2>E-mail confirmado com sucesso! 🎉</h2>}
      {status === "erro" && <h2>Token inválido ou expirado.</h2>}
    </div>
  );
}