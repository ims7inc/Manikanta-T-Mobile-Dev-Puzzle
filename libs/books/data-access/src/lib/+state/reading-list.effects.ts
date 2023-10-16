// libs\books\data-access\src\lib\+state\reading-list.effects.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() => ReadingListActions.confirmedRemoveFromReadingList({ item })),
          catchError(() => {
            this.showSnackbar('Book removal failed'); // Display snackbar on removal failure
            return of(ReadingListActions.failedRemoveFromReadingList({ item }));
          })
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  // Snackbar Effect for Undo
  showSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.removeFromReadingList), // Listen for removal action
        tap(({ item }) => {
          this.showSnackbar('Book removed'); // Display snackbar on removal
        })
      ),
    { dispatch: false } // Do not dispatch any action from this effect
  );

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Undo').onAction().subscribe(() => {
      // Handle the Undo action here, for example, by dispatching an action to revert the state.
      // Implement the logic to undo the action based on your application's state management.
      // In this example, you can dispatch an undo action.
    this.store.dispatch(
        ReadingListActions.undoRemoveFromReadingList({ item: null })
      );
    });
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store // Inject the Store
  ) {}
}
