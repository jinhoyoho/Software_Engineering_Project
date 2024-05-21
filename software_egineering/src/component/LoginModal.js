import React, { useState } from "react";
import "../styles/loginmodal.css";

const LoginModal = () => {
  const [username, setID] = useState("");
  const [password, setPW] = useState("");

  const onChangeID = (event) => {
    setID(event.target.value);
  };

  const onChangePW = (event) => {
    setPW(event.target.value);
  };

  const clearInput = (type) => {
    if (type === "id") {
      setID("");
    } else if (type === "pw") {
      setPW("");
    }
  };

  return (
    <div className="id-container">
      <form
        className="id-box"
        action="http://localhost:5000/login"
        method="POST"
        enctype="multipart/form-data"
      >
        <div className="id-bold">로그인</div>

        <div className="id-input-container">
          <input
            className="id-input_text"
            type="text"
            placeholder="ID"
            value={username}
            onChange={onChangeID}
          />
          {username && (
            <button
              onClick={() => clearInput("id")}
              className="id-clear-button"
            >
              X
            </button>
          )}
        </div>
        <div className="id-input-container">
          <input
            className="id-input_text"
            type="password"
            placeholder="PW"
            value={password}
            onChange={onChangePW}
          />
          {password && (
            <button
              onClick={() => clearInput("pw")}
              className="id-clear-button"
            >
              X
            </button>
          )}
        </div>
        <div className="id-button-container">
          <button className="id-login-button">LOGIN</button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
