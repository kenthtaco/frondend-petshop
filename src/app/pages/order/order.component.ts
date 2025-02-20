import { Component, OnInit } from '@angular/core';
import { Order, OrderDetail } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  newOrder: Order = { userId: 0, orderDate: '', totalAmount: 0, orderDetails: [] };
  editingOrderId?: number;
  newOrderDetail: OrderDetail = { productId: 0, quantity: 0, price: 0 };

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      orders => {
        this.orders = orders;
      },
      error => {
        console.error('Error loading orders', error);
      }
    );
  }

  saveOrder(): void {
    if (this.editingOrderId) {
      this.orderService.updateOrder(this.editingOrderId, this.newOrder).subscribe(
        () => {
          this.loadOrders();
          this.newOrder = { userId: 0, orderDate: '', totalAmount: 0, orderDetails: [] };
          this.editingOrderId = undefined;
        },
        error => {
          console.error('Error updating order', error);
        }
      );
    } else {
      this.orderService.createOrder(this.newOrder).subscribe(
        () => {
          this.loadOrders();
          this.newOrder = { userId: 0, orderDate: '', totalAmount: 0, orderDetails: [] };
        },
        error => {
          console.error('Error creating order', error);
        }
      );
    }
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe(
      () => {
        this.orders = this.orders.filter(o => o.id !== id);
      },
      error => {
        console.error('Error deleting order', error);
      }
    );
  }

  editOrder(order: Order): void {
    this.newOrder = { ...order };
    this.editingOrderId = order.id;
  }

  addOrderDetail(): void {
    this.newOrder.orderDetails.push({ ...this.newOrderDetail });
    this.newOrderDetail = { productId: 0, quantity: 0, price: 0 };
  }

  removeOrderDetail(index: number): void {
    this.newOrder.orderDetails.splice(index, 1);
  }
}
