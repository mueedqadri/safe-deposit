import React, {useState} from 'react';
import {
    getDecryptedSecurityAnswer,
    isUserAuthenticated,
    userLogout
} from "./UserNetwork";
import BaseView from "../core/BaseView";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router";

function ThirdFactorPage() {
    const [thirdAnswer, setThirdAnswer] = useState("");
    const [count, setCount] = useState(3);
    const navigate = useNavigate()
    const user = isUserAuthenticated();

    function handleChange(event) {
        setThirdAnswer(event.target.value);
    }

    async function handleSubmit(e) {

        e.preventDefault();
        try {
            const response = await getDecryptedSecurityAnswer(thirdAnswer, user.shiftKey);

            if (response && response['answer'] === "abc") {
                // Success
                toast.success("Your 3FA is Completed Successfully");
                toast("Redirecting to Home Page");
                navigate("/");
            } else {

                // Retries!!
                if (count === 1) {
                    toast.error("Maximum Attempts Exceeded... Please try again after sometime...");
                    localStorage.clear();
                    await userLogout(user.email);
                    navigate("/login")
                } else {
                    let remAttempts = count - 1;
                    toast.error("Your 3FA is Failed and have now attempts: " + remAttempts);
                    setCount(remAttempts) && setThirdAnswer("");
                }
                
            }
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong");
        }

    }

    return (
        <BaseView titleString="3FA - Solve Challenge...!">
            <p>Remaining Attempts: {count}</p>
            <div className="col-md-6 offset-sm-3 text-left">
                <p className="lead text-center">Shift the
                    string <mark>abc</mark> by
                    shift key you
                    saved while registering!!
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">

                        <input
                            className="form-control"
                            type="3fa"
                            id="email-field"
                            name="3fa"
                            placeholder="Enter answer"
                            onChange={handleChange}
                            value={thirdAnswer}
                            required
                            minLength={0}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit"
                                className="btn btn-primary btn-block btn-md">
                            Verify
                        </button>
                    </div>
                </form>
            </div>

        </BaseView>
    );
}

export default ThirdFactorPage;