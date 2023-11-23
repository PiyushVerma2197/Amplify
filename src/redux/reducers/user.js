/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier": MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import { SET_USER, SET_USER_EMAIL, SET_USER_PHONENUMBER } from '../actionTypes';

const initState = () => {
  const attributes = [];

  const user = {
    id: '',
    username: '',
    attributes: attributes,
    email: '',
    email_verified: undefined,
    phone_number: '',
    phone_number_verified: undefined
  };

  return user;
};

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function(state = initState(), action) {
  switch (action.type) {
    case SET_USER: {
      const { user } = action.payload;

      if (!user) {
        return { user: initState() };
      }

      return {
        id: user.id, username: user.username, attributes: user.attributes,
        email: user.attributes.email || '',
        email_verified: user.attributes.email_verified || false,
        phone_number: user.attributes.phone_number || '',
        phone_number_verified: user.attributes.phone_number_verified || false
      };
    }
    case SET_USER_EMAIL: {
      const { email } = action.payload;

      const _user = state;
      _user.attributes.email = email;

      return { id: _user.id, username: _user.username, attributes: _user.attributes };
    }
    case SET_USER_PHONENUMBER: {
      const { phoneNumber } = action.payload;

      const _user = state;
      _user.attributes.phone_number = phoneNumber;

      return { id: _user.id, username: _user.username, attributes: _user.attributes };
    }
    default:
      return state;
  }
}
