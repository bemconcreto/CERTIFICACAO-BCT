// pages/api/prova/corrigir.js
//
// Correção da prova roda aqui, no servidor. Antes, pages/prova/[id].js
// comparava `selected[index] === q.a` direto no navegador — como o arquivo
// lib/modules.js (com o gabarito completo, campo `q.a`) era importado na
// página, qualquer pessoa conseguia abrir o bundle JS do navegador e ler
// todas as respostas certas de todos os módulos. Este endpoint em
// pages/api/ nunca vai pro bundle do cliente, então importar `lib/modules`
// aqui é seguro: o gabarito nunca sai do servidor.
import { modules } from "../../../lib/modules";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { moduleId, respostas } = req.body;

    if (!moduleId || !Array.isArray(respostas)) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const modulo = modules.find((m) => m.id === Number(moduleId));
    if (!modulo) {
      return res.status(404).json({ error: "Módulo inexistente" });
    }

    let acertos = 0;
    modulo.questions.forEach((q, index) => {
      if (respostas[index] === q.a) acertos++;
    });

    const nota = Math.round((acertos / modulo.questions.length) * 100);

    // Mantém a mesma regra de aprovação que já existia no client: só passa
    // quem acerta 100% da prova.
    const aprovado = nota === 100;

    // Retorna só a nota e se passou — nunca quais itens estavam certos ou
    // errados, pra não dar pistas do gabarito em tentativas repetidas.
    return res.status(200).json({ nota, aprovado });
  } catch (err) {
    console.error("Erro ao corrigir prova:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
