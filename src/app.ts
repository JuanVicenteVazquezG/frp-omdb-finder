import { combineLatest, from, fromEvent, merge, Observable } from 'rxjs';

import { fromFetch } from 'rxjs/fetch';
import { debounceTime, delay, distinctUntilChanged, filter, mergeMap, pluck, startWith, switchMap, tap } from 'rxjs/operators';

console.clear();

//////////////////////////// DOM ELEMENTS ////////////////////////////

const searchTypeSelect = document.getElementById('searchTypeSelect');
const searchTermInput = document.getElementById('searchTermInput');
const resultsContainer = document.getElementById('resultsContainer');
const searchInfoContainer = document.getElementById('searchInfoContainer');

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

/**
 * Añade un nodo a un elemento HTML.
 * IMPORTANTE: NO DEBERÍAS NECESITAR USAR ESTA FUNCIÓN PARA TU SOLUCIÓN
 */
const addChildElement = (parent: HTMLElement, text: string, clazz = '') => {
    const div = document.createElement('div');
    div.innerText = text;
    div.className = clazz;
    parent.appendChild(div);
};
/**
 * Limpia un elemento HTML.
 * IMPORTANTE: NO DEBERÍAS NECESITAR USAR ESTA FUNCIÓN PARA TU SOLUCIÓN
 */
const clearHtmlElement = (element: HTMLElement) => element.innerHTML = '';

/**
 * Pinta en pantalla la respuesta de la búsqueda, tanto si es un error, como si es una bésqueda con resultados
 */
export function searchResultOutput(result: OmdbResult) {
    if (result.Response === 'False') {
        addChildElement(resultsContainer, `Error when performing this search: ${ result.Error }`, 'search-error');
    } else {
        addChildElement(resultsContainer, `Total results: ${ result.totalResults }. Showing first ${ result.Search.length }`, 'result-summary');
        result.Search.map(_ => `${ _.Title } (${ _.Year })`).forEach(_ => addChildElement(resultsContainer, _, 'result-row'));
    }
}

/**
 * Convierte la respuesta de la HttpRequest a un OmdbResult
 */
export const toJson = () => (source$: Observable<Response>) => source$.pipe(mergeMap((_: Response) => from(_.json())));

/**
 * Hace la petición a la API de ORMDB.
 * Añade un segundo de delay para que no sea tan instantánea, sino parece que no se hace una petición real.
 * NOTA: Para ver que si hace una petición real, abre las Dev tools (F12) y en el apartado de Network verás que hace peticiones reales.
 */

export const getSearchResults = ([type, term]: [string, string]): Observable<Response> => fromFetch(`https://www.omdbapi.com/?type=${ type }&s=${ term }&apikey=24cdb94d`)
    .pipe(delay(1000));

/**
 * Coge el momento de la petición y lo formatea
 *  * IMPORTANTE: NO DEBERÍAS NECESITAR USAR ESTA FUNCIÓN PARA TU SOLUCIÓN
 */
export function formatCurrentTime(): string {
    const date = new Date();
    return `${ date.getDate() }-${ date.getMonth() + 1 }-${ date.getFullYear() }  ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
}

/**
 * Le pasamos el término por el que estamos buscando y lo muestra por pantalla
 */

export function searchBy(term: string) {
    clearHtmlElement(resultsContainer);
    clearHtmlElement(searchInfoContainer);
    addChildElement(searchInfoContainer, `Searching results by term: ${ term } (${ term.length } chars) - (${ formatCurrentTime() })`, 'search-title');
}

//////////////////////////////// EXERCISE //////////////////////////////// 

export const searchType$ = fromEvent(searchTypeSelect, 'change')
    .pipe(
        pluck('target', 'value'),
        startWith('movie')
    );

const moreThanNChars = (numChars: number) => (term: string) => term.length >= numChars;

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
    .subscribe(searchResultOutput);
