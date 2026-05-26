const CSV_HEADERS = ['pair', 'side', 'entry', 'exit', 'capturedPips', 'profitLoss', 'rrRatio', 'date', 'session', 'emotion', 'notes'];

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportJSON(trades) {
  const blob = new Blob([JSON.stringify(trades, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'pipvault-trades.json');
}

export function exportCSV(trades) {
  const rows = [
    CSV_HEADERS.join(','),
    ...trades.map((trade) => CSV_HEADERS.map((header) => escapeCsvValue(trade[header])).join(',')),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, 'pipvault-trades.csv');
}

export async function importJSON(file, addTrade) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error('Import file must contain an array of trades.');
  }

  let importedCount = 0;

  for (const trade of parsed) {
    const imported = await addTrade(trade);
    if (imported) importedCount += 1;
  }

  return importedCount;
}
