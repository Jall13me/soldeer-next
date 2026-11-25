const bsFormatter = new Intl.NumberFormat('es-BO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** "Bs. 4.500" — formato fijo (es-BO) para que servidor y cliente coincidan. */
export function formatBs(amount: number): string {
  return `Bs. ${bsFormatter.format(amount)}`;
}
