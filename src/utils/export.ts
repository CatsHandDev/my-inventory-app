import * as XLSX from 'xlsx';
import type { InventoryItem, HistoryRecord } from '../types/inventory'; // HistoryRecordをインポート
 // HistoryRecordをインポート

// --- 確認画面からのエクスポート用 ---
const createProductSummaryExportData = (items: InventoryItem[], staffName: string) => {
  const today = new Date();
  const date = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;

  return items.map(item => ({
    '商品名': item.productName,
    'JANコード': item.janSuffix,
    '日付': date,
    '合計個数': item.subtotal,
    '担当者': staffName,
  }));
};

// ★★★ ここから下を全て追加 ★★★

// --- 履歴データからのエクスポート用ヘルパー関数 ---
const createHistoryExportData = (record: HistoryRecord) => {
  const recordDate = new Date(record.date);
  const date = `${(recordDate.getMonth() + 1).toString().padStart(2, '0')}/${recordDate.getDate().toString().padStart(2, '0')}`;

  // 履歴のitemにはsubtotalがないので、lotsから計算する
  return record.items.map(item => {
    const subtotal = item.lots.reduce((sum, lot) => sum + (lot.quantity || 0), 0);
    return {
      '商品名': item.productName,
      'JANコード': item.janSuffix,
      '日付': date,
      '合計個数': subtotal,
      '担当者': record.staffName || '', // 過去のデータに担当者名がなければ空文字
    };
  });
};

// --- 既存のエクスポート関数 (変更なし) ---
export const exportToXLSX = (items: InventoryItem[], staffName: string) => {
  const data = createProductSummaryExportData(items, staffName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '在庫データ');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `inventory_${dateStr}.xlsx`);
};

export const exportToCSV = (items: InventoryItem[], staffName: string) => {
  const data = createProductSummaryExportData(items, staffName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


// --- 履歴エクスポート用の新しい関数 ---
export const exportHistoryToXLSX = (record: HistoryRecord) => {
  const data = createHistoryExportData(record);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '履歴データ');
  const dateStr = record.date.slice(0, 10);
  XLSX.writeFile(workbook, `history_${dateStr}.xlsx`);
};

export const exportHistoryToCSV = (record: HistoryRecord) => {
  const data = createHistoryExportData(record);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const dateStr = record.date.slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `history_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};