const AWS = require('aws-sdk')
const {v4: uuid} = require('uuid');
const {region, tables} = require('./config')
AWS.config.update({region})
const db = new AWS.DynamoDB();

const fetchBoxNumber = async (referenceId) => {
    const getParams = {
        TableName: tables.users,
        Key: {
            email: {S: referenceId}
        }
    }

    try {
        const results = await db.getItem(getParams).promise();
        if (Object.keys(results).length === 0 && Object.getPrototypeOf(results) === Object.prototype) {
            // First User after-all
            console.log(`Invalid Reference ID: Hey! We found no matches for given reference ID: ${referenceId}...So we assigned a new one though!`);
            return generateBoxNumber()
        } else {
            const referenceIdBoxNumber = results.Item.boxNumber.S;
            const filledSlots = await getCurrentSlotsForBoxNumber(referenceIdBoxNumber);
            let availableSlots = 3 - filledSlots;
            if (availableSlots !== 0) {
                console.log(`Yes! Slot is available for the given reference: ${referenceId} and 
        assigned to the same box number: ${referenceIdBoxNumber}`);
                return referenceIdBoxNumber;
            } else {
                const newBoxNumber = generateBoxNumber();
                console.log(`NO! Slot is available for the given reference ${referenceId} and we assigned a new box number ${newBoxNumber}`);
                return newBoxNumber;
            }
        }

    } catch (exception) {
        console.log("Exception.... occurred" + exception);
    }

}

const getCurrentSlotsForBoxNumber = async (boxNumber) => {

    try {
        const documentClient = new AWS.DynamoDB.DocumentClient();
        const getParams = {
            TableName: tables.users,
            FilterExpression: "#boxNumber = :value",
            ExpressionAttributeNames: {
                "#boxNumber": "boxNumber"
            },
            ExpressionAttributeValues: {
                ":value": boxNumber
            }
        }

        const data = await documentClient.scan(getParams).promise();
        // data object structure
        // {"Items":[{"lastLoginTime":"3/12/2021, 6:43:43 pm","email":"","boxNumber":"2"}],"Count":1,"ScannedCount":3}
        return data.Count;
    } catch (e) {
        console.log(`exception occurred in getCurrentSlotsForBoxNumber function: \n ${e}`)
    }


}

const saveBoxNumber = (boxNumber, email) => {

    console.log(`Saving the user with email ${email}  and box number ${boxNumber}`)
    const currentLocaleString = new Date().toLocaleString();
    const saveParams = {
        TableName: tables.users,
        Item: {
            email: {S: email},
            boxNumber: {S: boxNumber},
            lastLoginTime: {S: currentLocaleString}
        }
    }
    db.putItem(saveParams, (err, data) => {
        if (err) {
            console.log("Error Happened while saving the new user to DB!" + err)
        } else {
            console.log("Successfully saved User to DB!");
        }
    })

}

const generateBoxNumber = () => {
    return uuid();
}


module.exports = {fetchBoxNumber, saveBoxNumber, generateBoxNumber, getCurrentSlotsForBoxNumber}