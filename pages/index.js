import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Certificação Consultor | BEM Concreto</title>
        <link rel="icon" href="/logo-bct.svg" type="image/svg+xml" />
      </Head>
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#d9d9d6",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "55px 50px 45px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          maxWidth: 440,
          width: "100%",
        }}
      >
        {/* Logo modern container */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "28px",
            background: "#fff",
            border: "2px solid #e8e4e1",
            boxShadow:
              "0 2px 8px rgba(122,93,83,0.08), 0 12px 40px rgba(16,24,32,0.06)",
            marginBottom: 30,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle decorative accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #7a5d53, #101820)",
              borderRadius: "28px 28px 0 0",
            }}
          />
          <img
            src="/logo-bct2.png"
            alt="Logo BEM"
            style={{
              width: 75,
              height: 75,
              objectFit: "contain",
              marginTop: 2,
            }}
          />
        </div>

        <h1
          style={{
            marginBottom: 8,
            fontSize: 28,
            fontWeight: 700,
            color: "#101820",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          Certificação Consultor
        </h1>
        <h2
          style={{
            marginTop: 0,
            marginBottom: 20,
            fontSize: 22,
            fontWeight: 600,
            color: "#7a5d53",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          BEM Concreto
        </h2>

        {/* Divider */}
        <div
          style={{
            width: 50,
            height: 3,
            background: "linear-gradient(90deg, #7a5d53, #624b43)",
            borderRadius: 2,
            margin: "0 auto 24px",
          }}
        />

        <p
          style={{
            fontSize: 15,
            marginBottom: 36,
            lineHeight: "1.7",
            color: "#555",
          }}
        >
          Torne-se um consultor certificado e aumente sua comissão de
          <span
            style={{
              fontWeight: 700,
              color: "#101820",
              background: "linear-gradient(120deg, rgba(122,93,83,0.12) 0%, rgba(122,93,83,0.06) 100%)",
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            2% para 4%
          </span>
        </p>

        <button
          onClick={() => router.push("/cadastro")}
          style={btnPrimary}
        >
          Iniciar Certificação
        </button>

        <button
          onClick={() => router.push("/login")}
          style={btnSecondary}
        >
          Continuar Certificação
        </button>

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            color: "#aaa",
            letterSpacing: "0.3px",
          }}
        >
          Plataforma oficial de certificação BEM Concreto
        </p>
      </div>
    </div>
    </>
  );
}

const btnPrimary = {
  background: "#101820",
  color: "white",
  padding: "14px 25px",
  borderRadius: "10px",
  border: "none",
  marginBottom: 16,
  fontSize: 16,
  cursor: "pointer",
  width: "100%",
};

const btnSecondary = {
  background: "#624b43",
  color: "white",
  padding: "14px 25px",
  borderRadius: "10px",
  border: "none",
  fontSize: 16,
  cursor: "pointer",
  width: "100%",
};