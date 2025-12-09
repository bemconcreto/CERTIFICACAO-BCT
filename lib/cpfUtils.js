export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(.)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let dig1 = 11 - (soma % 11);
  if (dig1 > 9) dig1 = 0;
  if (dig1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  let dig2 = 11 - (soma % 11);
  if (dig2 > 9) dig2 = 0;
  if (dig2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}