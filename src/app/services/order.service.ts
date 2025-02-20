import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para OrderRequest y OrderResponse
export interface OrderRequest {
  customerData: CustomerData;
  orderDetails: OrderDetailRequest[];
  totalAmount: number;
  paymentMethod: string; // Método de pago: "cash_on_delivery" o "credit_card", etc.
}

export interface OrderDetailRequest {
  productId: number;
  quantity: number;
  price: number;
  productCode?: string; // Se agregará dinámicamente en el backend
}

export interface OrderResponse {
  id: number;
  customerData: CustomerData;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  orderDetails: {
    productId: number;
    quantity: number;
    price: number;
    productCode: string;
  }[];
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrlCustomer = 'http://localhost:8080/dashboard-customer/orders'; // API para el cliente
  private apiUrlAdmin = 'http://localhost:8080/admin/orders'; // API para el administrador

  constructor(private http: HttpClient) {}

  // Obtener los pedidos del backend para el administrador
  getOrders(): Observable<OrderResponse[]> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrderResponse[]>(this.apiUrlAdmin, { headers });
  }

  // Obtener los pedidos realizados por el cliente
  getCustomerOrders(): Observable<OrderResponse[]> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrderResponse[]>(`${this.apiUrlCustomer}/getOrders`, { headers });
  }

  // Colocar un pedido
  placeOrder(order: OrderRequest): Observable<OrderResponse> {
    // Validar que los detalles de la orden no estén vacíos
    if (!order.orderDetails || order.orderDetails.length === 0) {
      throw new Error('Los detalles de la orden (orderDetails) no pueden estar vacíos.');
    }

    // Validar que el totalAmount sea mayor a 0
    if (!order.totalAmount || order.totalAmount <= 0) {
      throw new Error('El monto total (totalAmount) debe ser mayor a 0.');
    }

    // Validar que se haya seleccionado un método de pago
    if (!order.paymentMethod) {
      throw new Error('El método de pago debe ser seleccionado.');
    }

    // Añadir el productCode a cada detalle de la orden
    const updatedOrderDetails = order.orderDetails.map(detail => ({
      ...detail,
      productCode: `P${detail.productId}` // Aquí puedes generar el código de producto o tomarlo de otra fuente
    }));

    // Enviar el pedido al backend con los detalles actualizados
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<OrderResponse>(`${this.apiUrlCustomer}/placeOrder`, { 
      ...order, 
      orderDetails: updatedOrderDetails 
    }, { headers });
  }

  // Obtener un pedido por su ID desde el admin
  getOrderById(id: number): Observable<OrderResponse> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrderResponse>(`${this.apiUrlAdmin}/${id}`, { headers });
  }

  // Procesar un nuevo pedido desde el cliente (con pago)
  processOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<OrderResponse>(`${this.apiUrlCustomer}/placeOrder`, orderRequest, { headers });
  }

  // Actualizar un pedido desde el admin
  updateOrder(id: number, orderRequest: OrderRequest): Observable<OrderResponse> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<OrderResponse>(`${this.apiUrlAdmin}/${id}`, orderRequest, { headers });
  }

  // Eliminar un pedido desde el admin
  deleteOrder(id: number): Observable<void> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrlAdmin}/${id}`, { headers });
  }
}
