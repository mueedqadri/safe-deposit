import React, {useState} from 'react';
import BaseView from "../core/BaseView";
import {Navigate} from "react-router";
import {AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import {toast} from "react-hot-toast";
import {
    authenticateUser,
    getBoxNumber,
    getDecryptedSecurityAnswer,
    getEncryptedSecurityAnswer,
    loginUserToDynamoDB
} from "./UserNetwork";

function Login() {

    const [details, setDetails] = useState({
        email: "",
        password: "",
        userSecurityAnswer: "",
        isLoading: false,
        doRedirect: false
    });

    const {
        email,
        password,
        userSecurityAnswer,
        isLoading,
        doRedirect
    } = details;

    function submitHandler(event) {
        // Actions to be Happened after login...!
        event.preventDefault();

        setDetails({...details, isLoading: true})
        const loginUser = new CognitoUser({Username: email, Pool: UserPool})

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        const authenticationCallBacks = {
            onSuccess: async (data) => {
                toast.success("Your 1FA is successful")
                const user = {
                    name: data.idToken.payload.name,
                    phoneNumber: data.idToken.payload['phone_number'],
                    emailVerified: data.idToken.payload['email_verified'],
                    email: data.idToken.payload['email'],
                    shiftKey: data.idToken.payload['custom:shiftKey']
                }

                // Fetch the encrypted from GCP
                // Decrypt it from AWS
                const securityAnswerResponse = await getEncryptedSecurityAnswer(email);
                const decryptedSecurityAnswerResponse = await getDecryptedSecurityAnswer(securityAnswerResponse['body'], user['shiftKey']);
                const decryptedSecurityAnswer = decryptedSecurityAnswerResponse['answer'];

                // Check if the security answer matches with entry or not!
                if (decryptedSecurityAnswer.toLowerCase() !== userSecurityAnswer.toLowerCase()) {
                    toast.error("security Answer is Incorrect. Please enter correct details");
                    setDetails({...details, isLoading: false});
                    return;
                }

                // Login the user and Fetch the boxNumber from dal-safe-express Lambda
                if (user && user.email) {
                    await loginUserToDynamoDB(user.email);
                    const response = await getBoxNumber(user.email);
                    user['boxNumber'] = response['boxNumber'];
                    user['accountBalance'] = response['accountBalance'];
                }

                // Finally Store the user object to localstorage
                authenticateUser(user);
                toast.success(`Dear ${user.name}, your 2FA is successful!`);
                setDetails({...details, isLoading: false, doRedirect: true});
            },
            onFailure: (error) => {
                setDetails({
                    ...details,
                    isLoading: false,
                    password: '',
                    securityAnswer: ''
                })
                toast.error("Login Failed due to: " + error.message);
            },
            newPasswordRequired: (data) => {
                toast("Your password is expired, A new password will be required")
            }
        }

        loginUser.authenticateUser(authenticationDetails, authenticationCallBacks)


    }

    function changeHandler(event) {

        setDetails({...details, [event.target.name]: event.target.value})
    }

    const shouldRedirectHappen = () => {
        if (doRedirect) {
            return <Navigate to={'/3fa'}/>
        }
    }

    const loginForm = () => (
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="email-field">Email </label>
                        <input
                            className="form-control"
                            type="email"
                            id="email-field"
                            name="email"
                            onChange={changeHandler}
                            value={email}
                            required
                            minLength={2}
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-field">Password </label>
                        <input
                            className="form-control"
                            type="password"
                            id="password-field"
                            name="password"
                            onChange={changeHandler}
                            value={password}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="security-answer-field"> <b>Security
                            Question - </b> What is your favorite sports
                            team? </label>
                        <input
                            className="form-control"
                            type="password"
                            id="security-answer-field"
                            name="userSecurityAnswer"
                            onChange={changeHandler}
                            value={userSecurityAnswer}
                            required
                            minLength={2}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit"
                                className="btn btn-sm btn-block btn-primary mt-5">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    const loadingComponent = () => {
        return <div><h3 className={"text-primary"}>Logging....In.....</h3></div>
    }


    return (
        <BaseView titleString={"Doorway to safety"}
                  descriptionString={"Enter your credentials to login"}>
            {isLoading ? loadingComponent() : loginForm()}
            {shouldRedirectHappen()}
        </BaseView>
    );
}

export default Login;