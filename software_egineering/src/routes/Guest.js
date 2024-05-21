import React, { useState } from "react";

import "../styles/guest.css";

export default function Guest() {
  const [search, setSearch] = useState("");

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
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
          <div className="main-user">User List</div>
          {/* User List를 받아서 대입 */}
          <div className="main-user-content">User가 들어갈 항목입니다.</div>
          <div className="main-user-content">User가 들어갈 항목입니다.</div>
        </div>
      </div>
    </div>
  );
}
