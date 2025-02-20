import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { OrderResponse, OrderService } from 'src/app/services/order.service';
import { OrderRequest } from 'src/app/models/order-request.model';
import { SidebarService } from '../sidebar/sidebar.service';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterModule],
})
export class MainComponent implements OnInit {
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalOrders: number = 0;
  orders: Order[] = [];
  isClosed: boolean = false;

  // Datos del cliente que se enviarán con el pedido
  customerData: any = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    phone: '',
  };

  // Método de pago (puedes adaptarlo según el frontend)
  paymentMethod: string = 'cash_on_delivery';  // Ejemplo de valor, puede cambiar según el frontend

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private sidebarService: SidebarService // Inyecta el servicio
  ) {}

  ngOnInit(): void {
    this.loadCounts();

    // Suscríbete al estado del sidebar
    this.sidebarService.isClosed$.subscribe((isClosed) => {
      this.isClosed = isClosed;
    });
  }

  loadCounts(): void {
    // Obtener productos, categorías y órdenes de manera simultánea
    this.productService.getProducts().subscribe((products) => {
      this.totalProducts = products.length;
    });

    this.categoryService.getCategories().subscribe((categories) => {
      this.totalCategories = categories.length;
    });

    this.orderService.getOrders().subscribe((orders: OrderResponse[]) => {
      this.orders = orders.map((orderResponse) => {
        const totalAmount = orderResponse.orderDetails.reduce(
          (total: number, detail: { quantity: number; price: number }) => total + detail.quantity * detail.price,
          0
        );

        const order: Order = {
          amount: totalAmount, // Aquí se calcula el total
          productId: orderResponse.orderDetails.map((detail: { productId: any }) => detail.productId),
          quantity: orderResponse.orderDetails.map((detail: { quantity: any }) => detail.quantity),
          price: orderResponse.orderDetails.map((detail: { price: any }) => detail.price),
          id: orderResponse.id,
          orderDate: orderResponse.orderDate,
          totalAmount: orderResponse.totalAmount, // Asegúrate de tener esta propiedad
          orderDetails: orderResponse.orderDetails.map((detail: { productId: any; quantity: any; price: any }) => ({
            productId: detail.productId,
            quantity: detail.quantity,
            price: detail.price,
          })),
          customerData: orderResponse.customerData, // Puedes tener esta información si viene de la API
        };

        return order;
      });
      this.totalOrders = this.orders.length;
    });
  }

  // Controlar el estado del sidebar
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe(
      () => {
        this.loadCounts();
      },
      (error) => {
        console.error('Error deleting order', error);
      }
    );
  }

  // Nuevo método para procesar el pago y crear el pedido sin userId
  processOrder(): void {
    // Crear el objeto de pedido sin el userId, pero con los datos del cliente
    const orderRequest: OrderRequest = {
      totalAmount: this.calculateTotalAmount(),
      orderDetails: this.getOrderDetails(),
      customerData: this.customerData, // Datos del cliente
      paymentMethod: this.paymentMethod,  // Asegúrate de incluir el método de pago
    };

    this.orderService.placeOrder(orderRequest).subscribe(
      (response) => {
        console.log('Pedido realizado con éxito', response);
        alert('Pedido realizado con éxito');
      },
      (error) => {
        console.error('Error al procesar el pedido', error);
        alert('Error al procesar el pedido');
      }
    );
  }

  // Método para calcular el monto total de la orden (puedes adaptarlo a tu lógica)
  calculateTotalAmount(): number {
    return this.orders.reduce((total, order) => total + order.amount, 0);
  }

  // Método para obtener los detalles del pedido
  getOrderDetails(): any[] {
    return this.orders.map((order) => ({
      productId: order.productId,
      quantity: order.quantity,
      price: order.price,
    }));
  }
}
