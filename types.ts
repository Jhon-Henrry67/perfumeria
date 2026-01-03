
export interface SizePrice {
  size: string;
  price: number;
  discountPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // Precio base (generalmente 50ml)
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  notes: string[];
  family: string;
  category: 'Men' | 'Women' | 'Unisex';
  image: string;
  isNew?: boolean;
  description?: string;
  sizePrices?: SizePrice[]; // Precios específicos por tamaño
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  totalPrice: number;
}

export interface UserInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Order extends UserInfo {
  id: string;
  date: string;
  items: { name: string; size: string; quantity: number }[];
  total: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
