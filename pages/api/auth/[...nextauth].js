import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userName: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) return null

        const usuario = await prisma.usuario.findUnique({
          where: { userName: credentials.userName },
        })

        if (!usuario || !usuario.activo) return null

        const passwordValido = await bcrypt.compare(
          credentials.password,
          usuario.passwordHash
        )

        if (!passwordValido) return null

        return {
          id: String(usuario.id),
          userName: usuario.userName,
          rol: usuario.rol,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userName = user.userName
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.userName = token.userName
      session.user.rol = token.rol
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
})
