import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as htmlToImage from "html-to-image";

export default function Certificado() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  //  CARREGA USUÁRIO
  // ---------------------------
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
          style={botaoVoltar}
        >
          Fazer login
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  //  🔥 FUNÇÃO PARA CRIAR IMAGEM 1080×1920 E COMPARTILHAR
  // --------------------------------------------------------
  async function compartilharCertificado() {
    try {
      // Criar DIV invisível dentro da tela (opacity 0 evita fundo preto)
      const temp = document.createElement("div");
      temp.id = "certificado-share";
      temp.style.width = "1080px";
      temp.style.height = "1920px";
      temp.style.padding = "120px 100px";
      temp.style.background = "white";
      temp.style.border = "8px solid #624b43";
      temp.style.borderRadius = "40px";
      temp.style.textAlign = "center";
      temp.style.position = "absolute";
      temp.style.top = "0";
      temp.style.left = "0";
      temp.style.opacity = "0";
      temp.style.pointerEvents = "none";
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
          <p style="font-size:30px;color:#624b43;">
            Bem Concreto Negócios Imobiliário
          </p>
        </div>
      `;

      document.body.appendChild(temp);

      // Espera carregar imagens
      await new Promise(r => setTimeout(r, 300));

      const dataUrl = await htmlToImage.toPng(temp, {
        pixelRatio: 2,
        quality: 1,
      });

      document.body.removeChild(temp);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "certificado-bct.png", {
        type: "image/png",
      });

      // Compartilhamento Nativo
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Meu Certificado BCT",
          text: "Acabei de me certificar como Consultor BCT! 🚀",
          files: [file],
        });
      } else {
        // fallback
        const a = document.createElement("a");
        a.download = "certificado-bct.png";
        a.href = dataUrl;
        a.click();
        alert("Seu navegador baixou a imagem. Compartilhe manualmente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar o certificado.");
    }
  }

  // -------------------------
  //  TELA DE CERTIFICADO
  // -------------------------
  return (
    <div style={container}>
      <div id="certificado" style={certBox}>
        {/* topo */}
        <div style={faixa} />

        <h1 style={titulo}>BEM CONCRETO TOKEN</h1>
        <p style={subtitulo}>CONSULTOR CERTIFICADO</p>

        <div style={seloBox}>
          <img src="/selo.png" style={seloImg} alt="Selo" />
        </div>

        <p style={{ fontSize: 20 }}>Certificamos que</p>
        <h2 style={nome}>{user.name}</h2>

        <p style={{ fontSize: 16, marginTop: 8 }}>
          CPF: <strong>{user.cpf}</strong>
        </p>

        <p style={texto}>
          Concluiu oficialmente todos os <strong>11 módulos</strong> da
          Certificação do Consultor BCT, adquirindo o direito de atuar com
          comissão de <strong>4%</strong>.
        </p>

        <p style={{ marginTop: 20 }}>Emitido em:</p>
        <strong style={{ fontSize: 18, color: "#624b43" }}>
          {new Date().toLocaleDateString()}
        </strong>

        <div style={{ marginTop: 40 }}>
          <img src="/assinatura.png" style={{ width: 180 }} />
          <div style={linhaAssinatura} />
          <p style={{ fontSize: 14, color: "#624b43" }}>
            Bem Concreto Negócios Imobiliário
          </p>
        </div>

        <hr style={{ margin: "50px 0" }} />

        <button onClick={compartilharCertificado} style={botaoPrincipal}>
          Compartilhar Certificado
        </button>

        <button onClick={() => router.push("/painel")} style={botaoVoltar}>
          Voltar ao Painel
        </button>
      </div>
    </div>
  );
}

/* ---------------------- */
/* ESTILOS */
/* ---------------------- */
const container = {
  minHeight: "100vh",
  background: "#d9d9d6",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
};

const certBox = {
  width: "100%",
  maxWidth: "900px",
  background: "white",
  padding: "60px 80px",
  borderRadius: "20px",
  border: "3px solid #624b43",
  textAlign: "center",
};

const faixa = {
  width: "100%",
  height: "12px",
  background: "#624b43",
  borderRadius: "10px",
  marginBottom: "30px",
};

const titulo = {
  fontSize: 32,
  fontWeight: 800,
  color: "#101820",
  marginBottom: 0,
  letterSpacing: 1,
};

const subtitulo = {
  fontSize: 14,
  letterSpacing: 4,
  marginTop: 0,
  marginBottom: 30,
  color: "#624b43",
  fontWeight: 600,
};

const seloBox = {
  width: 150,
  height: 150,
  borderRadius: "50%",
  border: "6px solid #624b43",
  margin: "0 auto 25px",
  overflow: "hidden",
};

const seloImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const nome = {
  fontSize: 32,
  fontWeight: 800,
  margin: 0,
  color: "#101820",
};

const texto = {
  fontSize: 18,
  lineHeight: 1.6,
  color: "#333",
  maxWidth: 600,
  margin: "0 auto 40px",
};

const linhaAssinatura = {
  width: 250,
  height: 1,
  background: "#624b43",
  margin: "0 auto 8px",
};

const botaoPrincipal = {
  padding: "12px 20px",
  background: "#101820",
  color: "white",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};

const botaoVoltar = {
  padding: "12px 20px",
  background: "#624b43",
  color: "white",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  marginLeft: 10,
};