export interface OrderRequest {
  customerData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    email: string;
    phone: string;
  };
  orderDetails: {
    productId: number;
    quantity: number;
    price: number;
    productCode?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;  // Agrega este campo
}
