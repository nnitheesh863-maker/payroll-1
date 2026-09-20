/**
 * Downloads arbitrary array of objects as a client-generated CSV file.
 */
export function downloadCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || !rows.length) return;

  const headerKeys = headers ? headers.map(h => h.key) : (Object.keys(rows[0]) as (keyof T)[]);
  const headerLabels = headers ? headers.map(h => h.label) : (headerKeys as string[]);

  const csvRows: string[] = [];
  csvRows.push(headerLabels.map(label => `"${String(label).replace(/"/g, '""')}"`).join(','));

  for (const row of rows) {
    const values = headerKeys.map(k => {
      const val = row[k] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
