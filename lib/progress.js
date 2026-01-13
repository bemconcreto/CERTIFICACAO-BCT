export async function concluirModulo(email, moduleId) {
  const res = await fetch("/api/modulos/concluir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      moduleId,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Erro ao concluir módulo:", error);
    throw new Error("Erro ao salvar progresso");
  }

  return res.json();
}