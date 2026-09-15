export async function concluirModulo(email, moduleId) {
  // 🔒 envia também o userId salvo no localStorage (ver pages/cadastro.js) —
  // o backend usa isso pra confirmar que quem está completando o módulo é
  // realmente o dono do e-mail, e que a certificação já foi paga.
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const res = await fetch("/api/modulos/concluir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      moduleId,
      userId,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Erro ao concluir módulo:", error);
    throw new Error("Erro ao salvar progresso");
  }

  return res.json();
}