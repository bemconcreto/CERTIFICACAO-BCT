import Head from "next/head";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ValidarCertificado({ certificado }) {
  return (
    <>
      <Head>
        <title>Validar Certificado | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F9] p-5">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#8D6E63]/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[#CBA35C]/[0.06] blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#8D6E63]/[0.04] blur-[80px]" />
        </div>

        <div className="relative w-full max-w-[480px]">
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

              <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
                Validação de Certificado
              </h1>
            </div>

            <div
              className={`p-5 rounded-2xl border text-left ${
                certificado
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    certificado ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  {certificado ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-red-600" />
                  )}
                </span>
                <strong className={`text-sm ${certificado ? "text-emerald-700" : "text-red-700"}`}>
                  {certificado ? "Certificado válido!" : "Certificado não encontrado"}
                </strong>
              </div>

              {certificado ? (
                <div className="ml-12 space-y-1">
                  <p className="text-sm text-[#374151]">
                    <span className="font-semibold text-[#6B7280]">Nome:</span> {certificado.name}
                  </p>
                  <p className="text-sm text-[#374151]">
                    <span className="font-semibold text-[#6B7280]">CPF:</span> {certificado.cpf}
                  </p>
                  <p className="text-sm text-[#374151]">
                    <span className="font-semibold text-[#6B7280]">Emitido em:</span>{" "}
                    {new Date(certificado.certified_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[#374151]">
                    <span className="font-semibold text-[#6B7280]">ID do Certificado:</span>{" "}
                    {certificado.certificate_id}
                  </p>
                </div>
              ) : (
                <p className="ml-12 text-sm text-red-700">
                  O código informado não existe ou foi removido.
                </p>
              )}
            </div>

            <p className="mt-7 text-xs text-[#9CA3AF] tracking-wide">
              Plataforma oficial de certificação BEM Concreto
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const res = await fetch(`${supabaseUrl}/rest/v1/users?certificate_id=eq.${id}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  const data = await res.json();

  return {
    props: {
      certificado: data.length ? data[0] : null,
    },
  };
}
