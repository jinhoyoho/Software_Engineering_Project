import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/main.css";

import search_icon from "../icons/search_icon.png";

import Board from "../component/Board";

export default function Main() {
  const [keyword, setSearch] = useState("");
  const [username, setUsername] = useState("");

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  // 사용자 이름을 받음
  useEffect(() => {
    const handleUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/user", {
          method: "GET",
        });
        const data = await response.json();
        // username을 상태에 저장하거나 다른 로직을 실행
        setUsername(data.username);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    handleUser();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행되도록 함

  // 업로드 핸들링
  const handleUpload = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/go_upload", {
      method: "POST",
    })
      .then((response) => response.json()) // 응답 객체를 JSON 형식으로 파싱
      .then((data) => {
        if (data.redirect_url) {
          window.location.href = data.redirect_url; // 클라이언트 사이드에서 리디렉션 처리
        }
      })
      .catch((error) => {
        console.error("Error:", error); // 에러 처리
      });
  };

  // dm 핸들링
  const handleDM = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/go_dm", {
      method: "POST",
    })
      .then((response) => response.json()) // 응답 객체를 JSON 형식으로 파싱
      .then((data) => {
        if (data.redirect_url) {
          window.location.href = data.redirect_url; // 클라이언트 사이드에서 리디렉션 처리
        }
      })
      .catch((error) => {
        console.error("Error:", error); // 에러 처리
      });
  };

  // 로그아웃
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/logout", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);

      if (data.redirect_url) {
        window.location.href = data.redirect_url; // 클라이언트 사이드에서 리디렉션 처리
      }
    }
  };

  // 키워드 핸들링
  const handleKeyword = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword: keyword }),
    })
      .then((response) => response.json()) // 응답 객체를 JSON 형식으로 파싱
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error:", error); // 에러 처리
      });
  };

  return (
    <div className="main-container">
      <div className="main-bar">
        <div className="main-logo-text">
          <div className="main-logo">Dongguk &nbsp;</div>
          <div className="main-logo-black">Stargram</div>
        </div>
        <div className="main-right-bar">
          <div className="main-username">{username}</div>

          <form onSubmit={handleUpload} className="button-style">
            <button className="main-upload">Upload</button>
          </form>

          {/* 해당하는 user의 mail함으로 들어감 */}
          <form onSubmit={handleDM} className="button-style">
            <button className="main-DM">Direct Message</button>
          </form>

          <form onSubmit={handleLogout} className="button-style">
            <button className="main-Logout">Logout</button>
          </form>
        </div>
      </div>

      <div className="main-display">
        <div className="main-content">
          <div className="main-post">Post</div>
          <div className="main-search">
            <form className="button-style" onSubmit={handleKeyword}>
              <input
                className="main-search-text"
                type="text"
                placeholder="keyword 검색"
                value={keyword}
                onChange={onChangeSearch}
              ></input>

              <button className="search-keyword-button">
                <img src={search_icon} className="search-keyword-icon" />
              </button>
            </form>
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
