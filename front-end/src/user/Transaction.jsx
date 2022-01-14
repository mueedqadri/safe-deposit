import React, {useEffect, useState} from "react";
import {getBoxNumber, isUserAuthenticated, updateBalance} from "./UserNetwork";
import {toast} from "react-hot-toast";

export default function Transaction(props) {

    const {email} = isUserAuthenticated();
    const [actionAmount, setActionAmount] = useState('0');
    const [accountBalanceDB, setAccountBalanceDB] = useState("")

    useEffect(() => {
        getBoxNumber(email).then((response) => {
            console.log("Network calling")
            setAccountBalanceDB(response.accountBalance)
        })

    }, [])
    const handleTransaction = async (event) => {
        const type = event.currentTarget.getAttribute("data-id");
        const currentBalanceInFloat = parseFloat(accountBalanceDB);
        const actionAmountInFloat = parseFloat(actionAmount);
        let newBalance = 0;

        if (type === "credit") {
            newBalance = (currentBalanceInFloat + actionAmountInFloat) || currentBalanceInFloat;
        } else if (type === "debit") {
            newBalance = (currentBalanceInFloat - actionAmountInFloat) || currentBalanceInFloat;
        }

        const params = {
            email,
            type,
            newBalance, actionAmount
        }
        const response = await updateBalance(params);
        if (response.operation === 'success' && type === "credit") {
            toast.success("Successfully added Amount to your account");
            setActionAmount("");
            setAccountBalanceDB(newBalance.toString());
        } else if (response.operation === 'success' && type === 'debit') {
            toast.success("Successfully debited Amount from your account");
            setActionAmount("");
            setAccountBalanceDB(newBalance.toString());
        } else {
            toast.error("Something went wrong with your Transaction")
            setActionAmount("");
        }
    };


    const onChange = (e) => {
        let pattern = /^\d+$/;
        if (pattern.test(e.target.value) || e.target.value == '') {
            setActionAmount(e.target.value);
        }

    };

    return (
        <div className="mt-4">
            <p className="lead text-center">Current
                Balance: {accountBalanceDB}</p>
            <div className="input-group mb-3">
                <input
                    onChange={onChange}
                    value={actionAmount}
                    className="form-control"
                    placeholder={actionAmount}
                    aria-label={actionAmount}
                    aria-describedby="basic-addon2"
                    minLength={"0"}
                />
                <div className="input-group-append">
                    <button
                        onClick={handleTransaction}
                        data-id={"credit"}
                        className="btn btn-success"
                        type="button"

                    >
                        Add
                    </button>
                    <button
                        onClick={handleTransaction}
                        className="btn btn-danger"
                        type="button"
                        data-id={"debit"}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    )
        ;
}
