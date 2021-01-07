// DEFINICIONES

import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';

export enum Gender {
    Boy = 'Niño',
    Girl = 'Niña'
}

export type Country = string;

export interface Birth {
    country: Country;
    gender: Gender;
}

export const countries: Array<Country> = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
    'United Kingdom',
    'Afghanistan',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos [Keeling] Islands',
    'Colombia',
    'Comoros',
    'Congo - Brazzaville',
    'Congo - Kinshasa',
    'Cook Islands',
    'Costa Rica',
    'Cuba',
    'Côte d’Ivoire',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Ghana',
    'Gibraltar',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and McDonald Islands',
    'Honduras',
    'Hong Kong',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Isle of Man',
    'Israel',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Metropolitan France',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands Antilles',
    'Neutral Zone',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'North Korea',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestinian Territories',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn Islands',
    'Puerto Rico',
    'Qatar',
    'Russia',
    'Rwanda',
    'Réunion',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Martin',
    'Saint Pierre and Miquelon',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Serbia and Montenegro',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia and the South Sandwich Islands',
    'South Korea',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen',
    'Swaziland',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'Union of Soviet Socialist Republics',
    'United Arab Emirates',
    'United States',
    'Unknown or Invalid Region',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Wallis and Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe'
];

///////////////////////// UTILS ///////////////////////////

export const randomNumberGenerator = (min: number, max: number) => Math.random() * (max - min) + min;

export const padString = (numChars: number, fillString: string) => (value: any) => value.toString().padStart(numChars, fillString);

/** Custom Operator
 * Mirrors the source Observable but makes random delays between values.
 */
export const randomDelay = <T>(
    min: number,
    max: number
): MonoTypeOperatorFunction<T> =>
    concatMap(value => of(value).pipe(
        delay(randomNumberGenerator(min, max)),
    ));

/** Custom Operator
 * It generates a Birth item in every source emission
 */
export const generateBirth = () => (source$: Observable<any>): Observable<Birth> => source$.pipe(
    map(() => ({
        country: countries[Math.floor(randomNumberGenerator(0, countries.length - 1))],
        gender: Math.random() >= .5 ? Gender.Girl : Gender.Boy
    }))
);

///////////////////////////////////// UTILS QUE DEBÉIS USAR /////////////////////////////////////

/**
 * It formats a date to a more readable output
 */
export function formatCurrentTime(): string {
    const date = new Date();
    return `${ padString(2, '0')(date.getHours()) }:${ padString(2, '0')(date.getMinutes()) }:${ padString(2, '0')(date.getSeconds()) }:${ padString(3, '0')(date.getMilliseconds()) }`;
}

/**
 * It converts a birth to a string
 */
export const birthToString = (birth: Birth): string => ` ${ birth.gender } (${ birth.country })`;

/**
 * It updates value field assigning value parameter for passed input element
 */
export const updateInputElement = (element: HTMLInputElement) => (value: any) => element['value'] = value;

/**
 * It appends to the innerText property field assigning value parameter for passed html element
 */
export const appendValue = (element: HTMLElement) => value => {
    element.innerText += `${ value }\n`;
    element.scrollTop = element.scrollHeight;
};
