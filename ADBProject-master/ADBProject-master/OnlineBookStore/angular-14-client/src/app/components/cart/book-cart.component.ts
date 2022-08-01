import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css']
})
export class BookCartComponent implements OnInit {
  isLoggedIn = false;
  message = '';
  userId = '';
  username = '';
  amount = 0;
  cartInfo: any;
  orderItems: any = [];
  orderButtonClicked = false;
  constructor(private orderService: OrderService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.cartInfo = this.storageService.getCurrentCartInfo();
      const userInfo = this.storageService.getUser();
      this.userId =  userInfo.id;
      this.username = userInfo.username;
      this.cartInfo.map((item: any) => {
        const info = {
          bookId: item.book.id,
          title: item.book.title,
          copies: item.quantity,
          orderStatus: "Ordered"
        }
        this.amount = this.amount + (item.book.price * item.quantity)
        this.orderItems.push(info);
      })
    }
  }

  orderBook(): void {
    this.message = '';
    this.orderButtonClicked = true;
    const data = {
      userId: this.userId,
      username: this.username,
      amount: this.amount,
      orderItems: this.orderItems
    }
    this.orderService.orderBook(data)
      .subscribe({
        next: (res) => {
          this.storageService.clearCart();
          this.message = res.message ? res.message : 'Ordered successfully!';
        },
        error: (e) => {
          this.storageService.clearCart();
          this.message = e.error.message;
        }
      });
  }

  removeFromCart(item: any) {
    this.storageService.removeFromCart(item);
  }

  redirectToBooksPage() {
    this.router.navigate(['books']).then(() => {
      window.location.reload();
    });
  }
}
