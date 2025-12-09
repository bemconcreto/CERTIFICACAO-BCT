export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("cpf", user.cpf);
  localStorage.setItem("consultorId", user.consultorId || "");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/";
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}