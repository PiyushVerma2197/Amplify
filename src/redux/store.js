/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import rootReducer from "./reducers";
import { createStore, applyMiddleware } from 'redux'
import { Logger } from "aws-amplify";

const logger = new Logger('stateLogger');

function stateLogger({ getState }) {
    return next => action => {
        logger.debug('will dispatch', action)

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action)

        logger.debug('state after dispatch', getState())

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}

export default createStore(rootReducer, applyMiddleware(stateLogger));
