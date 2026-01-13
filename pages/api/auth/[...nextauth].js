import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🔒 Proteção extra contra env quebrada
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

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
        if (!supabase) return true;

        const email = user.email?.toLowerCase();
        if (!email) return true;

        // 🔹 garante usuário no Supabase
        await supabase.from("users").upsert(
          {
            email,
            name: user.name,
            avatar: user.image,
          },
          { onConflict: "email" }
        );

        return true;
      } catch (err) {
        console.error("Erro no signIn:", err);
        // 🚨 NUNCA bloqueia login
        return true;
      }
    },
  },
});