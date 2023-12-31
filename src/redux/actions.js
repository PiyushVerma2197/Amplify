/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import {
    SET_LANG,
    SET_AUTH,
    SET_USER,
    SET_USER_EMAIL,
    SET_USER_PHONENUMBER,
    SET_IS_CLIENT_LOADED,
    SET_VERIFY_EMAIL_CODE_REQUEST_COUNT,
    SET_USER_PREF_REMEMBER_DEVICE
} from "./actionTypes";

export const setLang = lang => ({
    type: SET_LANG,
    payload: {
        lang: lang
    }
});

export const setAuth = auth => ({
    type: SET_AUTH,
    payload: {
        auth: auth
    }
});

export const setUser = user => ({
    type: SET_USER,
    payload: {
        user: user
    }
});

export const setUserEmail = email => ({
    type: SET_USER_EMAIL,
    payload: {
        email: email
    }
});

export const setUserPhonenumber = phoneNumber => ({
    type: SET_USER_PHONENUMBER,
    payload: {
        phoneNumber: phoneNumber
    }
});
export const setIsClientLoaded = loaded => ({
    type: SET_IS_CLIENT_LOADED,
    payload: {
        isClientLoaded: loaded
    }
});

export const setVerifyEmailCodeCount = count => ({
    type: SET_VERIFY_EMAIL_CODE_REQUEST_COUNT,
    payload: {
        verifyEmailCodeReqCount: count
    }
});
export const setUserPrefRememberDevice = remember => ({
    type: SET_USER_PREF_REMEMBER_DEVICE,
    payload: {
        userPrefRememberDevice: remember
    }
});
