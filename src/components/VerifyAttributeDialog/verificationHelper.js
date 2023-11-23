import { Auth } from 'aws-amplify';
import { loadUserAttributes } from '../../index';

// To initiate the process of verifying the attribute like 'phone_number' or 'email'
export const verifyCurrentUserAttribute = async (attr) => {
    console.log("verifyCurrentUserAttribute: ", attr)
    return Auth.currentAuthenticatedUser()
            .then(CognitoUser => {
                let clientMetadata = { attr: attr, source: 'broker' };
                Auth.verifyUserAttribute(CognitoUser, attr, clientMetadata)
                        .catch((err) => {
                            console.error(err);
                            loadUserAttributes();
                            throw err;
                        });
            }).catch(err => {
                console.error(err);
                throw err;

            });
};

/*
 * attributes = String
 * converted to JSON
 * Example: {"email": "your.name@example.com"}
 */
export const updatecurrentUserAttributes = async (attributes, attr = null) => {
    let jsonAttributes = JSON.parse(attributes);
    return Auth.currentAuthenticatedUser()
            .then(CognitoUser => {
                let clientMetadata = { attr: attr, source: 'broker' };
                Auth.updateUserAttributes(CognitoUser, jsonAttributes, clientMetadata)
                        .then(() => {
                            loadUserAttributes();
                        })
                        .catch(err => {
                            console.log(err);
                            throw err;
                        });
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
};
