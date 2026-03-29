export interface User {
  uid: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  vendorId: string;
  createdAt: string;
}

export interface CartItem extends Pick<Product, 'id' | 'title' | 'price'> {
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
}
