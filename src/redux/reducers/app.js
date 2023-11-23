/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import i18nStrings from '../../i18n/i18n';
import { SET_LANG, SET_AUTH, SET_IS_CLIENT_LOADED, SET_VERIFY_EMAIL_CODE_REQUEST_COUNT, SET_USER_PREF_REMEMBER_DEVICE } from '../actionTypes';

const initialState = {
    lang: 'en',
    auth: false,
    isClientLoaded: false,
    verifyEmailCodeReqCount: 0,
    userPrefRememberDevice: true
};

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function (state = initialState, action) {
    switch (action.type) {
        case SET_LANG: {
            const { lang } = action.payload;
            if (lang && i18nStrings.hasOwnProperty(lang))
                return { ...state, lang: lang };

            return { ...state, lang: initialState.lang };
        }
        case SET_AUTH: {
            const { auth } = action.payload;
            return { ...state, auth: auth };
        }
        case SET_IS_CLIENT_LOADED: {
            const { isClientLoaded } = action.payload;
            return { ...state, isClientLoaded: isClientLoaded };
        }
        case SET_VERIFY_EMAIL_CODE_REQUEST_COUNT: {
            const { verifyEmailCodeReqCount } = action.payload;
            return { ...state, verifyEmailCodeReqCount: verifyEmailCodeReqCount };
        }
        case SET_USER_PREF_REMEMBER_DEVICE: {
            const { userPrefRememberDevice } = action.payload;
            return { ...state, userPrefRememberDevice: userPrefRememberDevice };
        }

        default:
            return state;
    }
}
