import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { modules } from "../lib/modules";

export default function Painel() {
  const router = useRouter();
  const totalModulos = modules.length;

  const [usuario, setUsuario] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState(null);

  // 🔹 Carregar usuário + progresso real
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    async function carregar() {
      try {
        // 1️⃣ Buscar usuário
        const resUser = await fetch(`/api/usuario?id=${userId}`);
        const dataUser = await resUser.json();

        if (!dataUser.ok) {
          console.log("Erro ao carregar usuário");
          setLoading(false);
          return;
        }

        setUsuario(dataUser.usuario);

        // 2️⃣ Buscar progresso REAL (Supabase)
        const resProg = await fetch(`/api/modulos/progresso?userId=${userId}`);
        const dataProg = await resProg.json();

        if (dataProg.ok) {
          setProgresso(dataProg.modulos);
        }

        // 3️⃣ Buscar certificado (caso exista)
        if (dataUser.usuario.certificate_id) {
          setCertificateId(dataUser.usuario.certificate_id);
          localStorage.setItem("certificateId", dataUser.usuario.certificate_id);
        }

        // 🔥 4️⃣ Certificação automática
        if (dataProg.modulos.length === totalModulos && !dataUser.usuario.is_certified) {
          console.log("🟦 Usuário concluiu 11 módulos. Certificando...");

          const res = await fetch("/api/certificado/finalizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: dataUser.usuario.id })
          });

          const cert = await res.json();

          if (cert.ok) {
            console.log("✔ Usuário certificado com sucesso!");

            setUsuario((u) => ({ ...u, is_certified: true }));

            if (cert.certificate_id) {
              setCertificateId(cert.certificate_id);
              localStorage.setItem("certificateId", cert.certificate_id);
            }
          }
        }

        setLoading(false);

      } catch (err) {
        console.log("Erro carregar painel:", err);
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // 🔹 Calcular módulo atual
  function moduloAtual() {
    for (let i = 1; i <= totalModulos; i++) {
      if (!progresso.includes(i)) return i;
    }
    return "concluido";
  }

  const atual = moduloAtual();
  const percent = Math.round((progresso.length / totalModulos) * 100);

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando painel…</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#d9d9d6",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        
        {/* TÍTULO */}
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#101820" }}>
          Bem-vindo(a), {usuario?.name} 👋
        </h1>

        {/* SELO DE CERTIFICADO */}
        {usuario?.is_certified && (
          <div
            style={{
              display: "inline-block",
              background: "#2ecc71",
              color: "white",
              padding: "6px 14px",
              borderRadius: "8px",
              fontWeight: 600,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            ✔ Consultor Certificado — 4% Liberado
          </div>
        )}

        <p style={{ color: "#333", marginBottom: 30 }}>
          Acompanhe sua jornada de certificação do Consultor BCT.
        </p>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0px 6px 12px rgba(0,0,0,0.1)",
            border: "1px solid #ccc",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ marginBottom: 20, color: "#101820" }}>
            Progresso da Certificação
          </h2>

          <div
            style={{
              width: "100%",
              height: "18px",
              background: "#eee",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: "#624b43",
                transition: "0.3s",
              }}
            />
          </div>

          <button
            onClick={() =>
              atual === "concluido"
                ? router.push("/certificado")
                : router.push(`/modulos/${atual}`)
            }
            style={{
              padding: "14px 22px",
              background: "#101820",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {atual === "concluido"
              ? "Emitir Certificado"
              : `Continuar no Módulo ${atual}`}
          </button>
        </div>

        {/* LISTA DE MÓDULOS */}
        {modules.map((mod) => {
          const completed = progresso.includes(mod.id);
          const locked = !completed && mod.id > atual;

          return (
            <div
              key={mod.id}
              style={{
                background: "white",
                padding: "22px",
                marginBottom: "14px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: locked ? 0.4 : 1,
              }}
            >
              <div>
                <strong>{mod.title}</strong>
                <p style={{ margin: 0 }}>
                  {completed && "✔ Concluído"}
                  {!completed && !locked && "▶ Disponível"}
                  {locked && "🔒 Bloqueado"}
                </p>
              </div>

              <button
                disabled={locked}
                onClick={() => router.push(`/modulos/${mod.id}`)}
                style={{
                  padding: "10px 18px",
                  background: locked
                    ? "#bbb"
                    : completed
                    ? "#2ecc71"
                    : "#624b43",
                  color: "white",
                  borderRadius: "10px",
                  cursor: locked ? "not-allowed" : "pointer",
                }}
              >
                {completed ? "Revisar" : "Acessar"}
              </button>
            </div>
          );
        })}

        {/* BOTÃO DO CERTIFICADO */}
        {usuario?.is_certified && (
          <button
            onClick={() => router.push("/certificado")}
            style={{
              padding: "12px 18px",
              background: "#624b43",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
              marginTop: 20,
            }}
          >
            📄 Visualizar Certificado
          </button>
        )}

      </div>
    </div>
  );
}