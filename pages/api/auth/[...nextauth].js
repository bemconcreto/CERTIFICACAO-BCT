import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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

  // 🚫 REMOVE redirect callback (ESSENCIAL)
  // Deixe o NextAuth usar o callbackUrl corretamente

  secret: process.env.NEXTAUTH_SECRET,
});