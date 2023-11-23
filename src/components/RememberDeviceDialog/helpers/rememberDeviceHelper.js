import { Auth, Hub } from 'aws-amplify';
import { Logger } from 'aws-amplify';
import store from "../../../redux/store";
import { setUserPrefRememberDevice } from "../../../redux/actions";


const logger = new Logger('RememberDevice');
export const checkDeviceRemembered = async () => {
    return new Promise((resolve, reject) => {
        /*Checks if the current user devices is remembered, if not prompts to user to trust device*/
        Auth.currentUserPoolUser().then((currUser) => {
            currUser.getCachedDeviceKeyAndPassword();
            currUser.getDevice({
                onSuccess: function (result) {
                    logger.debug("This device is remembered")
                    return resolve(true)
                },
                onFailure: function (err) {
                    logger.debug("Device is not remembered")
                    return resolve(false)
                },
            });
        }).catch((error) => {
            logger.debug('The user is not authenticated by the error', error);
            return reject('The user is not authenticated');

        })

    })
}

export const handleRememberDevice = async (choice) => {
    logger.debug("User selected: ", choice)
    if (choice === false) {
        store.dispatch(setUserPrefRememberDevice(false));
        Hub.dispatch('RememberDevice', { state: true })
        return
    }
    let retries = 0;
    while (true) {
        try {
            await Auth.rememberDevice();
            logger.debug("RememberDevice call succeeded");
            Hub.dispatch('RememberDevice', { state: true })
            return;
        } catch (err) {
            if (err.code === "ResourceNotFoundException") {
                retries += 1;
                if (retries === 2) {
                    return;
                }
                logger.debug("It appears user device key has been removed from Cognito, " +
                        "will try again after clearing local cache")
                //     Device has most likey been removed from Cognito
                let authUser = await Auth.currentAuthenticatedUser();
                await authUser.clearCachedDeviceKeyAndPassword();
                Hub.dispatch('RememberDevice', { state: false })

            } else {
                logger.error("Error occurred while opting to remember device", err)
                return;
            }
        }
    }
}
