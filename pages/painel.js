import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { modules } from "../lib/modules";

export default function Painel() {
  const router = useRouter();
  const totalModulos = modules.length;

  const [usuario, setUsuario] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGAMENTO (PIX)
  const [pagamento, setPagamento] = useState(null);
  const [modalPix, setModalPix] = useState(false);

  // ------------------------------------------------------
  // 🔹 Carregar usuário + progresso real
  // ------------------------------------------------------
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    async function carregar() {
      try {
        // 1️⃣ Buscar usuário
        const resUser = await fetch(`/api/usuario?id=${userId}`);
        const dataUser = await resUser.json();

        if (!dataUser.ok) {
          setLoading(false);
          return;
        }

        setUsuario(dataUser.usuario);

        // 2️⃣ Buscar progresso REAL (Supabase)
        const resProg = await fetch(`/api/modulos/progresso?userId=${userId}`);
        const dataProg = await resProg.json();
        if (dataProg.ok) setProgresso(dataProg.modulos);

        setLoading(false);
      } catch (err) {
        console.log("Erro carregar painel:", err);
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // ------------------------------------------------------
  // 🔥 FUNÇÃO PARA CRIAR PAGAMENTO NO BACKEND (ASAAS)
  // ------------------------------------------------------
  async function gerarPagamento() {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: usuario.email,
          cpf: usuario.cpf,
          name: usuario.name,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        console.log("Erro ao criar pagamento:", data);
        alert("Erro ao gerar pagamento.");
        return;
      }

      // ✔ Guarda somente o PIX Copia e Cola
      setPagamento({
        pixCopyPaste: data.copiaCola,
        chargeId: data.chargeId || null,
      });

      setModalPix(true);
    } catch (err) {
      console.log("Erro pagamento:", err);
      alert("Erro interno ao criar pagamento.");
    }
  }

  // ------------------------------------------------------
  // 🔹 Calcular módulo atual
  // ------------------------------------------------------
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando painel…</div>;
  }

  // ------------------------------------------------------
  // 🔥 SE NÃO PAGOU, MOSTRA TELA DE PAGAMENTO
  // ------------------------------------------------------
  if (!usuario?.is_paid_certification) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d6",
          padding: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 16,
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            border: "1px solid #ccc",
          }}
        >
          <h2 style={{ marginBottom: 10 }}>🎓 Falta Pouco!</h2>
          <p>Para acessar a Certificação BCT, finalize o pagamento único:</p>

          <h1 style={{ color: "#624b43", margin: "20px 0" }}>R$ 17,77</h1>

          <button
            onClick={gerarPagamento}
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
              width: "100%",
            }}
          >
            Pagar Agora via PIX
          </button>

          {/* Modal PIX */}
          {modalPix && pagamento && (
            <div
              style={{
                marginTop: 30,
                padding: 20,
                borderRadius: 12,
                background: "#f5f5f5",
                border: "1px solid #ccc",
              }}
            >
              <h3>Código PIX Copia e Cola:</h3>

              <textarea
                readOnly
                value={pagamento.pixCopyPaste}
                style={{
                  width: "100%",
                  height: 120,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontSize: 14,
                }}
              />

              <button
                onClick={() =>
                  navigator.clipboard.writeText(pagamento.pixCopyPaste)
                }
                style={{
                  marginTop: 10,
                  padding: "10px 16px",
                  background: "#624b43",
                  color: "white",
                  borderRadius: 10,
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                Copiar Código PIX
              </button>

              <p style={{ marginTop: 20, fontSize: 13, color: "#666" }}>
                Assim que o pagamento for confirmado no ASAAS, seu acesso será
                liberado automaticamente.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------
  // 🔥 SE O USUÁRIO JÁ PAGOU — PAINEL COMPLETO
  // ------------------------------------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#d9d9d6",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#101820" }}>
          Bem-vindo(a), {usuario?.name} 👋
        </h1>

        {usuario?.is_certified && (
          <div
            style={{
              display: "inline-block",
              background: "#2ecc71",
              color: "white",
              padding: "6px 14px",
              borderRadius: "8px",
              fontWeight: 600,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            ✔ Consultor Certificado — 4% Liberado
          </div>
        )}

        <p style={{ color: "#333", marginBottom: 30 }}>
          Acompanhe sua jornada de certificação do Consultor BCT.
        </p>

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0px 6px 12px rgba(0,0,0,0.1)",
            border: "1px solid #ccc",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ marginBottom: 20, color: "#101820" }}>
            Progresso da Certificação
          </h2>

          <div
            style={{
              width: "100%",
              height: "18px",
              background: "#eee",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: "#624b43",
                transition: "0.3s",
              }}
            />
          </div>

          <button
            onClick={() =>
              atual === "concluido"
                ? router.push("/certificado")
                : router.push(`/modulos/${atual}`)
            }
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {atual === "concluido"
              ? "Emitir Certificado"
              : `Continuar no Módulo ${atual}`}
          </button>
        </div>

        {modules.map((mod) => {
          const completed = progresso.includes(mod.id);
          const locked = !completed && mod.id > atual;

          return (
            <div
              key={mod.id}
              style={{
                background: "white",
                padding: "22px",
                marginBottom: "14px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: locked ? 0.4 : 1,
              }}
            >
              <div>
                <strong>{mod.title}</strong>
                <p style={{ margin: 0 }}>
                  {completed && "✔ Concluído"}
                  {!completed && !locked && "▶ Disponível"}
                  {locked && "🔒 Bloqueado"}
                </p>
              </div>

              <button
                disabled={locked}
                onClick={() => router.push(`/modulos/${mod.id}`)}
                style={{
                  padding: "10px 18px",
                  background: locked
                    ? "#bbb"
                    : completed
                    ? "#2ecc71"
                    : "#624b43",
                  color: "white",
                  borderRadius: "10px",
                  cursor: locked ? "not-allowed" : "pointer",
                }}
              >
                {completed ? "Revisar" : "Acessar"}
              </button>
            </div>
          );
        })}

        {usuario?.is_certified && (
          <button
            onClick={() => router.push("/certificado")}
            style={{
              padding: "12px 18px",
              background: "#624b43",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
              marginTop: 20,
            }}
          >
            📄 Visualizar Certificado
          </button>
        )}
      </div>
    </div>
  );
}