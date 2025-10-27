// 商品マスタの型
export interface Product {
  id: number;
  name: string;
  jan_suffix: string; // JANコード下4桁
  category: string;
}

// 入力されるロット情報の型 (一意なIDを追加)
export interface LotInput {
  id: number; // 動的に追加・削除するために一意なIDを持つ
  lot: string;
  quantity: number;
}

// 在庫入力中の商品の型
export interface InventoryItem {
  productId: number;
  productName: string;
  janSuffix: string; // janコード下4桁
  lots: LotInput[];
  subtotal: number; // 商品ごとの小計
}

// 履歴として保存するデータの型
export interface HistoryRecord {
  id: string; // 履歴の一意なID
  date: string; // ISO 8861 形式の文字列
  // 保存時は小計(subtotal)は不要なため、Omitで除外する
  items: Omit<InventoryItem, 'subtotal'>[];
  totalQuantity: number;
}