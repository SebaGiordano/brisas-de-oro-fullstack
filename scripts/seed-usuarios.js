require('dotenv/config')

const { PrismaClient } = require('../generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const usuarios = [
  { userName: 'Sebastian',  password: 'brisasdeoro1234', rol: 0 }, // 0=Administrador
  { userName: 'MariaCelia', password: 'ciroyluna',       rol: 1 }, // 1=Viewer
]

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  for (const u of usuarios) {
    const existe = await prisma.usuario.findUnique({ where: { userName: u.userName } })

    if (existe) {
      console.log(`[omitido]  "${u.userName}" ya existe en la base de datos.`)
      continue
    }

    const passwordHash = await bcrypt.hash(u.password, 10)
    await prisma.usuario.create({
      data: { userName: u.userName, passwordHash, rol: u.rol, activo: true },
    })
    console.log(`[creado]   "${u.userName}" insertado correctamente.`)
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
