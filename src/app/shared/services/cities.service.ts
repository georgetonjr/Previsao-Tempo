import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsSearch from 'js-search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CityTypeaheadItem } from '../models/city-typeahead-item.model';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  constructor(private http: HttpClient) {}

  getCities(query: string): Observable<CityTypeaheadItem[]> {
    return this.http.get<{ country: string }[]>('assets/db/cities.json').pipe(
      map((cities) => {
        const search = new jsSearch.Search('geonameid');
        search.addIndex('country');
        search.addIndex('name');
        search.addDocuments(cities);
        return search.search(query);
      })
    );
  }
}
