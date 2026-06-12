-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Alojamientos" (
    "Id" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Tipo" INTEGER NOT NULL,
    "Capacidad" INTEGER NOT NULL,
    "Descripcion" TEXT,
    "Activo" BOOLEAN NOT NULL,

    CONSTRAINT "PK_Alojamientos" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."ApartDetalles" (
    "Id" SERIAL NOT NULL,
    "AlojamientoApartId" INTEGER NOT NULL,
    "AlojamientoHab1Id" INTEGER NOT NULL,
    "AlojamientoHab2Id" INTEGER NOT NULL,

    CONSTRAINT "PK_ApartDetalles" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetRoleClaims" (
    "Id" SERIAL NOT NULL,
    "RoleId" TEXT NOT NULL,
    "ClaimType" TEXT,
    "ClaimValue" TEXT,

    CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetRoles" (
    "Id" TEXT NOT NULL,
    "Name" VARCHAR(256),
    "NormalizedName" VARCHAR(256),
    "ConcurrencyStamp" TEXT,

    CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserClaims" (
    "Id" SERIAL NOT NULL,
    "UserId" TEXT NOT NULL,
    "ClaimType" TEXT,
    "ClaimValue" TEXT,

    CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserLogins" (
    "LoginProvider" TEXT NOT NULL,
    "ProviderKey" TEXT NOT NULL,
    "ProviderDisplayName" TEXT,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider","ProviderKey")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserRoles" (
    "UserId" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,

    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId","RoleId")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserTokens" (
    "UserId" TEXT NOT NULL,
    "LoginProvider" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Value" TEXT,

    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId","LoginProvider","Name")
);

-- CreateTable
CREATE TABLE "public"."AspNetUsers" (
    "Id" TEXT NOT NULL,
    "FechaCreacion" TIMESTAMPTZ(6) NOT NULL,
    "UserName" VARCHAR(256),
    "NormalizedUserName" VARCHAR(256),
    "Email" VARCHAR(256),
    "NormalizedEmail" VARCHAR(256),
    "EmailConfirmed" BOOLEAN NOT NULL,
    "PasswordHash" TEXT,
    "SecurityStamp" TEXT,
    "ConcurrencyStamp" TEXT,
    "PhoneNumber" TEXT,
    "PhoneNumberConfirmed" BOOLEAN NOT NULL,
    "TwoFactorEnabled" BOOLEAN NOT NULL,
    "LockoutEnd" TIMESTAMPTZ(6),
    "LockoutEnabled" BOOLEAN NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL,

    CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Pagos" (
    "Id" SERIAL NOT NULL,
    "ReservaId" INTEGER NOT NULL,
    "TipoPago" INTEGER NOT NULL,
    "Monto" DECIMAL(18,2) NOT NULL,
    "MetodoPago" INTEGER NOT NULL,
    "Fecha" TIMESTAMPTZ(6) NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "PK_Pagos" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Reservas" (
    "Id" SERIAL NOT NULL,
    "AlojamientoId" INTEGER NOT NULL,
    "NombreHuesped" TEXT NOT NULL,
    "Telefono" TEXT,
    "FechaIngreso" TIMESTAMPTZ(6) NOT NULL,
    "FechaSalida" TIMESTAMPTZ(6) NOT NULL,
    "MontoTotal" DECIMAL(18,2) NOT NULL,
    "MontoSena" DECIMAL(18,2) NOT NULL,
    "Estado" INTEGER NOT NULL,
    "EsInvitacion" BOOLEAN NOT NULL,
    "IncluyeDesayuno" BOOLEAN NOT NULL,
    "CantidadHuespedes" INTEGER NOT NULL,
    "CanalOrigen" TEXT,
    "Observaciones" TEXT,
    "FechaCarga" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_Reservas" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Tarifas" (
    "Id" SERIAL NOT NULL,
    "AlojamientoId" INTEGER NOT NULL,
    "TemporadaId" INTEGER NOT NULL,
    "CantidadPersonas" INTEGER NOT NULL,
    "PrecioConDesayuno" DECIMAL(18,2) NOT NULL,
    "PrecioSinDesayuno" DECIMAL(18,2) NOT NULL,
    "Activo" BOOLEAN NOT NULL,

    CONSTRAINT "PK_Tarifas" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Temporadas" (
    "Id" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "FechaInicio" TIMESTAMPTZ(6) NOT NULL,
    "FechaFin" TIMESTAMPTZ(6) NOT NULL,
    "Activo" BOOLEAN NOT NULL,

    CONSTRAINT "PK_Temporadas" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."__EFMigrationsHistory" (
    "MigrationId" VARCHAR(150) NOT NULL,
    "ProductVersion" VARCHAR(32) NOT NULL,

    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- CreateIndex
CREATE INDEX "IX_ApartDetalles_AlojamientoApartId" ON "public"."ApartDetalles"("AlojamientoApartId" ASC);

-- CreateIndex
CREATE INDEX "IX_ApartDetalles_AlojamientoHab1Id" ON "public"."ApartDetalles"("AlojamientoHab1Id" ASC);

-- CreateIndex
CREATE INDEX "IX_ApartDetalles_AlojamientoHab2Id" ON "public"."ApartDetalles"("AlojamientoHab2Id" ASC);

-- CreateIndex
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "public"."AspNetRoleClaims"("RoleId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "RoleNameIndex" ON "public"."AspNetRoles"("NormalizedName" ASC);

-- CreateIndex
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "public"."AspNetUserClaims"("UserId" ASC);

-- CreateIndex
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "public"."AspNetUserLogins"("UserId" ASC);

-- CreateIndex
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "public"."AspNetUserRoles"("RoleId" ASC);

-- CreateIndex
CREATE INDEX "EmailIndex" ON "public"."AspNetUsers"("NormalizedEmail" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserNameIndex" ON "public"."AspNetUsers"("NormalizedUserName" ASC);

-- CreateIndex
CREATE INDEX "IX_Pagos_ReservaId" ON "public"."Pagos"("ReservaId" ASC);

-- CreateIndex
CREATE INDEX "IX_Reservas_AlojamientoId" ON "public"."Reservas"("AlojamientoId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "IX_Tarifas_AlojamientoId_CantidadPersonas_TemporadaId" ON "public"."Tarifas"("AlojamientoId" ASC, "CantidadPersonas" ASC, "TemporadaId" ASC);

-- CreateIndex
CREATE INDEX "IX_Tarifas_TemporadaId" ON "public"."Tarifas"("TemporadaId" ASC);

-- AddForeignKey
ALTER TABLE "public"."ApartDetalles" ADD CONSTRAINT "FK_ApartDetalles_Alojamientos_AlojamientoApartId" FOREIGN KEY ("AlojamientoApartId") REFERENCES "public"."Alojamientos"("Id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ApartDetalles" ADD CONSTRAINT "FK_ApartDetalles_Alojamientos_AlojamientoHab1Id" FOREIGN KEY ("AlojamientoHab1Id") REFERENCES "public"."Alojamientos"("Id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ApartDetalles" ADD CONSTRAINT "FK_ApartDetalles_Alojamientos_AlojamientoHab2Id" FOREIGN KEY ("AlojamientoHab2Id") REFERENCES "public"."Alojamientos"("Id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetRoleClaims" ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "public"."AspNetRoles"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserClaims" ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserLogins" ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserRoles" ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "public"."AspNetRoles"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserRoles" ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserTokens" ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Pagos" ADD CONSTRAINT "FK_Pagos_Reservas_ReservaId" FOREIGN KEY ("ReservaId") REFERENCES "public"."Reservas"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Reservas" ADD CONSTRAINT "FK_Reservas_Alojamientos_AlojamientoId" FOREIGN KEY ("AlojamientoId") REFERENCES "public"."Alojamientos"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Tarifas" ADD CONSTRAINT "FK_Tarifas_Alojamientos_AlojamientoId" FOREIGN KEY ("AlojamientoId") REFERENCES "public"."Alojamientos"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Tarifas" ADD CONSTRAINT "FK_Tarifas_Temporadas_TemporadaId" FOREIGN KEY ("TemporadaId") REFERENCES "public"."Temporadas"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

