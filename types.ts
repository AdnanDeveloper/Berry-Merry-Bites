
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

export type Page = 'home' | 'cart' | 'checkout' | 'success';
