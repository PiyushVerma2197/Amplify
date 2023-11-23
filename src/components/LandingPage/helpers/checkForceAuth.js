/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

/*
 * If the token swap failed in Authorize lambda then we logout before continuing PKCE
 */

import { Auth, Logger } from 'aws-amplify';

import { eraseCookie } from './cookieHelper';
const logger = new Logger('checkForceAuth');

const checkForceAuth = async () => {
    logger.debug("Checking for force Auth");
	const forceAuth = new URLSearchParams(window.location.search).get("forceAuth") || false;

	if (forceAuth) {
        logger.debug("Removing tokens, and client_id");
		eraseCookie("id_token");
		eraseCookie("access_token");
		eraseCookie("refresh_token");

		localStorage.removeItem("client-id");
        logger.debug("Forcing Auth.SignOut");
		await Auth.signOut();
        // Remove forceAuth setting and reload without forceAuth Parameter
        let queryStringParams = new URLSearchParams(window.location.search);
        queryStringParams.delete('forceAuth');
        window.location = window.location.protocol + '//' +window.location.host + window.location.pathname + "?"+ queryStringParams.toString();
	}
};

export default checkForceAuth;
