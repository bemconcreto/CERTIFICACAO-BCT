import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", cpf: "", email: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErro("");

    if (!form.name || !form.cpf || !form.email || !form.pass) {
      setErro("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        window.location.href = "/checkout";
      } else {
        setErro(data.error || "Erro ao criar conta.");
      }
    } catch {
      setErro("Erro interno. Tente novamente.");
    }

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Criar Conta | Certificação BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#8D6E63]/[0.04] blur-[80px]" />
        </div>

        <div className="relative w-full max-w-[460px]">
          <form
            onSubmit={submit}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center"
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8D6E63]/20 to-[#CBA35C]/10 blur-xl" />
                <div className="relative w-24 h-24 rounded-2xl bg-white border border-[#E5E7EB]/60 flex items-center justify-center shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D6E63] to-[#101820]" />
                  <img src="/logo-bct2.png" alt="Logo BEM" className="w-14 h-14 object-contain" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
                Criar Conta
              </h1>
              <p className="text-sm text-[#6B7280] mt-1.5">
                Preencha seus dados para iniciar a certificação.
              </p>
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-left bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {erro}
              </div>
            )}

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
                  Nome completo
                </label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
                  CPF
                </label>
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
                  E-mail
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="Crie uma senha"
                  value={form.pass}
                  onChange={(e) => setForm({ ...form, pass: e.target.value })}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85 text-white font-semibold text-sm py-3.5 h-auto shadow-md shadow-[#8D6E63]/20 hover:shadow-lg hover:shadow-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                {loading ? "Criando conta…" : "Cadastrar"}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/login")}
                variant="outline"
                className="w-full rounded-xl bg-white border-[#E5E7EB] text-[#101820] font-medium text-sm py-3.5 h-auto shadow-sm hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-300 active:scale-[0.98]"
              >
                Já tenho conta → Entrar
              </Button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                ← Voltar ao início
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
