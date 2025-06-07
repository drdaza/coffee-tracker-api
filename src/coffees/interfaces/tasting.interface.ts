export interface Tasting {
  coffeeId: string;
  userId: string;
  rate?: number;
  aroma?: number;
  flavor?: number;
  body?: number;
  acidity?: number;
  balance?: number;
  notes?: string[];
}