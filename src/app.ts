import { of, from, fromEvent, merge, Observable, combineLatest } from 'rxjs';
import { map, mergeMap,  switchMap, pluck, filter, startWith, delay, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fromFetch } from 'rxjs/fetch';

console.clear();

//////////////////////////// DOM ELEMENTS ////////////////////////////

const searchTypeSelect = document.getElementById('searchTypeSelect');
const searchTermInput = document.getElementById('searchTermInput');
const results = document.getElementById('results');

//////////////////////////// DEFINITIONS ////////////////////////////

export interface SearchResult {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

export interface OmdbResult {
  Response: string;
  Search?: Array<SearchResult>;
  totalResults?: string;
  Error?: string;
}

///////////////////////// UTILS ///////////////////////////

const addResultText = (text: string) => results.innerText += text + '\n';
const clearResult = () => results.innerText = '';

/**
 * It prints the received OmdbResult into the console, applying a proper format 
 * @param result {OmdbResult}
 */
export function omdbResultToString(result: OmdbResult) {
  if (result.Response === 'False') {
    addResultText(`Error when performing this search: ${result.Error}`);
  } else {
    addResultText(`Total results: ${result.totalResults}. \nShowing first ${result.Search.length} results:`);
    result.Search.forEach(_ => addResultText(`${_.Title} (${_.Year})`));
  }
}

/**
 * RxJS operator: It converts an input stream containing an HTML Response to a json structure 
 * @param source$ {Observable<Response>}
 * @returns {Object}
 */
export const toJson = () => (source$: Observable<Response>) => source$.pipe(mergeMap((_: Response) => from(_.json())));

/**
 * It performs a request to OMDB api (delay 1 second)
 * @param [type, term] {[string, string]}
 * @returns {OmdbResult}
 */

export const getSearchResults = ([type, term]: [string, string]): Observable<Response> => fromFetch(`https://www.omdbapi.com/?type=${type}&s=${term}&apikey=24cdb94d`).pipe(delay(1000));


export function formatCurrentTime(): string {
  const date = new Date();
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * It prints the search title
 */

export function searchBy(term: string) {
  clearResult();
  addResultText(`\n\nNew Search with: '${term}'\n--------------------------------------------------------------------------------------------`);

  addResultText(`Searching results by term -> ${term} (${term.length} chars) - (${formatCurrentTime()})`);
}

//////////////////////////////// EXERCISE //////////////////////////////// 

export const searchType$ = fromEvent(searchTypeSelect, 'change')
  .pipe(
    pluck('target', 'value'),
    startWith('movie')
  );

const moreThanNChars = (numChars: number ) => (term: string) => term.length >= numChars;

const moreThan4Chars = moreThanNChars(4);

export const searchTerm$ = fromEvent(searchTermInput, 'input')
  .pipe(
    debounceTime(250),
    pluck('target', 'value'),
    filter(moreThan4Chars),
    distinctUntilChanged()
  );

// adding enter key to perform the search

export const searchWhenEnterClicked$ = fromEvent(searchTermInput, 'keydown')
  .pipe(
filter((e: KeyboardEvent) => e.key === 'Enter'),
       pluck('target', 'value'),
    );

export const searchTermOrEnterKey$ = merge(searchTerm$, searchWhenEnterClicked$);

export const searchOrEnter$ = combineLatest([searchType$, searchTermOrEnterKey$])
  .pipe(
    tap(([, term]: [string, string]) => searchBy(term)),
    switchMap(getSearchResults),
    toJson()
  );


  // Subscriptions

  searchOrEnter$
  .subscribe(omdbResultToString);