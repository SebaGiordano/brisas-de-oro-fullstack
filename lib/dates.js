/**
 * Devuelve la fecha de hoy en la zona horaria de Argentina (America/Argentina/Buenos_Aires)
 * como un objeto Date a medianoche local. Usar en lugar de `new Date()` para calcular fechas.
 */
export function getHoyArgentina() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const [year, month, day] = formatter.format(now).split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Suma N días calendario a una fecha local-midnight, devuelve un nuevo Date.
 */
export function addDias(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Convierte una fecha Argentina (medianoche local) a medianoche UTC.
 * Necesario para queries de Prisma: Prisma lee TIMESTAMP WITHOUT TIME ZONE como UTC.
 */
export function argDateToUTC(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * Normaliza un timestamp de la base de datos a medianoche UTC (número).
 * Usar para comparar con argDateToUTC().getTime().
 */
export function normDBDate(date) {
  const d = new Date(date);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Convierte un timestamp de DB a medianoche local Argentina (número).
 * Usar para comparar con getHoyArgentina().getTime().
 */
export function toFechaArgentina(date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const [year, month, day] = formatter.format(new Date(date)).split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

/**
 * Formatea una fecha Argentina (medianoche local) como "dd/MM/yyyy".
 */
export function fmtFecha(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}
