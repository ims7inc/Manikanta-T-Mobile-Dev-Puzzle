import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

export const READING_LIST_FEATURE_KEY = 'readingList';

export interface State extends EntityState<ReadingListItem> {
  loaded: boolean;
  error: null | string;
  lastAction: string | null; // Store the last action as a string
}

export interface ReadingListPartialState {
  readonly [READING_LIST_FEATURE_KEY]: State;
}

export const readingListAdapter: EntityAdapter<ReadingListItem> = createEntityAdapter<ReadingListItem>({
  selectId: item => item.bookId
});

export const initialState: State = readingListAdapter.getInitialState({
  loaded: false,
  error: null,
  lastAction: null
});

const readingListReducer = createReducer(
  initialState,
  on(ReadingListActions.init, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ReadingListActions.loadReadingListSuccess, (state, action) => ({
    ...readingListAdapter.setAll(action.list, state),
    loaded: true
  })),
  on(ReadingListActions.loadReadingListError, (state, action) => ({
    ...state,
    error: action.error
  })),
  on(ReadingListActions.addToReadingList, (state, action) => {
    const updatedState = readingListAdapter.addOne({ bookId: action.book.id, ...action.book }, state);
    return {
      ...updatedState,
      lastAction: ReadingListActions.addToReadingList.type // Store the action type
    };
  }),
  on(ReadingListActions.removeFromReadingList, (state, action) => {
    const updatedState = readingListAdapter.removeOne(action.item.bookId, state);
    return {
      ...updatedState,
      lastAction: ReadingListActions.removeFromReadingList.type // Store the action type
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return readingListReducer(state, action);
}
