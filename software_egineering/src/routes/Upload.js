import "../styles/upload.css";

import { Link } from "react-router-dom";

import React, { useState } from "react";

export default function Upload() {
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());
  const [hashtags, setHashtags] = useState([""]);
  const [text, setText] = useState(""); // 텍스트 입력 상태 추가

  const onChangeMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      setUploadedMedia(file);
      setMediaType(fileType.startsWith("image/") ? "image" : "video");
    }
  };

  const onDeleteMedia = () => {
    setUploadedMedia(null);
    setMediaType("");
    setInputKey(Date.now());
  };

  const addHashtagField = () => {
    setHashtags([...hashtags, ""]);
  };

  const removeLastHashtagField = () => {
    setHashtags(hashtags.slice(0, -1));
  };

  const handleHashtagChange = (index, value) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleUpload = async () => {
    // 해시태그 배열에서 빈 문자열을 제거한 후 유효한 해시태그만 남깁니다.
    const validHashtags = hashtags.filter((tag) => tag.trim() !== "");

    // 업로드된 미디어, 텍스트, 해시태그 중 하나라도 없는 경우 경고를 표시합니다.
    if (!uploadedMedia || text.trim() === "" || validHashtags.length === 0) {
      alert(
        "업로드한 사진, 해시태그, 텍스트 중 하나라도 없으면 업로드가 안됩니다."
      );
      return; // 함수를 더 이상 진행하지 않고 종료합니다.
    }

    const formData = new FormData();
    formData.append("media", uploadedMedia);
    formData.append("text", text);
    validHashtags.forEach((tag, index) => {
      formData.append(`hashtags[${index}]`, tag);
    });

    try {
      const response = await fetch("YOUR_SERVER_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("업로드 성공!");
        // 성공 처리 (예: 폼 초기화, 성공 메시지 표시 등)
      } else {
        console.error("서버 에러");
        // 서버 에러 처리
      }
    } catch (error) {
      console.error("업로드 실패", error);
      // 네트워크 에러 처리
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-display">
        <input
          key={inputKey}
          type="file"
          accept="image/*,video/*"
          onChange={onChangeMedia}
          className="upload-picture"
        />
        {uploadedMedia && (
          <div className="media-preview">
            {mediaType === "image" ? (
              <img
                src={URL.createObjectURL(uploadedMedia)}
                alt="Preview"
                className="media-preview-image"
              />
            ) : (
              <video
                src={URL.createObjectURL(uploadedMedia)}
                controls
                className="media-preview-video"
              />
            )}
            <button onClick={onDeleteMedia} className="delete-button">
              삭제
            </button>
          </div>
        )}
        {hashtags.map((hashtag, index) => (
          <div key={index} className="hashtag-input-container">
            <input
              className="upload-hashtag"
              placeholder="hashtag"
              type="text"
              value={hashtag}
              onChange={(e) => handleHashtagChange(index, e.target.value)}
            />
          </div>
        ))}
        <div className="hashtag-buttons-container">
          <button onClick={addHashtagField} className="hashtag-button">
            추가
          </button>
          <button onClick={removeLastHashtagField} className="hashtag-button">
            최근 삭제
          </button>
        </div>
        <input
          className="upload-text"
          placeholder="text 설명"
          type="text"
          value={text}
          onChange={handleTextChange}
        />
        <button className="upload-button" onClick={handleUpload}>
          업로드
        </button>
        <Link to="/main">
          <button className="upload-button">취소</button>
        </Link>
      </div>
    </div>
  );
}
