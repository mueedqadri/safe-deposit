exports.handler = async (event, context, callback) => {

    const {generateBoxNumber, fetchBoxNumber, saveBoxNumber} = require('./logicManager');

    const {email, email_verified} = event.request.userAttributes;
    const referenceId = event.request.userAttributes['custom:reference-id'];
    console.log(event);
    console.log(referenceId);
    if (email && email_verified) {
        let boxNumber = "";
        if (referenceId === "NO") {
            // No reference Given,  Get a new box-number
            boxNumber = generateBoxNumber();
            console.log("No reference Given. So, assigned a fresh box number")
            saveBoxNumber(boxNumber, email);
        } else {
            fetchBoxNumber(referenceId).then(dbBoxNumber => {
                saveBoxNumber(dbBoxNumber, email);
            })
        }

        // give back to the Lambda
        callback(null, event)
    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("No email or user attributes found in the event object for lambda or email is not verified!!!");
        callback(null, event);
    }


};
