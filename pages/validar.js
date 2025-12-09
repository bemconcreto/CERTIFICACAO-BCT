import { useState } from "react";

export default function Validar() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  async function validate() {
    const res = await fetch(`/api/certificado/validate?code=${code}`);
    setResult(await res.json());
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Validar Certificado</h1>

      <input placeholder="Código" onChange={(e)=>setCode(e.target.value)} />
      <button onClick={validate}>Validar</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}