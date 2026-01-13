import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ SERVICE ROLE
);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/cadastro",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const email = user.email.toLowerCase();

      // 🔎 verifica se já existe
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      // 🧠 se não existir, cria
      if (!existing) {
        const { error } = await supabase.from("users").insert({
          email,
          name: user.name,
          origem: "certificacao",
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Erro ao criar usuário:", error);
          return false;
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});