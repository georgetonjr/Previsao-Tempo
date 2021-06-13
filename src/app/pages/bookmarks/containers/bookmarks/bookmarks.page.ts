import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import * as fromBookmarksActions from '../../state/bookmarks.actions';
import { BookmarksState } from '../../state/bookmarks.reducer';
import * as fromBookmarksSelectors from '../../state/bookmarks.selectors';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit, OnDestroy {
  bookmarks$: Observable<Bookmark[]>;

  searchTypeaheadControl = new FormControl(undefined);

  private componentDestroyed$ = new Subject();

  constructor(private store: Store<BookmarksState>) {}

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(
      select(fromBookmarksSelectors.selectBookmarksList)
    );

    this.searchTypeaheadControl.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value: CityTypeaheadItem) =>
        this.store.dispatch(
          fromBookmarksActions.toggleBookmarById({ id: value.geonameid })
        )
      );
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  removeBookmark(id: number) {
    this.store.dispatch(fromBookmarksActions.removeBookmark({ id }));
  }
}
