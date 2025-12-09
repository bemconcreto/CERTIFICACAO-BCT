export async function getServerSideProps({ query }) {
  const { nome = "", cpf = "", data = "" } = query;

  return {
    props: { nome, cpf, data },
  };
}

export default function PdfTemplate({ nome, cpf, data }) {
  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Certificado BCT</title>

    <style>
      body {
        background: #d9d9d6;
        padding: 40px 20px;
        font-family: 'Inter', sans-serif;
      }

.container {
  width: 80%;
  max-width: 750px;
  background: #fff;
  padding: 40px 50px;
  border-radius: 20px;
  border: 3px solid #624b43;
  margin: auto;
  text-align: center;
}

      .faixa {
        width: 100%;
        height: 12px;
        background: #624b43;
        border-radius: 10px;
        margin-bottom: 30px;
      }

      .titulo {
        font-size: 32px;
        font-weight: 800;
        color: #101820;
        margin-bottom: 0;
        letter-spacing: 1px;
      }

      .subtitulo {
        font-size: 14px;
        letter-spacing: 4px;
        margin-top: 0;
        margin-bottom: 30px;
        color: #624b43;
        font-weight: 600;
      }

      .selo {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 6px solid #624b43;
        margin: 0 auto 25px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .selo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .texto1 {
        font-size: 20px;
        margin-bottom: 10px;
      }

      .nome {
        font-size: 32px;
        font-weight: 800;
        margin: 0;
        color: #101820;
      }

      .cpf {
        font-size: 16px;
        margin-top: 8px;
        margin-bottom: 40px;
      }

      .texto2 {
        font-size: 18px;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto 40px;
      }

      .data {
        margin-top: 20px;
        font-size: 16px;
      }

      .data strong {
        font-size: 18px;
        color: #624b43;
        display: block;
        margin-top: 4px;
        margin-bottom: 40px;
      }

      .assinatura img {
        width: 180px;
        margin: 0 auto -5px;
        opacity: 0.95;
      }

      .linha {
        width: 250px;
        height: 1px;
        background: #624b43;
        margin: -10px auto 8px;
      }

      .empresa {
        font-size: 14px;
        color: #624b43;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="faixa"></div>

      <h1 class="titulo">BEM CONCRETO TOKEN</h1>
      <p class="subtitulo">CONSULTOR CERTIFICADO</p>

      <div class="selo">
        <img src="/selo.png" />
      </div>

      <p class="texto1">Certificamos que</p>

      <h2 class="nome">${nome}</h2>

      <p class="cpf">
        Portador do CPF <strong>${cpf}</strong>
      </p>

      <p class="texto2">
        Concluiu oficialmente todos os <strong>11 módulos</strong> da
        Certificação do Consultor BCT, adquirindo o direito de atuar como
        consultor certificado com comissão de <strong>4%</strong>.
      </p>

      <p class="data">
        Emitido em:
        <strong>${data}</strong>
      </p>

      <div class="assinatura">
        <img src="/assinatura.png" />
      </div>

      <div class="linha"></div>

      <p class="empresa">Bem Concreto Negócios Imobiliário</p>
    </div>
  </body>
</html>
        `
      }} />
    </>
  );
}