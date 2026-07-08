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

export interface IQuery {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}
