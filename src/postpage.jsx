import { React, useState } from "react";
import axios from "axios";

function Postpage({ imagePreview, handleModalClose,imageFile,resetImage }) {
  const [content, setContent] = useState("");

  const handleClick = (event) => {
    event.stopPropagation();
    handleModalClose(event);
  };

  const handleSubmit = async () => {
    if (!content) {
      alert("內容不可為空白");
      return;
    }

    let imagePath = null;
    if (imageFile) {
      // Upload image first
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile); // Append the image file
      try {
        const imageResponse = await axios.post("http://localhost:3000/upload", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data", // Specify that this is a form-data request
          },
        });
        imagePath = imageResponse.data.imagePath; // Assuming the server responds with the image URL
        if(imagePath){
          resetImage();
        }
      } catch (error) {
        if (error.response) {
          // 服务器返回了一个状态码，超出了2xx的范围
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          // 请求已经发出，但没有收到响应
          console.error("Error request:", error.request);
        } else {
          // 发生了其他错误
          console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
        return;
      }
    }

    const postFormData = new FormData();
    postFormData.append("content", content);
    if (imagePath) {
      postFormData.append("image", imagePath); // Append the image URL
    }

    try {
      const response = await axios.post("http://localhost:3000/posts",postFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify that this is a form-data request
        },
      });
      console.log("Post created:", response.data);
      // 清除內容和關閉模態框
      setContent("");
      handleModalClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="notlist2" onClick={handleClick}>
      <div className="post-container">
        <div className="post-header">建立新貼文</div>
        <div className="post">
          <div className="picture">
            <img src={imagePreview} alt="Preview"/>
          </div>
          <div className="text">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              type="text"
              className="type-in"
              placeholder="留下你想說的話..."
            />
            <div className="submit">
              <button className="btn btn-primary" onClick={handleSubmit}>
                提交
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Postpage;
