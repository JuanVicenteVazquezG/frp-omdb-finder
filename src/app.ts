import { BehaviorSubject, fromEvent, Observable, range } from 'rxjs';
import { bufferTime, debounceTime, distinctUntilChanged, filter, map, sample, scan, throttleTime, withLatestFrom } from 'rxjs/operators';
import { appendValue, Birth, birthToString, formatCurrentTime, generateBirth, randomDelay, updateInputElement } from './data-and-utils';

console.clear();

//////////////////////////// MAIN STREAM ////////////////////////////
const eventPressure$ = range(0, 1000000)
    .pipe(
        generateBirth(),
        randomDelay(0, 600)
    );

//////////////////////////// DOM ELEMENTS ////////////////////////////

const eventCounter = document.getElementById('eventCounter') as HTMLInputElement;
const silence = document.getElementById('silence') as HTMLInputElement;
const grouping = document.getElementById('grouping') as HTMLDivElement;
const last = document.getElementById('last') as HTMLInputElement;
const firstBirthSecond = document.getElementById('firstBirthSecond') as HTMLInputElement;

const conditionValue = document.getElementById('conditionValue') as HTMLInputElement;
const byCondition = document.getElementById('byCondition') as HTMLInputElement;

//////////////////////////// STREAMS AND DEFINITIONS ////////////////////////////

const condition$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

const lastEmittedEventButtonClick$ = fromEvent(document.getElementById('lastEmittedEvent'), 'click');

const changeConditionButtonClick$ = fromEvent(document.getElementById('byConditionButton'), 'click');

changeConditionButtonClick$
    .subscribe(() => {
        const nextConditionValue = !(condition$.getValue());
        condition$.next(nextConditionValue);
        updateInputElement(conditionValue)(`Condición: ${ nextConditionValue }`);

        conditionValue.className = nextConditionValue ? 'active' : 'inactive';
    });

///////////////////////// Ejercicio ///////////////////////////

eventPressure$
    .pipe(scan((acc) => acc + 1, 0))
    .subscribe(_ => updateInputElement(eventCounter)(`#${ _ }  -> ${ formatCurrentTime() } `));

eventPressure$
    .pipe(debounceTime(500))
    .subscribe(_ => updateInputElement(silence)(birthToString(_)));

eventPressure$
    .pipe(
        bufferTime(2000),
        filter((items: Array<any>) => items.length > 0)
    )
    .subscribe((b: Array<Birth>) => appendValue(grouping)(`${ b.length } Nacimientos: ${ b.map(_ => birthToString(_)) }\n`));

// Primer evento de cada segundo
eventPressure$
    .pipe(throttleTime(1000))
    .subscribe(_ => {
        updateInputElement(firstBirthSecond)((`${ formatCurrentTime() }: ${ birthToString(_) }`));
    });

eventPressure$
    .pipe(sample(lastEmittedEventButtonClick$))
    .subscribe(_ => updateInputElement(last)((`${ formatCurrentTime() }: ${ birthToString(_) }`)));

////////////////// Por condición

/**
 * Same as skipWhile but managed with an observable
 * @param condition$
 */
export const skipWhen = (condition$: Observable<boolean>) => (source$: Observable<any>): Observable<any> =>
    source$
        .pipe(
            withLatestFrom(condition$.pipe(distinctUntilChanged())),
            filter(([, condition]) => !!condition),
            map(([source]) => source)
        );

eventPressure$
    .pipe(skipWhen(condition$))
    .subscribe(_ => updateInputElement(byCondition)((`${ formatCurrentTime() }: ${ birthToString(_) }`)));
