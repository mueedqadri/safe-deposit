import config from "../config";
import {toast} from "react-hot-toast";

const IS_IMAGE_VERIFIED = 'isImageVerified'

const basicHeaders = {
    'Content-Type': 'application/json'
}

export const fetchEncryptedAnswer = async (plainText, shiftKey) => {
    if (plainText) {
        try {
            const response = await fetch(config.LAMBDAS.CAESAR_CIPHER_API, {
                method: 'POST',
                headers: {
                    ...basicHeaders,
                },
                body: JSON.stringify({
                    "securityAnswer": plainText,
                    "type": "encrypt",
                    shiftKey,
                })
            })

            return response.json();
        } catch (err) {
            console.log(err)
        }
    }
}

export const getDecryptedSecurityAnswer = async (cipher, shiftKey) => {
    if (cipher) {
        try {
            const response = await fetch(config.LAMBDAS.CAESAR_CIPHER_API, {
                method: 'POST',
                headers: {
                    ...basicHeaders,
                },
                body: JSON.stringify({
                    "securityAnswer": cipher,
                    "type": "decrypt",
                    "shiftKey": shiftKey
                })
            })

            return response.json();
        } catch (err) {
            console.log(err)
        }
    }
}

export const saveEncryptedAnswer = async (email, cipher) => {
    if (email && cipher) {
        try {
            const response = await fetch(config.CLOUD_FUNCTIONS.SAVE_SECURITY_ANSWER_API, {
                method: 'POST',
                headers: basicHeaders,
                body: JSON.stringify({
                    "securityAnswer": cipher,
                    "email": email,
                    "securityQuestion": "What is Your Favorite Sports team?"
                })
            })

            return response.json();

        } catch (err) {
            console.log(err)
        }

    }
}

export const getBoxNumber = async (email) => {
    if (email) {
        try {
            const response = await fetch(`${config.LAMBDAS.DAL_SAFE_EXPRESS_API}/user/${email}/`, {
                Method: 'GET',
                headers: basicHeaders
            })

            return response.json();
        } catch (e) {
            console.log("Error occurred while fetch the box number for the user " + email)
        }
    } else {
        toast.error("Failed to get the user details from DynamoDB in getBoxNumber");
    }
}

export const loginUserToDynamoDB = async (email) => {
    try {
        if (email) {
            const response = await fetch(`${config.LAMBDAS.DAL_SAFE_EXPRESS_API}/user/login`, {
                method: 'POST',
                headers: basicHeaders,
                body: JSON.stringify({
                    email
                })
            });

            return response.json();
        }
    } catch (e) {
        console.log(e)
        toast.error("Failed to login the user in DynamoDB " + e);
    }
}

export const logoutUserFromDynamoDB = async (email) => {
    try {
        if (email) {
            console.log("Logging out the user from DynamoDB " + email)
            const response = await fetch(`${config.LAMBDAS.DAL_SAFE_EXPRESS_API}/user/logout`, {
                method: 'POST',
                headers: basicHeaders,
                body: JSON.stringify({
                    email
                })
            });
            console.log(response)
            return response.json();
        }
    } catch (error) {
        console.log(error);
    }

}

export const updateBalance = async (params) => {
    try {
        if (params) {
            const response = await fetch(`${config.LAMBDAS.DAL_SAFE_EXPRESS_API}/user/updateBalance/${params.email}`, {
                method: 'POST',
                headers: basicHeaders,
                body: JSON.stringify({
                    "type": params.type,
                    "newBalance": params.newBalance,
                    "actionAmount": params.actionAmount
                })
            });

            return response.json();
        }
    } catch (e) {
        console.log(e)
        toast.error("Failed to login the user in DynamoDB " + e);
    }
}

export const getEncryptedSecurityAnswer = async (email) => {
    try {

        const response = await fetch(config.CLOUD_FUNCTIONS.GET_SECURITY_ANSWER_API, {
                method: 'POST',
                headers: basicHeaders,
                body: JSON.stringify({
                    email
                })
            }
        )

        return response.json();

    } catch (e) {
        console.error(e);
        toast.error("Failed to get encrypted security answer from GCP" + e.message);
    }
}

export const authenticateUser = (data) => {
    if (window instanceof Object) {
        localStorage.setItem('item', JSON.stringify(data));
    }
}

export const isUserAuthenticated = () => {
    if (typeof window === undefined) {
        return false;
    }

    if (localStorage.getItem('item')) {
        return JSON.parse(localStorage.getItem('item'));
    }

    return false;
}

export const setImageVerified = () =>{
    localStorage.setItem(IS_IMAGE_VERIFIED, true)
}

export const isImageVerified = ()=>{
    return localStorage.getItem(IS_IMAGE_VERIFIED)
}

export const userLogout = async (email) => {
    if (window instanceof Object) {
        console.log("In user logout", email);
        await logoutUserFromDynamoDB(email);
        localStorage.clear();
    }
}