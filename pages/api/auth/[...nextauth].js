import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/cadastro",
    error: "/cadastro", // evita tela de erro feia
  },

  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email?.toLowerCase();

        if (!email) return true; // deixa passar

        // 🔹 cria ou garante usuário
        await supabase
          .from("users")
          .upsert(
            {
              email,
              name: user.name,
              avatar: user.image,
            },
            { onConflict: "email" }
          );

        // 🔥 NUNCA bloqueia login
        return true;
      } catch (err) {
        console.error("Erro signIn:", err);

        // 🔥 REGRA CRÍTICA:
        // mesmo com erro, deixa logar
        return true;
      }
    },

    async redirect({ baseUrl }) {
      // 👉 DEPOIS DO LOGIN, VAI PARA O FLUXO DA CERTIFICAÇÃO
      return `${baseUrl}/painel`;
    },
  },
});