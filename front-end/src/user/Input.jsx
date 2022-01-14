import React, { useState, useEffect } from "react";

import {isUserAuthenticated} from "./UserNetwork";

export default function TypeMessage(props) {
  
  const { boxNumber, email } = isUserAuthenticated();
  const [currMessage, setCurrMessage] = useState("");

  const sendMessage = () => {
    let obj = {
      message: currMessage,
      userId: email,
      boxId: boxNumber,
    };
    var encodedKey = encodeURIComponent("payload");
    var encodedValue = encodeURIComponent(JSON.stringify(obj));
    var data = encodedKey + "=" + encodedValue;
    fetch(`${process.env.REACT_APP_BACKEND_API}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: data,
    });
    setCurrMessage("");
  };

  const onChange = (e) => {
    setCurrMessage(e.target.value);
  };

  return (
    <div className="input-group mb-3">
      <input
        onChange={onChange}
        value={currMessage}
        className="form-control"
        placeholder="Type..."
        aria-label="Type..."
        aria-describedby="basic-addon2"
      />
      <div className="input-group-append">
        <button
          onClick={sendMessage}
          className="btn btn-outline-secondary"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
