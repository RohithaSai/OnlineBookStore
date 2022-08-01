import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {

  books?: Book[];
  orders: any;
  currentBook: Book = {};
  currentIndex = -1;
  title = '';
  private roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  username?: string;
  userId?: string;
  isReviewButtonClicked = false;
  selectedId : number | null = null;
  review = '';
  selectedBook = '';
  message = '';
  orderReturnMessage = '';
  orderReturnBookId = '';
  reviewError = false;

  constructor(private bookService: BookService, private storageService: StorageService, private orderService: OrderService, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
      this.userId = user.id
    }
    this.retrieveBooks();
    if (!this.isAdmin) {
      this.retrieveOrders();
    }
  }

  retrieveBooks(): void {
    this.bookService.getAll()
      .subscribe({
        next: (data) => {
          this.books = data;
        },
        error: (e) => console.error(e)
      });
  }

  retrieveOrders(): void {
    this.orderService.getAll(this.username)
      .subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveBooks();
    this.currentBook = {};
    this.currentIndex = -1;
  }

  setActiveBook(book: Book, index: number): void {
    this.currentBook = book;
    this.currentIndex = index;
  }

  removeAllBooks(): void {
    this.bookService.deleteAll()
      .subscribe({
        next: (res) => {
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  returnOrder(id: string, bookId: string): void {
    const data = {
      bookId: bookId
    };
    this.orderService.update(id, data)
      .subscribe({
        next: (res) => {
          window.location.reload()
        },
        error: (e) => {
          this.orderReturnBookId = bookId;
          this.orderReturnMessage = e.error.message;
        }
      });
  }

  searchTitle(): void {
    this.currentBook = {};
    this.currentIndex = -1;

    this.bookService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.books = data;
        },
        error: (e) => console.error(e)
      });
  }

  reviewClicked(id: number, selectedBook: string): void {
    this.isReviewButtonClicked = true;
    this.selectedId = id;
    this.selectedBook = selectedBook;
  }

  submitReview(): void {
    const data = {
      comment: this.review,
      userId: this.userId
    }
    this.reviewService.addReview(this.selectedId, data)
      .subscribe({
        next: (res) => {
          window.location.reload();
        },
        error: (e) => {
          this.reviewError = true;
          this.message = e.error.message;
        }
      });
  }

  cancelReview(): void {
    this.isReviewButtonClicked = false;
    this.reviewError = false;
    this.selectedId = null;
    this.selectedBook = '';
    this.review = '';
  }
}
