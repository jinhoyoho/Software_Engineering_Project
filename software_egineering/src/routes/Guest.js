import React, { useState, useEffect } from "react";

import "../styles/guest.css";

export default function Guest() {
  const [userlist, setUserList] = useState([]);

  // UserList 핸들링
  const handleUserList = async () => {
    try {
      const response = await fetch("http://localhost:5000/userlists", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setUserList(data.userlist); // 서버로부터 data를 받아옴
      } else {
        console.error("Failed to fetch user:", response.statusText);
      }
    } catch (error) {
      console.error("UserList Error:", error);
    }
  };

  // 사용자 이름을 받음
  useEffect(() => {
    handleUserList(); // user list
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행되도록 함

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

  return (
    <div className="main-container">
      <div className="main-bar">
        <div className="main-logo-text">
          <div className="main-logo">Dongguk &nbsp;</div>
          <div className="main-logo-black">Stargram</div>
        </div>
        <div className="main-right-bar">
          <div className="main-username">Guest</div>

          <form className="button-style" onSubmit={handleLogout}>
            <button className="main-Logout">Logout</button>
          </form>
        </div>
      </div>

      <div className="main-display">
        <div className="main-content">
          <div className="main-post">Post</div>
          <p className="main-guest">로그인을 해야 이용할 수 있습니다.</p>
        </div>

        <div className="main-content">
          <div className="main-userlist-container">
            <div className="main-user">User List</div>
            {userlist.map((user, index) => (
              <div className="main-userlist">{user.username}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
