export interface Product {
  id: number;
  name: string;
  jan_suffix: string;
  category: string;
}

// 1つのロット行が持つデータ
export interface LotInput {
  id: number; // 各行をユニークに識別するためのID
  lotCount: number; // その行のロット数
  quantityPerLot: number; // その行の入数
}

// 1つの商品が持つデータ
export interface InventoryItem {
  productId: number;
  productName: string;
  janSuffix: string;
  lots: LotInput[]; // 複数のロット情報を配列で持つ
  subtotal: number; // 全ロット行の小計を合算した、商品ごとの合計
}

export interface HistoryRecord {
  id: string;
  date: string;
  items: Omit<InventoryItem, 'subtotal'>[];
  totalQuantity: number;
  staffName: string;
}