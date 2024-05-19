import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/main.css";

import search_icon from "../icons/search_icon.png";

import Board from "../component/Board";

export default function Main() {
  const [search, setSearch] = useState("");

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="main-container">
      <div className="main-bar">
        <div className="main-logo-text">
          <div className="main-logo">Dongguk &nbsp;</div>
          <div className="main-logo-black">Stargram</div>
        </div>
        <div className="main-right-bar">
          {/* user를 서버로부터 받아서 대입 */}
          <div className="main-username">jinho</div>

          {/* 해당하는 user의 upload창으로 들어감 */}
          <Link to="/upload" className="button-style">
            <button className="main-upload">Upload</button>
          </Link>
          {/* 해당하는 user의 mail함으로 들어감 */}
          <Link to="/DirectMessage" className="button-style">
            <button className="main-DM">Direct Message</button>
          </Link>
          {/* 세션을 끊고 메인 화면으로 */}
          <Link to="/" className="button-style">
            <button className="main-Logout">Logout</button>
          </Link>
        </div>
      </div>

      <div className="main-display">
        <div className="main-content">
          <div className="main-post">Post</div>
          <div className="main-search">
            <input
              className="main-search-text"
              type="text"
              placeholder="keyword 검색"
              alue={search}
              onChange={onChangeSearch}
            ></input>
            <button className="search-keyword-button">
              <img src={search_icon} className="search-keyword-icon" />
            </button>
          </div>
          <Board></Board>
        </div>

        <div className="main-content">
          <div className="main-user">User List</div>
          {/* User List를 받아서 대입 */}
          <div className="main-user-content">User가 들어갈 항목입니다.</div>
          <div className="main-user-content">User가 들어갈 항목입니다.</div>
        </div>
      </div>
    </div>
  );
}
