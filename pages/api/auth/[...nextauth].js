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
    signIn: "/login",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // se vier callbackUrl válido, respeita
      if (url.startsWith(baseUrl)) return url;

      // fallback seguro
      return `${baseUrl}/painel`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});