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
    async redirect({ baseUrl }) {
      // SEMPRE volta para a certificação
      return `${baseUrl}/cadastro`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});