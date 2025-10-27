import * as XLSX from 'xlsx';
import type { InventoryItem } from '../types/inventory';

// ★★★ 4. 新しいエクスポート形式に合わせてデータを作成する関数 ★★★
const createProductSummaryExportData = (items: InventoryItem[], staffName: string) => {
  // 今日の日付を mm/dd 形式で取得
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

// Excel (.xlsx) 形式でエクスポート
export const exportToXLSX = (items: InventoryItem[], staffName: string) => {
  // ★★★ 呼び出す関数と渡す引数を変更 ★★★
  const data = createProductSummaryExportData(items, staffName);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '在庫データ');

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `inventory_${dateStr}.xlsx`);
};

// CSV形式でエクスポート
export const exportToCSV = (items: InventoryItem[], staffName: string) => {
  // ★★★ 呼び出す関数と渡す引数を変更 ★★★
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