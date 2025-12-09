// Salva progresso no localStorage
export function completeModule(id) {
  if (typeof window === "undefined") return;

  const saved = JSON.parse(localStorage.getItem("progressoBCT") || "[]");

  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem("progressoBCT", JSON.stringify(saved));
  }
}

// Carrega progresso
export function getProgress() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("progressoBCT") || "[]");
}

export async function concluirModulo(userId, moduleId) {
  // Salvar no Supabase
  await fetch("/api/modulos/concluir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, moduleId })
  });

  // Atualizar localStorage como cache
  const current = JSON.parse(localStorage.getItem("progress") || "[]");
  if (!current.includes(moduleId)) {
    current.push(moduleId);
    localStorage.setItem("progress", JSON.stringify(current));
  }
}