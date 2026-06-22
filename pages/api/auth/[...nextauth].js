import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions = {
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
    maxAge:    30 * 24 * 60 * 60, // 30 días
    updateAge: 0,                  // regenerar el token en cada request
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id
        token.userName = user.userName
        token.rol      = user.rol
      }
      if (token.rol === undefined && token.id) {
        try {
          const u = await prisma.usuario.findUnique({
            where: { id: parseInt(token.id) },
            select: { rol: true },
          })
          if (u) token.rol = u.rol
        } catch { }
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id:       token.id,
        userName: token.userName,
        rol:      token.rol,
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
