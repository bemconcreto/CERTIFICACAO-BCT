import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Certificado() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId || userId === "undefined" || userId === "null") {
      setUser(null);
      setLoading(false);
      return;
    }

    async function carregarUsuario() {
      try {
        const res = await fetch(`/api/usuario?id=${encodeURIComponent(userId)}`);
        const data = await res.json();

        if (data.ok && data.usuario) {
          setUser(data.usuario);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }

      setLoading(false);
    }

    carregarUsuario();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Gerando certificado…</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>⚠ Usuário não encontrado</h2>
        <p>Parece que você não está logado.</p>
        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "12px 20px",
            background: "#624b43",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Fazer login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#d9d9d6",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        id="certificado"
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "white",
          padding: "60px 80px",
          borderRadius: "20px",
          border: "3px solid #624b43",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Faixa Decorativa */}
        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#624b43",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        />

        {/* LOGO / TÍTULO */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#101820",
            marginBottom: 0,
            letterSpacing: 1,
          }}
        >
          BEM CONCRETO TOKEN
        </h1>

        <p
          style={{
            fontSize: 14,
            letterSpacing: 4,
            marginTop: 0,
            marginBottom: 30,
            color: "#624b43",
            fontWeight: 600,
          }}
        >
          CONSULTOR CERTIFICADO
        </p>

        {/* SELO */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "6px solid #624b43",
            margin: "0 auto 25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/selo.png"
            alt="Selo Oficial"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* CORPO DO TEXTO */}
        <p style={{ fontSize: 20, marginBottom: 10 }}>Certificamos que</p>

        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            margin: 0,
            color: "#101820",
          }}
        >
          {user.name}
        </h2>

        <p style={{ fontSize: 16, marginTop: 8, marginBottom: 40 }}>
          Portador do CPF <strong>{user.cpf}</strong>
        </p>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#333",
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          Concluiu oficialmente todos os <strong>11 módulos</strong> da
          Certificação do Consultor BCT, adquirindo o direito de atuar como
          consultor certificado com comissão de <strong>4%</strong>.
        </p>

        {/* Data */}
        <p style={{ marginTop: 20, fontSize: 16 }}>Emitido em:</p>

        <strong
          style={{
            fontSize: 18,
            color: "#624b43",
            display: "block",
            marginBottom: 40,
          }}
        >
          {new Date().toLocaleDateString()}
        </strong>

        {/* ASSINATURA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <img
            src="/assinatura.png"
            alt="Assinatura do CEO"
            style={{
              width: 180,
              margin: "0 auto -5px",
              opacity: 0.95,
            }}
          />

          <div
            style={{
              width: 250,
              height: 1,
              background: "#624b43",
              margin: "0 auto 8px",
              marginTop: -10,
            }}
          />

          <p style={{ fontSize: 14, color: "#624b43" }}>
            Bem Concreto Negócios Imobiliário
          </p>
        </div>

        <hr style={{ margin: "50px 0", borderColor: "#ccc" }} />

        {/* 🔥 BOTÃO DE BAIXAR PDF OFICIAL */}
<button
  onClick={() => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Certificado Bem Concreto",
        text: "Acabei de me certificar como Consultor BCT! 🚀",
        url: "https://certificacao.bemconcreto.com",
      })
      .catch(() => {});
    } else {
      alert("Função de compartilhamento disponível em breve!");
    }
  }}
  style={{
    padding: "12px 20px",
    background: "#101820",
    color: "white",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  }}
>
  Compartilhar Certificado
</button>

        <button
          onClick={() => router.push("/painel")}
          style={{
            padding: "12px 20px",
            background: "#624b43",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            marginLeft: 10,
          }}
        >
          Voltar ao Painel
        </button>
      </div>
    </div>
  );
}