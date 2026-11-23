import { getLocale, tr } from "../i18n/translate";

/** Formato y etiquetas compartidas por las tarjetas de facturación. */

export const moneyFormat = (amount: number, currency: string) =>
  new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export const dateFormat = (date: string) =>
  new Intl.DateTimeFormat(getLocale()).format(
    new Date(`${date}T12:00:00`)
  );

/** De dónde salió el importe. El usuario no lo edita: se muestra la fuente. */
export const sourceLabels: Record<string, string> = {
  pdf: "PDF adjunto",
  image: "Factura escaneada (OCR)",
  email_body: "Cuerpo del mail",
  manual_pdf: "Carga manual (PDF)",
  manual_image: "Carga manual (foto)",
};

export const getSourceLabel = (source: string): string => {
  const label = sourceLabels[source] ?? source;
  return tr(label);
};

