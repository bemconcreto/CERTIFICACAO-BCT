import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { modules } from "../../lib/modules";
import { concluirModulo } from "../../lib/progress";

export default function Prova() {
  const router = useRouter();
  const { id } = router.query;

  const [modulo, setModulo] = useState(null);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);

  // ======================================================
  // 🔹 Carregar módulo
  // ======================================================
  useEffect(() => {
    if (!id) return;
    const mod = modules.find((m) => m.id === Number(id));
    setModulo(mod);
  }, [id]);

  // ======================================================
  // 🔹 Salvar progresso ao passar na prova
  // ======================================================
  useEffect(() => {
    async function salvarProgresso() {
      if (score !== 100) return;

      const email = localStorage.getItem("email");
      if (!email) {
        alert("Sessão expirada. Faça login novamente.");
        router.replace("/login");
        return;
      }

      await concluirModulo(email, Number(id));
    }

    salvarProgresso();
  }, [score, id, router]);

  // ======================================================
  // 🔹 Criar certificado automaticamente no último módulo
  // ======================================================
  useEffect(() => {
    async function criarCertificado() {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        await fetch("/api/certificado/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            modulesCount: 11,
            note: "Concluiu toda certificação BCT",
          }),
        });
      } catch (err) {
        console.error("Erro criando certificado:", err);
      }
    }

    if (score === 100 && Number(id) === 11) {
      criarCertificado();
    }
  }, [score, id]);

  // ======================================================
  // 🔹 Enviar prova
  // ======================================================
  const enviarProva = () => {
    let acertos = 0;

    modulo.questions.forEach((q, index) => {
      if (selected[index] === q.a) acertos++;
    });

    const nota = Math.round(
      (acertos / modulo.questions.length) * 100
    );

    setScore(nota);
  };

  // ======================================================
  // 🔹 Loading
  // ======================================================
  if (!modulo) {
    return <div style={{ padding: 40 }}>Carregando módulo...</div>;
  }

  // ======================================================
  // 🔹 Render
  // ======================================================
  return (
    <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
      <h1>Prova — {modulo.title}</h1>

      {/* ===================== */}
      {/* PROVA */}
      {/* ===================== */}
      {score === null && (
        <>
          {modulo.questions.map((q, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: "bold" }}>{q.q}</p>

              {q.options.map((opt) => (
                <div key={opt}>
                  <label>
                    <input
                      type="radio"
                      name={`q${index}`}
                      value={opt}
                      onChange={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [index]: opt,
                        }))
                      }
                    />{" "}
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={enviarProva}
            style={{
              padding: "12px 18px",
              background: "#101820",
              color: "white",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            Enviar Prova
          </button>
        </>
      )}

      {/* ===================== */}
      {/* RESULTADO */}
      {/* ===================== */}
      {score !== null && (
        <div style={{ marginTop: 30 }}>
          <h2>Resultado: {score}%</h2>

          {score === 100 ? (
            <p style={{ color: "green" }}>
              ✔ Parabéns! Você foi aprovado.
            </p>
          ) : (
            <p style={{ color: "red" }}>
              ❌ Você não atingiu 100%. Tente novamente.
            </p>
          )}

          <button
            onClick={() => router.push(`/modulos/${Number(id) + 1}`)}
            style={{
              padding: "12px 18px",
              background: "green",
              color: "white",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            Ir para o próximo módulo
          </button>

          <button
            onClick={() => router.push("/painel")}
            style={{
              padding: "10px 18px",
              background: "#444",
              color: "white",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              marginTop: 15,
              marginLeft: 10,
            }}
          >
            Voltar ao Painel
          </button>

          {Number(id) === 11 && score === 100 && (
            <button
              onClick={() => router.push("/certificado")}
              style={{
                padding: "12px 18px",
                background: "#006400",
                color: "white",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginTop: 20,
                display: "block",
              }}
            >
              Gerar Certificado
            </button>
          )}
        </div>
      )}
    </div>
  );
}