import React, {useState} from 'react';
import {toast} from "react-hot-toast";
import {Navigate} from "react-router-dom";
import BaseView from "../core/BaseView";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import {fetchEncryptedAnswer, saveEncryptedAnswer} from "./UserNetwork";
import UserPool from "./UserPool";

function Register() {

    // User State
    const [userValues, setUserValues] = useState({
        name: "",
        email: "",
        gender: "male",
        password: "",
        confirmPassword: "",
        phone: "",
        securityAnswer: "",
        referenceId: "",
        shiftKey: "2",
        success: false,
        error: false
    });
    const [errorMessage, setErrorMessage] = useState("");
    const {
        name,
        email,
        gender,
        password,
        confirmPassword,
        phone,
        securityAnswer,
        referenceId,
        shiftKey,
        error,
        success
    } = userValues

    // invoked after user hits submit
    async function submitHandler(event) {
        event.preventDefault();


        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                toast.error("Password and Confirm Password doesn't match...");
                setUserValues({
                    ...userValues,
                    password: "",
                    confirmPassword: "",
                    error: true
                });
                return;
            }
            // Check for same email for reference
            if (email === referenceId) {
                toast.error("Email and Reference cannot be same");
                setUserValues({...userValues, referenceId: ""});
                return;
            }

            const fetchResponse = await fetchEncryptedAnswer(securityAnswer, shiftKey);
            const cipher = fetchResponse['answer'];


            const saveResponse = await saveEncryptedAnswer(email, cipher);
            const saveStatus = saveResponse['body'] === "success"

            if (!saveStatus) {
                toast.error("Internal Error while saving the details");
                return;
            }

            // Make API call to AWS Cognito
            UserPool.signUp(email, password, getAttributesArray(), null, (err, result) => {
                if (err) {
                    console.log(err)
                    setUserValues({...userValues, success: false, error: true});
                    setErrorMessage(err.message || err || JSON.stringify(err))
                    toast.error(err.message)
                    toast.error("Something Happened while registering....");
                    return;
                } else {
                    const cognitoUser = result.user;
                    let message = "Dear " + cognitoUser.getUsername().toString() + ", your registration is done"
                    toast.success(message);
                    toast.success("Check your email and confirm the registration!!!")
                    toast.success("You will be redirected to Login Page");
                    setUserValues({...userValues, success: true, error: false})
                }
            })
        } catch (e) {
            toast.error("An error occurred While registering the user" + e.message);
            console.log(e);
        }

    }

    // Build and return user attributes!
    const getAttributesArray = () => {
        // Set the attribute list!
        const dataName = {Name: 'name', Value: name}
        const dataGender = {Name: 'gender', Value: gender}
        const dataPhone = {Name: "phone_number", Value: "+1" + phone}
        const dataReferenceId = {
            Name: "custom:reference-id",
            Value: referenceId.length > 0 ? referenceId : "NO"
        }
        const dataShiftKey = {
            Name: "custom:shiftKey",
            Value: shiftKey > 0 ? shiftKey : 2
        }

        const attributeName = new CognitoUserAttribute(dataName)
        const attributeGender = new CognitoUserAttribute(dataGender);
        const attributePhone = new CognitoUserAttribute(dataPhone);
        const attributeReferenceId = new CognitoUserAttribute(dataReferenceId);
        const attributeDataShiftKey = new CognitoUserAttribute(dataShiftKey);

        const userAttributesArray = []
        userAttributesArray.push(attributeName);
        userAttributesArray.push(attributeGender);
        userAttributesArray.push(attributePhone);
        userAttributesArray.push(attributeReferenceId);
        userAttributesArray.push(attributeDataShiftKey);

        return userAttributesArray;
    }

    const changeHandler = (event) => {
        setUserValues(
            {
                ...userValues,
                [event.target.name]: event.target.value
            }
        )
    }

    const successRedirection = () => {
        if (error === false && success === true) {
            return <Navigate to={"/login"}/>
        }
    }

    const registrationForm = () => (
        <div className={"row"}>
            <div className={"col-md-6 offset-sm-3 text-left"}>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="name-field">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            id="name-field"
                            name="name"
                            value={name}
                            onChange={changeHandler}
                            required
                            minLength={1}
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-field">Email ID</label>
                        <input
                            className="form-control"
                            type="email"
                            id="email-field"
                            name="email"
                            value={email}
                            placeholder="Use it for login"
                            onChange={changeHandler}
                            required
                            minLength={1}
                            maxLength={50}
                        />
                    </div>
                    Gender
                    <div className="form-group">
                        <div className={"form-check form-check-inline"}>
                            <input
                                className="form-check-input"
                                type="radio"
                                id="gender-field-male"
                                name="gender"
                                value="male"
                                onChange={changeHandler}
                                defaultChecked={gender === "male"}
                            />
                            <label className={"form-check-label"}
                                   htmlFor="gender-field-male">Male</label>
                        </div>
                        <div className={"form-check form-check-inline"}>
                            <input
                                className="form-check-input"
                                type="radio"
                                id="gender-field-female"
                                name="gender"
                                value="female"
                                onChange={changeHandler}
                            />
                            <label className={"form-check-label"}
                                   htmlFor="gender-field-female">Female</label>
                        </div>
                        <div className={"form-check form-check-inline"}>
                            <input
                                className="form-check-input"
                                type="radio"
                                id="gender-field-others"
                                name="gender"
                                value="others"
                                onChange={changeHandler}
                            />
                            <label className={"form-check-label"}
                                   htmlFor="gender-field-others">Others</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-field">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            id="password-field"
                            name="password"
                            value={password}
                            onChange={changeHandler}
                            required
                            minLength={8}
                            maxLength={40}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password-field">Re-Enter
                            Password</label>
                        <input
                            className="form-control"
                            type="password"
                            id="confirm-password-field"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={changeHandler}
                            required
                            minLength={8}
                            maxLength={40}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone-field">Phone</label>
                        <input
                            className="form-control"
                            type="text"
                            id="phone-field"
                            name="phone"
                            value={phone}
                            onChange={changeHandler}
                            required
                            minLength={10}
                            maxLength={10}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="security-answer-field">
                            <strong> Security Question - </strong> What is Your
                            Favorite
                            Sports
                            team?</label>
                        <input
                            className="form-control"
                            type="text"
                            id="security-answer-field"
                            name="securityAnswer"
                            value={securityAnswer}
                            onChange={changeHandler}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reference-id-field"> Reference
                            ID</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter your friend's reference or Leave it blank"
                            id="reference-id-field"
                            name="referenceId"
                            value={referenceId}
                            onChange={changeHandler}
                            minLength={3}
                        />
                    </div>


                    <div className="form-group">
                        <div>
                            <label htmlFor="shiftKey-field"> Shift Key (Used for
                                Challenges) &nbsp;</label>
                            <span
                                className="badge badge-warning">Save it somewhere</span>
                        </div>

                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Key in range of (0-9)"
                            id="shiftKey-field"
                            name="shiftKey"
                            value={shiftKey}
                            onChange={changeHandler}
                            minLength={1}
                            maxLength={10}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit"
                                className="btn btn-block btn-sm btn-primary mt-4">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const displayErrorMessage = () => {
        if (error && errorMessage.length > 0) {
            return (
                <div>
                    <div
                        className="alert alert-danger alert-dismissible fade show"
                        role="alert">
                        {errorMessage}
                        <button type="button" className="close"
                                data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            )
        }
    }


    return (
        <BaseView titleString={"Welcome to Dal Safe Registration Page"}
                  descriptionString={"Please enter your details in below form to register"}>
            <div>
                <div>
                    {displayErrorMessage()}
                    {registrationForm()}
                    {successRedirection()}
                </div>
            </div>
        </BaseView>
    );
}

export default Register;