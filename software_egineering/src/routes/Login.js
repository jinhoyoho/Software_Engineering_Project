import React, { useState } from "react";

import "../styles/login.css";

import LoginModal from "../component/LoginModal";
import SignUpModal from "../component/SignUpModal";

export default function Login() {
  const [isIDOpen, setIDOpen] = useState(false);
  const [isSignOpen, setSignOpen] = useState(false);

  const openIDModal = () => {
    setIDOpen(!isIDOpen);
  };

  const openSignModal = () => {
    setSignOpen(!isSignOpen);
  };

  return (
    <>
      <div className="login-main">
        <div className="login-container">
          <p className="login-text">
            <span className="login-orange">Dongguk &nbsp;</span>
            <span className="login-black">Stargram</span>
          </p>
          <div className="login-button">
            <button
              className="login-button-text"
              onClick={() => openIDModal(true)}
            >
              로그인
            </button>
            <button
              className="login-button-text"
              onClick={() => openSignModal(true)}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      <div className="ModalContainer">
        {isIDOpen && (
          <div>
            <div className="ModalBackdrop" onClick={openIDModal}>
              <div onClick={(e) => e.stopPropagation()}>
                <LoginModal></LoginModal>
              </div>
            </div>
          </div>
        )}
        {isSignOpen && (
          <div>
            <div className="ModalBackdrop" onClick={openSignModal}>
              <div onClick={(e) => e.stopPropagation()}>
                <SignUpModal></SignUpModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
