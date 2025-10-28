// 商品マスタの型
export interface Product {
  id: number;
  name: string;
  jan_suffix: string; // JANコード下4桁
  category: string;
}

// 入力されるロット情報の型
export interface LotInput {
  id: number;
  lot: string;
  quantity: number;
}

// 在庫入力中の商品の型
export interface InventoryItem {
  productId: number;
  productName: string;
  janSuffix: string;
  lots: LotInput[];
  subtotal: number;
}

// 履歴として保存するデータの型
export interface HistoryRecord {
  id: string;
  date: string;
  items: Omit<InventoryItem, 'subtotal'>[];
  totalQuantity: number;
  staffName: string; // ★★★ 担当者名を追加 ★★★
}