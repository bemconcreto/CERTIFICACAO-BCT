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

  // 🔹 Carrega módulo
  useEffect(() => {
    if (id) {
      const mod = modules.find((m) => m.id === Number(id));
      setModulo(mod);
    }
  }, [id]);

  // 🔹 Salva progresso quando passar
useEffect(() => {
  async function salvarProgresso() {
    if (score === 100) {
      const userId = localStorage.getItem("userId");

      await concluirModulo(userId, Number(id)); 
    }
  }
  salvarProgresso();
}, [score, id]);
  // 🔹 Cria certificado automaticamente quando conclui o módulo 11
useEffect(() => {
  async function criarCertificado() {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch("/api/certificado/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          modulesCount: 11,
          note: "Concluiu toda certificação BCT"
        })
      });

      const data = await res.json();
      if (data.ok) {
        console.log("📄 Certificado criado:", data.id);
        localStorage.setItem("certificateId", data.id);
      } else {
        console.warn("⚠ Certificado não criado:", data.error);
      }
    } catch (err) {
      console.error("Erro criando certificado:", err);
    }
  }

  if (score === 100 && Number(id) === 11) {
    criarCertificado();
  }
}, [score, id]);

  // 🔹 Envia prova
  const enviarProva = () => {
    let acertos = 0;
    modulo.questions.forEach((q, index) => {
      if (selected[index] === q.a) acertos++;
    });
    const nota = Math.round((acertos / modulo.questions.length) * 100);
    setScore(nota);
  };

  if (!modulo) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
      <h1>Prova — {modulo.title}</h1>

      {/* SE AINDA NÃO ENVIOU A PROVA */}
      {score === null && (
        <>
          {modulo.questions.map((q, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: "bold" }}>{q.q}</p>

              {q.options.map((opt) => (
                <div key={opt} style={{ marginBottom: 5 }}>
                  <label>
                    <input
                      type="radio"
                      name={`q${index}`}
                      value={opt}
                      onChange={() =>
                        setSelected((prev) => ({ ...prev, [index]: opt }))
                      }
                    />
                    {" "} {opt}
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

      {/* SE JÁ MOSTRA RESULTADO */}
      {score !== null && (
        <div style={{ marginTop: 30 }}>
          <h2>Resultado: {score}%</h2>

          {score === 100 ? (
            <p style={{ color: "green" }}>✔ Parabéns! Você foi aprovado.</p>
          ) : (
            <p style={{ color: "red" }}>
              ❌ Você não atingiu 100%. Tente novamente.
            </p>
          )}

          {/* BOTÃO PRÓXIMO MÓDULO */}
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

          {/* BOTÃO VOLTAR AO PAINEL */}
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

          {/* BOTÃO GERAR CERTIFICADO (SOMENTE APÓS ÚLTIMO MÓDULO) */}
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