import { Component } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {

  book: Book = {
    isbn: null,
    title: '',
    author:'',
    description: '',
    genre: '',
    price: null,
    stock: null
  };
  submitted = false;

  constructor(private bookService: BookService) { }

  saveBook(): void {
    const data = {
      isbn: this.book.isbn,
      title: this.book.title,
      author: this.book.author,
      description: this.book.description,
      genre: this.book.genre,
      price: this.book.price,
      stock: this.book.stock
    };

    this.bookService.create(data)
      .subscribe({
        next: (res) => {
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newBook(): void {
    this.submitted = false;
    this.book = {
      isbn: null,
      title: '',
      author:'',
      description: '',
      genre: '',
      price: null,
      stock: null
    };
  }

}
