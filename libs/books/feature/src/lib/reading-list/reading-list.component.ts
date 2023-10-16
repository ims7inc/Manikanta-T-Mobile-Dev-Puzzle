// libs\books\feature\src\lib\reading-list\reading-list.component.ts

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, undoRemoveFromReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$: Observable<ReadingListItem[]> = this.store.select(getReadingList);

  constructor(private readonly store: Store, private readonly snackBar: MatSnackBar) {}

  removeFromReadingList(item: ReadingListItem) {
    // Dispatch the action to remove the item from the reading list
    this.store.dispatch(removeFromReadingList({ item }));

    // Show snackbar with the "Undo" action
    const snackBarRef = this.snackBar.open('Item removed from reading list', 'Undo');

    // Handle "Undo" action
    snackBarRef.onAction().subscribe(() => {
      // Dispatch the action to undo the removal
      this.store.dispatch(undoRemoveFromReadingList({ item }));

      // Close the snackbar
      snackBarRef.dismiss();
    });
  }
}
