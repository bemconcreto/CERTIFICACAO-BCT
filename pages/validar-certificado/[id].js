export default function ValidarCertificado({ certificado }) {
  if (!certificado) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>❌ Certificado não encontrado</h1>
        <p>O código informado não existe ou foi removido.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>✔ Certificado Válido</h1>
      <p><strong>{certificado.name}</strong></p>
      <p>CPF: {certificado.cpf}</p>
      <p>Certificado emitido em: {new Date(certificado.certified_at).toLocaleDateString()}</p>
      <p>ID do Certificado: {certificado.certificate_id}</p>
    </div>
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