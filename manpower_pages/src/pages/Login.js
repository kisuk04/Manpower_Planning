import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ใช้ไอคอนจาก react-icons
import '../components/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // สถานะสำหรับการแสดงรหัสผ่าน

  const handleSubmit = (event) => {
    event.preventDefault(); // ย้ายไว้ข้างบนเพื่อตรวจสอบก่อน
    console.log("Username: ", username);
    console.log("Password: ", password);

    // ส่งข้อมูลไปยัง backend (ตัวอย่าง)
    fetch('https://example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // ประมวลผลเมื่อ login สำเร็จ
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // เปลี่ยนเส้นทางไปยังหน้า General
    window.location.href = '/General';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type={showPassword ? 'text' : 'password'} // เปลี่ยนประเภท input ตามสถานะ
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)} // สลับการแสดงรหัสผ่าน
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* แสดงไอคอนที่เหมาะสม */}
            </span>
          </div>
          <div className="submit-button">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
