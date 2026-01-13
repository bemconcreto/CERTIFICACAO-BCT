import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#d9d9d6",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "50px 60px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0px 6px 10px rgba(0,0,0,0.1)",
          border: "1px solid #cfcfcf",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <h1
          style={{
            marginBottom: 25,
            fontSize: 32,
            fontWeight: 700,
            color: "#101820",
          }}
        >
          Certificação Consultor BCT
        </h1>

        <p
          style={{
            fontSize: 16,
            marginBottom: 40,
            lineHeight: "1.5",
            color: "#333",
          }}
        >
          Torne-se um consultor certificado BCT e aumente sua comissão de
          <strong> 2% para 4%</strong>.
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
      </div>
    </div>
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