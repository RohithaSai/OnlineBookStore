export class Book {
  isbn?: number | null;
  id?: any;
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  price?: number | null;
  stock?: number | null;
  reviews?: [{
    comment?: string;
    userId?: string;
  }]
}
