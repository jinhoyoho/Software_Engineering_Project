import React, { useState } from "react";
import axios from "axios";

import "../styles/signupmodal.css";

const PasswordModal = () => {
  const [username, setID] = useState("");
  const [password, setnewPW] = useState("");
  const [password_confirm, setcheckPW] = useState("");

  const onChangeOriPW = (event) => {
    setID(event.target.value);
  };

  const onChangeNewPW = (event) => {
    setnewPW(event.target.value);
  };
  const onChangeCheckPW = (event) => {
    setcheckPW(event.target.value);
  };

  return (
    <div className="sign-container">
      <div className="sign-box">
        <div className="sign-bold">회원 가입</div>
        <form
          className="sign-box"
          action="http://localhost:5000/signup"
          method="POST"
          enctype="multipart/form-data"
        >
          <div className="sign-input-container">
            <input
              className="sign-input_text"
              type="text"
              placeholder="ID"
              value={username}
              onChange={onChangeOriPW}
            />
          </div>
          <div className="sign-input-container">
            <input
              className="sign-input_text"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={onChangeNewPW}
            />
          </div>
          <div className="sign-input-container">
            <input
              className="sign-input_text"
              type="password"
              placeholder="비밀번호 확인"
              value={password_confirm}
              onChange={onChangeCheckPW}
            />
          </div>

          <div className="sign-confirm-container">
            <button className="sign-confirm-button">확 인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
