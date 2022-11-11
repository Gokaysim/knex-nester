export interface Company {
  id: number;
  name: string;
  products?: Product[];
  ownerId: number;
  owner?: User;
}
export interface Product {
  id: number;
  companyId: number;
  name: string;
  unitPrice: number;
  company?: Company;
  orderLines?: OrderLine[];
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  address?: string;
  orders?: Order[];
  ownedCompanies: Company[];
}
export interface Order {
  id: number;
  orderLines: OrderLine[];
  total: number;
  buyerId: number;
  date: string;
  buyer: User;
}
export interface OrderLine {
  id: number;
  orderId: number;
  order: Order;
  amount: number;
  productId: number;
  product?: Product;
}
