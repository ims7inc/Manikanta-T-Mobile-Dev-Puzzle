// libs\books\feature\src\lib\book-search\book-search.component.ts

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  removeFromReadingList
 } from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';
  
@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe((books) => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

addBookToReadingList(book: Book) {
  // Create a ReadingListItem from the Book
  const readingListItem: ReadingListItem = {
    bookId: book.id,  // Assuming 'id' is the identifier for books
    // Add other required fields from the book object or set defaults
    ...book
  };

  // Dispatch the action to add the ReadingListItem to the reading list
  this.store.dispatch(addToReadingList({ book }));

  // Open a snackbar with the "Undo" action
  const snackBarRef = this.snackBar.open('Book added to reading list', 'Undo');

  // Listen for snackbar action responses
  snackBarRef.onAction().subscribe(() => {
    this.undoAddToReadingList(readingListItem, snackBarRef);
  });
}

undoAddToReadingList(lastAddedItem: ReadingListItem, snackBarRef: any) {
  // Dispatch action to remove the last added item from the reading list
  this.store.dispatch(removeFromReadingList({ item: lastAddedItem }));

  // Close the snackbar
  snackBarRef.dismiss();
}
  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
