import React, { useEffect, useState } from "react";
import "../components/Approve.css";
import { Link } from 'react-router-dom';

const API_APPR = '/get_all_req';
const API_ADD = '/add_appr/';
const API_DEL = '/delete_req';

const Approve = () => {
  const [formData, setFormData] = useState({
    Request_ID: "",
    emp_ID: "",
    emp_Firstname: "",
    Request_Date: "",
    Department_Name: "",
    job_Name: "",
    Education_Level: "",
    Employment_Type: "",
    Desired_Date: "",
    Total_num_req: "",
    Num_Vacancies: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_APPR);
        if (response.ok) {
          const data = await response.json();
          // setFormData(data[0]); // กำหนดให้ใช้รายการแรกจากข้อมูลที่ได้รับ (ถ้ามีหลายรายการ)
          if (data.length > 0) {
            setFormData(data[0]);
          } else {
            setFormData(null);
          }
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleApprove = async () => {
    console.log('Approve button clicked');
    try {
      const response = await fetch(API_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Request_ID: formData.Request_ID,
          Emp_ID: formData.emp_ID,
        }),
      });

      if (response.ok) {
        window.alert('ทำการอนุมัติคำร้องขอเรียบร้อยแล้ว');
        const result = await response.json();
        console.log('Success:', result);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  // ฟังก์ชันจัดการการปฏิเสธ
  const handleReject = async () => {
    console.log('Reject button clicked'); // ตรวจสอบว่าฟังก์ชันทำงานหรือไม่
    try {
      const response = await fetch(`${API_DEL}/${formData.Request_ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.alert('ทำการปฏิเสธคำร้องขอเรียบร้อยแล้ว');
        const result = await response.json();
        console.log('Request deleted:', result);
        window.location.reload();
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const [hovered, setHovered] = useState(false);
  const [hoveredCancel, setHoveredCancel] = useState(false);

  return (
    <div className="general-container">

      <div className="navbar">
        <Link to="/General" >ข้อมูลคำร้อง</Link>
        <Link to="/Approve" className="active">การอนุมัติคำร้อง</Link>
        <Link to="/Administrator">Administrator</Link>
        <Link to="/Employee-Turnover-Rate">อัตราการเข้า-ออก</Link>
        <Link to="/Report">รายงาน</Link>
        <Link to="/">Log out</Link>
      </div>

      {formData ? (
        <form>
          <div className="form-row">
            <div className="form-section">
              <label>เลขที่ใบคำร้อง</label>
              <input
                type="text"
                name="Request_ID"
                value={formData.Request_ID}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-section">
              <label>วันที่บันทึกใบคำร้อง</label>
              <input
                type="date"
                name="Request_Date"
                value={formData.Request_Date}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-section">
              <label>รหัสพนักงานผู้บันทึก</label>
              <input
                type="text"
                name="emp_ID"
                value={formData.emp_ID}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-section">
              <label>ชื่อผู้บันทึก</label>
              <input
                type="text"
                name="emp_Firstname"
                value={formData.emp_Firstname}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-section">
              <label>แผนกที่ต้องการ</label>
              <input
                type="text"
                name="Department_Name"
                value={formData.Department_Name}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-section">
              <label>ชื่อตำแหน่ง</label>
              <input
                type="text"
                name="job_Name"
                value={formData.job_Name}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="form-row-date">
            <div className="form-section-date">
              <label>วันที่ต้องการ</label>
              <input
                type="date"
                name="Request_Date"
                value={formData.Request_Date}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label>ประเภทอัตราที่ร้องขอ</label>
              <input
                type="text"
                name="Employment_Type"
                value={formData.Employment_Type}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-section">
              <label>วุฒิการศึกษา</label>
              <input
                type="text"
                name="Education_Level"
                value={formData.Education_Level}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-section">
              <label>จำนวนคนที่ขาด</label>
              <input
                type="text"
                name="Num_Vacancies"
                value={formData.Num_Vacancies}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-section">
              <label>จำนวนคนที่ต้องการ</label>
              <input
                type="text"
                name="Total_num_req"
                value={formData.Total_num_req}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              style={{
                backgroundColor: hovered ? '#45a040' : '#4CAF70',
                color: '#fff',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleApprove} // เมื่อกดอนุมัติจะเรียกฟังก์ชัน handleApprove
            >
              อนุมัติ
            </button>

            <button
              type="button"
              style={{
                backgroundColor: hoveredCancel ? '#f9c2c2' : '#fff',
                color: '#ff0000',
                border: '2px solid #ff0000',
              }}
              onMouseEnter={() => setHoveredCancel(true)}
              onMouseLeave={() => setHoveredCancel(false)}
              onClick={handleReject} // เมื่อกดปฏิเสธจะเรียกฟังก์ชัน handleReject
            >
              ปฏิเสธ
            </button>
          </div>
        </form>
      ) : (
        <p>ไม่มีคำร้องขอในขณะนี้</p>
      )}
    </div>
  );
};

export default Approve;