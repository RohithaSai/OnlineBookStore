import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const BOOK_INFO = 'book-info';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public saveCurrentCart(info: any): void {
    const data = this.getCurrentCartInfo();
    const existedItemIndex = data.findIndex((item: any) => item.book.id === info.book.id)
    if (existedItemIndex !== -1) {
      data[existedItemIndex].quantity = data[existedItemIndex].quantity + info.quantity;
    } else {
        data.push(info);
    }
    window.sessionStorage.setItem(BOOK_INFO, JSON.stringify(data));
  }

  public getCurrentCartInfo(): any {
    const info = window.sessionStorage.getItem(BOOK_INFO);
    if (info) {
      return JSON.parse(info);
    }

    return [];
  }

  public removeFromCart(info: any): void {
    let data = this.getCurrentCartInfo();
    const existedItemIndex = data.findIndex((item: any) => item.book.id === info.book.id)
    if (existedItemIndex !== -1) {
      data.splice(existedItemIndex, 1);
    }
    if (data.length > 0) {
      window.sessionStorage.setItem(BOOK_INFO, JSON.stringify(data));
    } else {
      this.clearCart();
    }
    window.location.reload();
  }

  public clearCart(): void {
    window.sessionStorage.removeItem(BOOK_INFO);
  }
}
