import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { CheckCircle2, Lock, Loader2, Copy, GraduationCap } from "lucide-react";
import { modules } from "../lib/modules";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Painel() {
  const router = useRouter();
  const totalModulos = modules.length;

  // 🔑 FONTE ÚNICA DE IDENTIDADE (GOOGLE)
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const [usuario, setUsuario] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagamento, setPagamento] = useState(null);
  const [modalPix, setModalPix] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  // ======================================================
  // 🔄 Auto-refresh a cada 5 segundos
  // ======================================================
  useEffect(() => {
    const interval = setInterval(() => {
      atualizarUsuario();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // 🔄 Polling do status do pagamento no Asaas (a cada 5s enquanto modal PIX aberto)
  // ======================================================
  useEffect(() => {
    if (!modalPix || !pagamento?.chargeId || !usuario?.email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/pagamento/verificar?chargeId=${pagamento.chargeId}&email=${encodeURIComponent(usuario.email)}`
        );
        const data = await res.json();

        if (data.ok && data.isPaid) {
          console.log("✅ Pagamento confirmado via polling!");
          setPagamentoConfirmado(true);
          setModalPix(false);
          atualizarUsuario();

          setTimeout(() => {
            setPagamentoConfirmado(false);
          }, 2500);
        }
      } catch (err) {
        console.log("Erro polling pagamento:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [modalPix, pagamento, usuario]);

  // ======================================================
  // Carregar usuário ao abrir
  // ======================================================
  useEffect(() => {
    atualizarUsuario();
  }, []);

  async function atualizarUsuario() {
    try {
      if (!email) {
        setLoading(false);
        return;
      }

      // 🔹 USUÁRIO
      const resUser = await fetch(`/api/usuario?email=${email}`);
      const dataUser = await resUser.json();

      if (dataUser.ok) {
        const user = dataUser.usuario;
        setUsuario(user);

        // 🎉 Se pagamento foi confirmado e estava no PIX
        if (user.is_paid_certification && modalPix) {
          setPagamentoConfirmado(true);
          setModalPix(false);

          setTimeout(() => {
            setPagamentoConfirmado(false);
          }, 2500);
        }
      }

      // 🔹 PROGRESSO
      const resProg = await fetch(
        `/api/modulos/progresso?email=${email}`
      );
      const dataProg = await resProg.json();

      if (dataProg.ok) setProgresso(dataProg.modulos);
    } catch (err) {
      console.log("Erro atualizar painel:", err);
    }

    setLoading(false);
  }

  // ======================================================
  // Criar pagamento PIX
  // ======================================================
  async function gerarPagamento() {
    try {
      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          cpf: usuario.cpf,
          name: usuario.name,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert("Erro ao gerar pagamento.");
        return;
      }

      setPagamento({
        pixCopyPaste: data.pixCopyPaste,
        chargeId: data.charge_id,
      });

      setModalPix(true);
    } catch (err) {
      alert("Erro interno ao criar pagamento.");
    }
  }

  // ======================================================
  // Progresso
  // ======================================================
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
      <Head>
        <title>Painel | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-[#8D6E63] animate-spin" />
        <p className="text-sm text-[#6B7280]">Carregando painel…</p>
      </div>
    </div>
  );

  // ======================================================
  // 🎉 Tela de pagamento confirmado
  // ======================================================
  if (pagamentoConfirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        <Head>
          <title>Pagamento Confirmado | BEM Concreto</title>
          <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
        </Head>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
        </div>
        <div className="relative w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Pagamento Confirmado!
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Seu acesso foi liberado com sucesso. Prepare-se para iniciar sua certificação.
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // 💰 Tela de pagamento
  // ======================================================
  if (!usuario?.is_paid_certification) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        <Head>
          <title>Pagamento | Certificação BEM Concreto</title>
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
                Falta pouco!
              </h2>
              <p className="text-sm text-[#6B7280] mt-1.5">
                Finalize o pagamento único para liberar todos os módulos da certificação.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB]/60 bg-[#8D6E63]/[0.04] px-6 py-5 mb-6">
              <p className="text-xs text-[#6B7280] mb-1">Valor da certificação</p>
              <h1 className="text-3xl font-extrabold text-[#101820]">R$ 17,77</h1>
            </div>

            <Button
              onClick={gerarPagamento}
              className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
            >
              Pagar via PIX
            </Button>

            <p className="mt-7 text-xs text-[#9CA3AF] tracking-wide">
              Plataforma oficial de certificação BEM Concreto
            </p>
          </div>
        </div>

        <Dialog
          open={modalPix && !!pagamento}
          onOpenChange={(open) => !open && setModalPix(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pagamento via PIX</DialogTitle>
              <DialogDescription>
                Copie o código abaixo no app do seu banco para concluir o pagamento.
              </DialogDescription>
            </DialogHeader>

            <textarea
              readOnly
              value={pagamento?.pixCopyPaste || ""}
              className="w-full h-32 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-xs text-[#374151] resize-none focus:outline-none"
            />

            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(pagamento?.pixCopyPaste || "")}
              className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
            >
              <Copy className="w-4 h-4" />
              Copiar código PIX
            </Button>

            <p className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Aguardando confirmação do pagamento…
            </p>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ======================================================
  // 🎓 PAINEL COMPLETO
  // ======================================================
  return (
    <div className="min-h-screen bg-[#F7F8F9] flex justify-center px-5 py-10">
      <Head>
        <title>Painel | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="w-full max-w-[900px] flex flex-col gap-6">
        {/* Header */}
        <Card>
          <CardContent className="flex items-center gap-5">
            <div className="relative w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB]/60 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D6E63] to-[#101820]" />
              <img src="/logo-bct2.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
                Olá, {usuario?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Acompanhe sua jornada de certificação BEM Concreto.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Barra de progresso */}
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#101820]">
                Progresso da Certificação
              </h2>
              <span className={cn("text-sm font-bold", percent === 100 ? "text-emerald-600" : "text-[#8D6E63]")}>
                {percent}%
              </span>
            </div>

            <Progress
              value={percent}
              className={cn("h-2.5", percent === 100 && "[&>[data-slot=progress-indicator]]:bg-emerald-500")}
            />

            <p className="text-xs text-[#9CA3AF]">
              {progresso.length} de {totalModulos} módulos concluídos
            </p>

            <Button
              onClick={() =>
                atual === "concluido"
                  ? router.push("/certificado")
                  : router.push(`/modulos/${atual}`)
              }
              className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
            >
              {atual === "concluido" ? (
                <>
                  <GraduationCap className="w-4 h-4" />
                  Emitir Certificado
                </>
              ) : (
                `Continuar Módulo ${atual}`
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de módulos */}
        <div>
          <h3 className="text-sm font-bold text-[#101820] mb-3">
            Módulos da Certificação
          </h3>

          <div className="flex flex-col gap-3">
            {modules.map((mod) => {
              const completed = progresso.includes(mod.id);
              const isCurrent = mod.id === atual;
              const locked = !completed && mod.id > atual;

              return (
                <Card
                  key={mod.id}
                  className={cn(
                    "py-0 border-l-4",
                    completed ? "border-l-emerald-500" : isCurrent ? "border-l-[#8D6E63]" : "border-l-[#E5E7EB]"
                  )}
                >
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0",
                          completed
                            ? "bg-emerald-50 text-emerald-600"
                            : isCurrent
                            ? "bg-[#8D6E63]/10 text-[#8D6E63]"
                            : "bg-[#F5F5F5] text-[#BBBBBB]"
                        )}
                      >
                        {completed ? <CheckCircle2 className="w-4 h-4" /> : mod.id}
                      </span>
                      <div className="min-w-0">
                        <p className={cn("text-sm font-semibold truncate", locked ? "text-[#BBBBBB]" : "text-[#101820]")}>
                          {mod.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            completed ? "text-emerald-600" : isCurrent ? "text-[#8D6E63]" : "text-[#BBBBBB]"
                          )}
                        >
                          {completed ? "Concluído" : isCurrent ? "Em andamento" : "Bloqueado"}
                        </p>
                      </div>
                    </div>

                    <Button
                      disabled={locked}
                      onClick={() => router.push(`/modulos/${mod.id}`)}
                      size="sm"
                      variant={completed ? "outline" : locked ? "ghost" : "default"}
                      className={cn(
                        "rounded-lg font-semibold",
                        completed && "border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50",
                        !completed && !locked && "bg-[#8D6E63] hover:bg-[#8D6E63]/90 text-white shadow-none"
                      )}
                    >
                      {completed ? "Revisar" : locked ? <Lock className="w-4 h-4" /> : "Acessar"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
