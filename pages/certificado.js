import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import * as htmlToImage from "html-to-image";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <Head>
          <title>Certificado | BEM Concreto</title>
          <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
        </Head>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#8D6E63] animate-spin" />
          <p className="text-sm text-[#6B7280]">Gerando certificado…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        <Head>
          <title>Certificado | BEM Concreto</title>
          <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
        </Head>

        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#8D6E63]/[0.04] blur-[80px]" />
        </div>

        <div className="relative w-full max-w-[440px]">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8D6E63]/20 to-[#CBA35C]/10 blur-xl" />
                <div className="relative w-24 h-24 rounded-2xl bg-white border border-[#E5E7EB]/60 flex items-center justify-center shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D6E63] to-[#101820]" />
                  <img src="/logo-bct2.png" alt="Logo BEM" className="w-14 h-14 object-contain" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#101820] tracking-tight">
                Usuário não encontrado
              </h2>
              <p className="text-sm text-[#6B7280] mt-1.5">
                Parece que você não está logado. Faça login para acessar seu certificado.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Fazer login
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Voltar ao início
              </Button>
            </div>
          </div>
        </div>
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
      temp.style.border = "8px solid #8D6E63";
      temp.style.borderRadius = "40px";
      temp.style.textAlign = "center";
      temp.style.position = "absolute";
      temp.style.top = "0";
      temp.style.left = "0";
      temp.style.opacity = "0";
      temp.style.pointerEvents = "none";
      temp.style.zIndex = "-1";

      temp.innerHTML = `
        <h1 style="font-size:70px;font-weight:800;color:#101820;margin:0;">CONSULTOR BEM</h1>
        <p style="font-size:32px;letter-spacing:5px;margin:10px 0;color:#8D6E63;">CERTIFICADO</p>

        <div style="width:320px;height:320px;border-radius:50%;border:12px solid #8D6E63;margin:40px auto;overflow:hidden;">
          <img src="/selo.png" style="width:100%;height:100%;object-fit:cover;" />
        </div>

        <p style="font-size:40px;margin:0;">Certificamos que</p>

        <h2 style="font-size:70px;font-weight:900;margin:20px 0;color:#101820;">
          ${user.name}
        </h2>

        <p style="font-size:38px;line-height:1.6;color:#333;margin:40px auto;width:80%;">
          Concluiu oficialmente todos os 11 módulos da Certificação do Consultor BEM,
          adquirindo o direito de atuar com comissão de <strong>4%</strong>.
        </p>

        <p style="font-size:34px;margin-top:60px;">Emitido em:</p>
        <strong style="font-size:40px;color:#8D6E63;">
          ${new Date().toLocaleDateString()}
        </strong>

        <div style="margin-top:80px;">
          <img src="/assinatura.png" style="width:380px;opacity:0.9;" />
          <div style="width:440px;height:3px;background:#8D6E63;margin:0 auto 10px;"></div>
          <p style="font-size:30px;color:#8D6E63;">
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
      const file = new File([blob], "certificado-bem.png", {
        type: "image/png",
      });

      // Compartilhamento Nativo
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Meu Certificado BEM",
          text: "Acabei de me certificar como Consultor BEM! 🚀",
          files: [file],
        });
      } else {
        // fallback
        const a = document.createElement("a");
        a.download = "certificado-bem.png";
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
    <div className="min-h-screen bg-[#F7F8F9] flex justify-center px-5 py-10">
      <Head>
        <title>Certificado | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="w-full max-w-[900px] flex flex-col gap-4">
        <button
          onClick={() => router.push("/painel")}
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#8D6E63] hover:underline"
        >
          ← Voltar para o Início
        </button>

      <div id="certificado" className="w-full bg-white rounded-3xl border-[3px] border-[#8D6E63] px-8 sm:px-20 py-12 text-center">
        {/* topo */}
        <div className="w-full h-3 rounded-full bg-[#8D6E63] mb-8" />

        <h1 className="text-3xl font-extrabold text-[#101820] tracking-wide">BEM CONCRETO</h1>
        <p className="text-sm font-semibold text-[#8D6E63] tracking-[4px] mt-1 mb-7">
          CONSULTOR CERTIFICADO
        </p>

        <div className="w-[150px] h-[150px] rounded-full border-[6px] border-[#8D6E63] mx-auto mb-6 overflow-hidden">
          <img src="/selo.png" alt="Selo" className="w-full h-full object-cover" />
        </div>

        <p className="text-lg text-[#374151]">Certificamos que</p>
        <h2 className="text-3xl font-extrabold text-[#101820] mt-1">{user.name}</h2>

        <p className="text-sm text-[#374151] mt-2">
          CPF: <strong>{user.cpf}</strong>
        </p>

        <p className="text-base text-[#374151] leading-relaxed max-w-[600px] mx-auto mt-5 mb-8">
          Concluiu oficialmente todos os <strong>11 módulos</strong> da
          Certificação do Consultor BEM, adquirindo o direito de atuar com
          comissão de <strong>4%</strong>.
        </p>

        <p className="text-sm text-[#374151] mt-5">Emitido em:</p>
        <strong className="text-lg text-[#8D6E63]">
          {new Date().toLocaleDateString()}
        </strong>

        <div className="mt-10">
          <img src="/assinatura.png" alt="Assinatura" className="w-[180px] mx-auto" />
          <div className="w-[250px] h-px bg-[#8D6E63] mx-auto mb-2" />
          <p className="text-sm text-[#8D6E63]">
            Bem Concreto Negócios Imobiliário
          </p>
        </div>

        <hr className="my-12 border-[#E5E7EB]" />

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={compartilharCertificado}
            className="rounded-xl bg-gradient-to-r from-[#101820] to-[#101820]/85 text-white font-semibold text-sm px-6 py-3.5 h-auto shadow-md shadow-[#101820]/20 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Certificado
          </Button>

          <Button
            onClick={() => router.push("/painel")}
            variant="outline"
            className="rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm px-6 py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
          >
            Voltar ao Painel
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
