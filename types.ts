
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  timestamp: string;
  items: CartItem[];
  totalPoints: number;
}

export type Page = 'home' | 'cart' | 'checkout' | 'success' | 'admin';
