export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  orderId: string;
  date: Date;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  tracking?: {
    step: 'Packed' | 'Shipped' | 'OutForDelivery' | 'Delivered';
    estimatedDate: Date;
  };
}
