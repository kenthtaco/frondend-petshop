export interface Order {
  amount: number;
  productId: any;
  quantity: any;
  price: any;
  id?: number;
  productCode?: string;
  orderDate: string;
  totalAmount: number;
  orderDetails: OrderDetail[];
  customerData: CustomerData; // Se añade la información del cliente
}

export interface OrderDetail {
  productId: number;
  quantity: number;
  price: number;
  productCode?: string;
  
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string;
  phone: string;
}
