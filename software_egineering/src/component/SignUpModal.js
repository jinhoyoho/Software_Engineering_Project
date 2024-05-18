import React, { useState } from "react";

import "../styles/signupmodal.css";

const PasswordModal = () => {
  const [id, setID] = useState("");
  const [new_pw, setnewPW] = useState("");
  const [check_pw, setcheckPW] = useState("");

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
        <div className="sign-input-container">
          <input
            className="sign-input_text"
            type="text"
            placeholder="ID"
            value={id}
            onChange={onChangeOriPW}
          />
        </div>
        <div className="sign-input-container">
          <input
            className="sign-input_text"
            type="password"
            placeholder="비밀번호"
            value={new_pw}
            onChange={onChangeNewPW}
          />
        </div>
        <div className="sign-input-container">
          <input
            className="sign-input_text"
            type="password"
            placeholder="비밀번호 확인"
            value={check_pw}
            onChange={onChangeCheckPW}
          />
        </div>
        <div className="sign-confirm-container">
          <button className="sign-confirm-button">확 인</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
