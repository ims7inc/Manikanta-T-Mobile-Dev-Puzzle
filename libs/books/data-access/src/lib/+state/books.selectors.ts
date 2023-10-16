// libs\books\data-access\src\lib\+state\books.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BOOKS_FEATURE_KEY, booksAdapter, BooksPartialState, State } from './books.reducer';

// Select the feature state
export const getBooksState = createFeatureSelector<BooksPartialState, State>(BOOKS_FEATURE_KEY);

// Use the selectAll selector provided by the booksAdapter to get all books
const { selectAll } = booksAdapter.getSelectors();

// Create selectors to get specific parts of the state
export const getBooksLoaded = createSelector(
  getBooksState,
  (state: State) => state.loaded
);

export const getBooksError = createSelector(
  getBooksState,
  (state: State) => state.error
);

// Use the selectAll selector to get all books
export const getBooks = createSelector(getBooksState, selectAll);
