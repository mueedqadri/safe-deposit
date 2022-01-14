import React, { useEffect, useState, useRef } from "react";
import TypeMessage from "./Input";
import Transaction from "./Transaction";
import Message from "./Message";
import "bootstrap/dist/css/bootstrap.css";
import io from "socket.io-client";
import { isUserAuthenticated, isImageVerified } from "./UserNetwork";
import { Link, useNavigate } from "react-router-dom";

export default function Feed(props) {
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { boxNumber, email } = isUserAuthenticated();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_API}/getChat/${boxNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.allMessages.length > 0) {
          setMessages(data.allMessages);
        }
      });
      const newSocket = io(`${process.env.REACT_APP_BACKEND_API}`, {
        transports: ["websocket"],
      });
      newSocket.emit("create", boxNumber);

      newSocket.on("new message", messageListener);
      scrollToBottom()

      return () => newSocket.close();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const messageListener = (data) => {
    let tempMessages = messages;
    if (data && data.message) {
      tempMessages.push(JSON.parse(data.message));
      setMessages([...tempMessages]);
    }
  };

  if (isImageVerified()) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-sm ">
            <div className="card mt-5">
              <div className="card-body" style={{ height: "550px" }}>
                <Link to={"/"}>Go Home</Link>
                <h5 className="card-title">BOX: {boxNumber}</h5>
                <h6 className="card-subtitle mb-2 text-muted"></h6>
                <div className="overflow-auto" style={{ height: "350px" }}>
                  {messages
                    ? messages.map((data, idx) => {
                        return (
                          <Message
                            key={idx}
                            userId={data.userId}
                            message={data.message}
                          />
                        );
                      })
                    : null}
                  <div ref={messagesEndRef} />
                </div>
                <div className="container align-items-end">
                  <div>
                    <TypeMessage />
                    <Transaction />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm"></div>
        </div>
      </div>
    );
  } else {
    navigate("/upload");
    return <div></div>;
  }
}
