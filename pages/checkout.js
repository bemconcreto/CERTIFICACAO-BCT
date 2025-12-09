import { useState } from "react";

export default function Cadastro() {
  const [form, setForm] = useState({ name: "", cpf: "", email: "", pass: "" });

  async function submit() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.ok) window.location.href = "/checkout";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Criar Conta</h1>

      <input placeholder="Nome" onChange={(e)=>setForm({...form, name:e.target.value})}/>
      <br/><br/>
      <input placeholder="CPF" onChange={(e)=>setForm({...form, cpf:e.target.value})}/>
      <br/><br/>
      <input placeholder="Email" onChange={(e)=>setForm({...form, email:e.target.value})}/>
      <br/><br/>
      <input placeholder="Senha" type="password" onChange={(e)=>setForm({...form, pass:e.target.value})}/>
      <br/><br/>

      <button onClick={submit}>Cadastrar</button>
    </div>
  );
}