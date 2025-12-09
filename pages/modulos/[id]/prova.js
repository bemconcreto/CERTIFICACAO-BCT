import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { modules } from "../../../lib/modules";

export default function ProvaModulo() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [modulo, setModulo] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const m = modules.find((mod) => mod.id === id);
    setModulo(m);
    setRespostas(Array(m.questions.length).fill(""));
    setLoading(false);
  }, [id]);

  if (loading) return <div>Carregando prova...</div>;
  if (!modulo) return <div>Módulo não encontrado.</div>;

  function selecionarResposta(index, alternativa) {
    const nova = [...respostas];
    nova[index] = alternativa;
    setRespostas(nova);
  }

  async function enviarProva() {
    const userId = localStorage.getItem("userId"); // você pode ajustar isso depois

    const res = await fetch("/api/prova/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        moduloId: id,
        respostas,
      }),
    });

    const data = await res.json();
    setResultado(data);
  }

  if (resultado) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Resultado da Prova</h1>

        <p><strong>Nota:</strong> {resultado.score.toFixed(2)}%</p>

        {resultado.aprovado ? (
          <>
            <p style={{ color: "green" }}>✔ Você foi aprovado!</p>
            <button onClick={() => router.push(`/modulo/${resultado.proximoModulo}`)}>
              Ir para o próximo módulo
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "red" }}>
              ❌ Você não atingiu a nota mínima (80% necessário).
            </p>
            <button onClick={() => router.reload()}>
              Tentar novamente
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Prova — {modulo.title}</h1>

      {modulo.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: 25 }}>
          <p><strong>{index + 1}. {q.q}</strong></p>

          {q.options?.length > 0 ? (
            q.options.map((opt, oi) => (
              <div key={oi}>
                <label>
                  <input
                    type="radio"
                    name={`q_${index}`}
                    value={opt}
                    onChange={() => selecionarResposta(index, opt)}
                  />
                  {" "}
                  {opt}
                </label>
              </div>
            ))
          ) : (
            <input
              type="text"
              placeholder="Digite sua resposta"
              onChange={(e) => selecionarResposta(index, e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          )}
        </div>
      ))}

      <button onClick={enviarProva} style={{ marginTop: 20 }}>
        Enviar Prova
      </button>
    </div>
  );
}