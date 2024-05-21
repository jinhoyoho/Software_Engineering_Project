import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/mail.css";

export default function Mail() {
  return (
    <div className="DM-container">
      <div className="DM-display">
        <div className="DM-content">
          <div className="DM-user">DM List</div>
          {/* User List를 받아서 대입 */}
          <div className="DM-user-content">User가 들어갈 항목입니다.</div>
          <div className="DM-user-content">User가 들어갈 항목입니다.</div>
        </div>
        <div className="DM-content">
          <div className="DM-post">내용</div>
          <div className="DM-user-content">DM의 내용입니다</div>
          <Link to="/reply">
            <button className="DM-button">답장하기</button>
          </Link>
          <Link to="/main">
            <button className="DM-button">메인으로</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
