/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import { i18nStrings as de } from './locales/de';
import { i18nStrings as en } from './locales/en';
import { i18nStrings as fr } from './locales/fr';
import { i18nStrings as nl } from './locales/nl';
import { translations } from '@aws-amplify/ui-react';

// Extend Amplify Translations
const i18nStrings = {
	de: { ...de, ...translations.de },
	en: { ...en, ...translations.en },
	fr: { ...fr, ...translations.fr },
	nl: { ...nl, ...translations.nl }
};

export const LanguageTypes = [
	{
		'code': 'en',
		'lang': 'English'
	},
	{
		'code': 'fr',
		'lang': 'Français' //French
	},
	{
		'code': 'de',
		'lang': 'Deutsch' // German
	},
	{
		'code': 'nl',
		'lang': 'Nederlands' // Dutch
	}
];

export default i18nStrings;
