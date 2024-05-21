import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/reply.css";

export default function Reply() {
  return (
    <div className="reply-container">
      <div className="reply-display">
        <div className="reply-user">DM List</div>
        <textarea
          type="text"
          className="reply-reply"
          placeholder="내용을 입력하세요."
        ></textarea>
        <div className="reply-button-container">
          <Link to="/DirectMessage">
            <button className="reply-button">보내기</button>
          </Link>
          <Link to="/DirectMessage">
            <button className="reply-button">이전으로</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
