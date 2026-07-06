export interface IAddGear {
  title: string;
  description?: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  image: string;
  isAvailable?: boolean;
  categoryId: string;
}
