// Backup / restore and file export. On the phone, files go through the share sheet
// (save to Drive, Files, Messenger...) since WebViews can't download directly.
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { AppState, Expense, today } from '@/lib/budget';

const APP = 'BaonBuddy';
const VERSION = 1;

export async function saveFile(name: string, text: string, mime: string) {
  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: name, files: [uri] });
    return;
  }
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportBackup(state: AppState) {
  const body = JSON.stringify({ app: APP, version: VERSION, exportedAt: new Date().toISOString(), data: state }, null, 2);
  return saveFile(`baonbuddy-backup-${today()}.json`, body, 'application/json');
}

// Reads a backup file and checks it looks like ours before anything is replaced
export async function readBackup(file: File): Promise<AppState> {
  let json: { app?: string; data?: AppState };
  try {
    json = JSON.parse(await file.text());
  } catch {
    throw new Error('That file isn’t a valid backup.');
  }
  const d = json?.data;
  if (json?.app !== APP || !d || !Array.isArray(d.expenses) || !d.start || !d.end) {
    throw new Error('That file isn’t a BaonBuddy backup.');
  }
  d.expenses = d.expenses.filter((e: Expense) => e && Number.isFinite(Number(e.amount)) && Number(e.amount) > 0);
  return d;
}
