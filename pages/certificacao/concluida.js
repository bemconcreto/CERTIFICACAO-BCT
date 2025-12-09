export default function CertificacaoConcluida() {
  return (
    <div style={{
      padding: 40,
      maxWidth: 900,
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: 36 }}>🎉 Certificação Concluída!</h1>

      <p style={{ marginTop: 20, fontSize: 20 }}>
        Parabéns! Você concluiu todos os 11 módulos da Certificação Bem Concreto.
      </p>

      <p style={{ fontSize: 18, marginTop: 10 }}>
        Você agora está oficialmente habilitado a atuar como Consultor Certificado e receber <b>4% de comissão</b>. É uma responsabilidade muito granda tal feito, pois diversas pessoas através de você terão acesso a maior inovação imobiliária dos últimos tempos. O mundo todo será <b>TOKENIZADO</b> e você fará parte disso!
      </p>

      <button
        onClick={() => alert("Aqui vamos gerar o certificado em PDF depois.")}
        style={{
          marginTop: 40,
          padding: "14px 26px",
          background: "#101820",
          color: "white",
          borderRadius: 10,
          border: "none",
          fontSize: 18,
          cursor: "pointer"
        }}
      >
        Emitir meu Certificado
      </button>
    </div>
  );
}