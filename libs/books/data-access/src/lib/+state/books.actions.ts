// libs\books\data-access\src\lib\+state\books.actions.ts

import { createAction, props } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

// Sorted imports by modules in alphabetical order
// Added JSDoc comments for actions

/**
 * Action to search books.
 * @param term - The search term.
 */
export const searchBooks = createAction('[Books Search Bar] Search', props<{ term: string }>());

/**
 * Action for successful book search.
 * @param books - The array of books.
 */
export const searchBooksSuccess = createAction('[Book Search API] Search success', props<{ books: Book[] }>());

/**
 * Action for book search failure.
 * @param error - The error object.
 */
export const searchBooksFailure = createAction('[Book Search API] Search failure', props<{ error: any }>());



/**
 * Action to clear the search bar.
 */
export const clearSearch = createAction('[Books Search Bar] Clear Search');

/**
 * Action to undo the previous action with a search term.
 * @param searchTerm - The search term to revert to.
 */
export const undoAction = createAction('[Books Search Results] Undo Action', props<{ searchTerm: string }>());

