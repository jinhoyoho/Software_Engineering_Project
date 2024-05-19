import React from "react";
import { Link } from "react-router-dom";

import option_icon from "../icons/option_icon.png";

import "../styles/board.css";

export default function Board() {
  return (
    <>
      <div className="main-board-container">
        <div className="main-board-bar">
          {/* 게시글 올린 유저 */}
          <div className="main-user-name">jinho</div>

          {/* 본인이라면 */}
          <button className="main-option-button">
            <img src={option_icon} className="main-option-icon" />
          </button>
        </div>
        <div className="main-board-picture">사진이 들어가는 곳 입니다.</div>
        <div className="main-board-hashtag">hashtag가 들어가는 곳 입니다.</div>
        <div className="main-board-text">text가 들어가는 곳 입니다.</div>
      </div>

      <div className="main-board-container">
        <div className="main-board-bar">
          {/* 게시글 올린 유저 */}
          <div className="main-user-name">Junsik</div>

          {/* 본인이 아니라면 */}
          <Link to="/DirectMessage" className="button-style">
            <button className="main-DM-button"> Direct Message</button>
          </Link>
        </div>
        <div className="main-board-picture">사진이 들어가는 곳 입니다.</div>
        <div className="main-board-hashtag">hashtag가 들어가는 곳 입니다.</div>
        <div className="main-board-text">text가 들어가는 곳 입니다.</div>
      </div>
    </>
  );
}
