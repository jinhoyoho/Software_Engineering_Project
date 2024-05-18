import React, { useState } from "react";
import "../styles/loginmodal.css";

const LoginModal = () => {
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");

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
      <div className="id-box">
        <div className="id-bold">로그인</div>

        <div className="id-input-container">
          <input
            className="id-input_text"
            type="text"
            placeholder="ID"
            value={id}
            onChange={onChangeID}
          />
          {id && (
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
            value={pw}
            onChange={onChangePW}
          />
          {pw && (
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
      </div>
    </div>
  );
};

export default LoginModal;
