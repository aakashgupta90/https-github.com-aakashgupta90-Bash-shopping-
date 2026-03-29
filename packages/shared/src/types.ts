export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'vendor';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}
