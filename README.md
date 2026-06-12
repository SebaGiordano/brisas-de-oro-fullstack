# 🏨 Hotel y Cabañas Brisas de Oro — Sistema Fullstack

Sistema integral para la gestión y reservas de **Hotel y Cabañas Brisas de Oro**, Villa Carlos Paz, Córdoba, Argentina. Incluye el sitio web público con consulta de disponibilidad en tiempo real y el sistema de gestión interno para el personal del complejo.

---

## 🚀 Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend & Backend | Next.js 15 (Pages Router) |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Deploy | Railway |
| Autenticación | NextAuth.js |
| Estilos | CSS Modules + Bootstrap 5 |

---

## 📦 Módulos del sistema

### Sitio Web Público
- Página principal con información del complejo
- Consulta de disponibilidad en tiempo real
- Sección de alojamientos, tarifas y contacto
- Soporte multiidioma
- Clima en tiempo real (Tomorrow.io API)

### Sistema de Gestión Interno
- **Inicio** — Check-ins y check-outs del día, plazas ocupadas, cobros urgentes y tareas de limpieza
- **Dashboard** — Métricas de ocupación e ingresos con filtros por período y comparación de períodos
- **Calendario** — Vista Gantt interactiva de todas las unidades del complejo
- **Reservas** — ABM completo con filtros por estado y disponibilidad en tiempo real
- **Nueva Reserva** — Formulario guiado con sugerencia automática de tarifas y calculadora de seña
- **Facturación** — Historial de pagos con ajustes y totalizador
- **Alojamientos** — Administración de las 16 unidades del complejo
- **Tarifas** — Gestión de precios por temporada alta y baja
- **Usuarios** — Administración de cuentas con roles (Administrador / Viewer)

---

## 🏠 Unidades del complejo

El complejo cuenta con **16 unidades físicas**:

- 8 habitaciones (Hab 4–11)
- 2 aparts (combinaciones lógicas de habitaciones)
- 6 cabañas medianas (Cab 1–6)
- 1 cabaña chica (Cab 7)
- 1 cabaña grande (Cab 8)

---

## ⚙️ Correr localmente

### Requisitos previos
- Node.js 18+
- Cuenta en Railway con base de datos PostgreSQL

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SebaGiordano/brisas-de-oro-fullstack.git
cd brisas-de-oro-fullstack

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Completar DATABASE_URL y NEXTAUTH_SECRET en .env

# Aplicar migraciones de Prisma
npx prisma migrate deploy

# Correr el servidor de desarrollo
npm run dev
```

El sistema estará disponible en `http://localhost:3000`.

---

## 🗂️ Estructura de carpetas

```
brisas-de-oro-fullstack/
├── components/          # Componentes reutilizables
├── pages/
│   ├── api/             # API Routes (backend)
│   │   ├── auth/        # NextAuth
│   │   ├── reservas/    # CRUD de reservas
│   │   ├── pagos/       # Gestión de pagos
│   │   ├── alojamientos/
│   │   ├── tarifas/
│   │   └── disponibilidad/
│   ├── gestion/         # Páginas del sistema interno
│   │   ├── inicio.js
│   │   ├── dashboard.js
│   │   ├── calendario.js
│   │   ├── reservas/
│   │   ├── facturacion.js
│   │   ├── alojamientos.js
│   │   ├── tarifas.js
│   │   └── usuarios.js
│   └── ...              # Sitio web público
├── prisma/
│   ├── schema.prisma    # Modelos de base de datos
│   └── migrations/      # Historial de migraciones
├── lib/                 # Utilidades y cliente Prisma
├── styles/              # Estilos globales y módulos CSS
└── public/              # Imágenes y assets estáticos
```

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz con las siguientes variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 👤 Autor

**Sebastián Giordano**  
Estudiante de Analista de Sistemas — Universidad Siglo 21, Argentina  
[github.com/SebaGiordano](https://github.com/SebaGiordano)

---

*Proyecto de tesis — Universidad Siglo 21*
