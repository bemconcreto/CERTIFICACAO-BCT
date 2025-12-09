import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as htmlToImage from "html-to-image";

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
        if (data.ok && data.usuario) setUser(data.usuario);
        else setUser(null);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }

    carregarUsuario();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Gerando certificado…</div>;

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>⚠ Usuário não encontrado</h2>
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

  // --------------------------------------------------------
  //  🔥 FUNÇÃO PARA COMPARTILHAR A IMAGEM 1080x1920 (SEM CPF)
  // --------------------------------------------------------
  async function compartilharCertificado() {
    try {
      // Criar DIV oculta 1080x1920
      const temp = document.createElement("div");
      temp.id = "certificado-share";
      temp.style.width = "1080px";
      temp.style.height = "1920px";
      temp.style.padding = "120px 100px";
      temp.style.background = "white";
      temp.style.border = "8px solid #624b43";
      temp.style.borderRadius = "40px";
      temp.style.textAlign = "center";
      temp.style.position = "fixed";
      temp.style.top = "-5000px"; // escondido
      temp.style.left = "-5000px";
      temp.style.zIndex = "-1";

      temp.innerHTML = `
        <h1 style="font-size:70px;font-weight:800;color:#101820;margin:0;">CONSULTOR BCT</h1>
        <p style="font-size:32px;letter-spacing:5px;margin:10px 0;color:#624b43;">CERTIFICADO</p>

        <div style="width:320px;height:320px;border-radius:50%;border:12px solid #624b43;margin:40px auto;overflow:hidden;">
          <img src="/selo.png" style="width:100%;height:100%;object-fit:cover;" />
        </div>

        <p style="font-size:40px;margin:0;">Certificamos que</p>

        <h2 style="font-size:70px;font-weight:900;margin:20px 0;color:#101820;">
          ${user.name}
        </h2>

        <p style="font-size:38px;line-height:1.6;color:#333;margin:40px auto;width:80%;">
          Concluiu oficialmente todos os 11 módulos da Certificação do Consultor BCT,
          adquirindo o direito de atuar com comissão de <strong>4%</strong>.
        </p>

        <p style="font-size:34px;margin-top:60px;">Emitido em:</p>
        <strong style="font-size:40px;color:#624b43;">
          ${new Date().toLocaleDateString()}
        </strong>

        <div style="margin-top:80px;">
          <img src="/assinatura.png" style="width:380px;opacity:0.9;" />
          <div style="width:440px;height:3px;background:#624b43;margin:0 auto 10px;"></div>
          <p style="font-size:30px;color:#624b43;">Bem Concreto Negócios Imobiliário</p>
        </div>
      `;

      document.body.appendChild(temp);

      // Gerar imagem
      const dataUrl = await htmlToImage.toPng(temp, {
        pixelRatio: 2,
        quality: 1,
      });

      document.body.removeChild(temp);

      // Converter para arquivo
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "certificado-bct.png", { type: "image/png" });

      // Tenta compartilhar
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Meu Certificado BCT",
          text: "Acabei de me certificar como Consultor BCT! 🚀",
          files: [file],
        });
      } else {
        alert(
          "A imagem foi gerada! Mas o compartilhamento direto não é suportado neste navegador.\nEla será baixada para você compartilhar manualmente."
        );
        
        // Baixar fallback
        const link = document.createElement("a");
        link.download = "certificado-bct.png";
        link.href = dataUrl;
        link.click();
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao gerar/compartilhar o certificado.");
    }
  }

  // ----------------------------
  //       RENDER PRINCIPAL
  // ----------------------------
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
        }}
      >
        {/* Certificado Oficial (com CPF) */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#101820" }}>
          BEM CONCRETO TOKEN
        </h1>

        <p style={{ letterSpacing: 4, color: "#624b43", fontWeight: 600 }}>
          CONSULTOR CERTIFICADO
        </p>

        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "6px solid #624b43",
            margin: "0 auto 25px",
            overflow: "hidden",
          }}
        >
          <img src="/selo.png" style={{ width: "100%", height: "100%" }} />
        </div>

        <p style={{ fontSize: 20 }}>Certificamos que</p>

        <h2 style={{ fontSize: 32, fontWeight: 700 }}>{user.name}</h2>

        <p style={{ fontSize: 16 }}>
          Portador do CPF <strong>{user.cpf}</strong>
        </p>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Concluiu oficialmente todos os 11 módulos da Certificação do Consultor BCT.
        </p>

        <p style={{ marginTop: 20 }}>Emitido em:</p>
        <strong style={{ color: "#624b43" }}>
          {new Date().toLocaleDateString()}
        </strong>

        <hr style={{ margin: "40px 0" }} />

        {/* Botões */}
        <button
          onClick={compartilharCertificado}
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