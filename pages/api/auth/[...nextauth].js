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
    error: "/cadastro",
  },

  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email?.toLowerCase();
        if (!email) return true;

        // 1️⃣ Cria ou atualiza usuário
        await supabase.from("users").upsert(
          {
            email,
            name: user.name,
            avatar: user.image,
            is_email_verified: true,
          },
          { onConflict: "email" }
        );

        return true;
      } catch (err) {
        console.error("NextAuth signIn error:", err);
        return true; // 🚨 nunca bloqueia login
      }
    },

    async session({ session }) {
      // 2️⃣ Busca o ID NORMAL do usuário
      if (session.user?.email) {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("email", session.user.email.toLowerCase())
          .single();

        if (data?.id) {
          session.user.id = data.id; // 🔥 ID REAL
        }
      }

      return session;
    },
  },
});