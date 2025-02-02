import React, { useState } from "react";
import "../components/General.css";
import "../components/Navbar.css";
import { Link } from 'react-router-dom'; 

const API_URL = '/create_req/';


const General = () => {
  const [formData, setFormData] = useState({
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

  const [missingFields, setMissingFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);

    const requiredFields = [
      "emp_ID",
      "emp_Firstname",
      "Request_Date",
      "Department_Name",
      "Job_Name",
      "Education_Level",
      "Employment_Type",
      "Desired_Date",
      "Total_num_req",
      "Num_Vacancies",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length <= 0) {
      setMissingFields(emptyFields);
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // ถ้ากรอกครบ
    setMissingFields([]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text(); // หากไม่ใช่ JSON จะได้รับข้อความเป็น text
      }

      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ");
        console.log(result); 
        window.location.reload();
      } else {
        setMissingFields(emptyFields);
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        console.error(result);
      }

    } catch (error) {
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
      console.error("Error:", error);
    }
    

  };


  // ฟังก์ชันเพื่อตรวจสอบว่าฟิลด์นั้นขาดการกรอกหรือไม่
  const isFieldMissing = (fieldName) => missingFields.includes(fieldName);

  console.log(formData); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูลที่ส่ง

  return (

    <div className="general-container">

      <div className="navbar">
        <Link to="/General" className="active">ข้อมูลคำร้อง</Link>
        <Link to="/Approve">การอนุมัติคำร้อง</Link>
        <Link to="/Administrator">Administrator</Link>
        <Link to="/Employee-Turnover-Rate">อัตราการเข้า-ออก</Link>
        <Link to="/Report">รายงาน</Link>
        <Link to="/">Log out</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-section">
            <label>วันที่บันทึกใบคำร้อง</label>
            <input
              type="date"
              placeholder="กรอกวันที่บันทึกข้อมูล"
              name="Request_Date"
              value={formData.Request_Date}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("Request_Date") ? "red" : "" }}
            />
          </div>
          <div className="form-section"></div>
          <div className="form-section">
            <label>รหัสพนักงานผู้บันทึก</label>
            <input
              type="text"
              placeholder="กรอกรหัสพนักงานของผู้บันทึก"
              name="emp_ID"
              value={formData.emp_ID}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("emp_ID") ? "red" : "" }}
            />
          </div>
          <div className="form-section">
            <label>ชื่อผู้บันทึก</label>
            <input
              type="text"
              placeholder="ตย. สุชาติ"
              name="emp_Firstname"
              value={formData.emp_Firstname}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("emp_Firstname") ? "red" : "" }}
            />
          </div>
          <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} /> {/* เส้นกั้น */}

          <div className="form-section">
            <label>แผนกที่ต้องการ</label>
            <select
              name="Department_Name"
              value={formData.Department_Name}
              onChange={handleChange}
              className="dropdown-select"
              style={{ borderColor: isFieldMissing("Department_Name") ? "red" : "" }}
            >
              <option value="">เลือกแผนกที่ต้องการ</option>
              <option value="ฝ่ายบริหาร">ฝ่ายบริหาร</option>
              <option value="ฝ่ายทรัพยากรบุคคล">ฝ่ายทรัพยากรบุคคล</option>
              <option value="ฝ่ายการเงินและบัญชี">ฝ่ายการเงินและบัญชี</option>
              <option value="ฝ่ายการตลาด">ฝ่ายการตลาด</option>
              <option value="ฝ่ายไอที">ฝ่ายไอที</option>
              <option value="ฝ่ายขาย">ฝ่ายขาย</option>
              <option value="ฝ่ายผลิตภัณฑ์">ฝ่ายผลิตภัณฑ์</option>
            </select>
          </div>
          <div className="form-section">
            <label>ชื่อตำแหน่ง</label>
            <select
              name="job_Name"
              value={formData.job_Name}
              onChange={handleChange}
              className="dropdown-select"
              style={{ borderColor: isFieldMissing("job_Name") ? "red" : "" }}
            >
              <option value="">เลือกตำแหน่งที่ต้องการ</option>
              <option value="ประธานเจ้าหน้าที่บริหาร">ประธานเจ้าหน้าที่บริหาร</option>
              <option value="รองประธาน">รองประธาน</option>
              <option value="กรรมการบริษัท">กรรมการบริษัท</option>
              <option value="ผู้ช่วยผู้บริหาร">ผู้ช่วยผู้บริหาร</option>
              <option value="ผู้จัดการฝ่ายการเงิน">ผู้จัดการฝ่ายการเงิน</option>
              <option value="ผู้จัดการฝ่ายบัญชี">ผู้จัดการฝ่ายบัญชี</option>
              <option value="นักบัญชี">นักบัญชี</option>
              <option value="ผู้ตรวจสอบบัญชี">ผู้ตรวจสอบบัญชี</option>
              <option value="ผู้จัดการฝ่ายการตลาด">ผู้จัดการฝ่ายการตลาด</option>
              <option value="ตัวแทนฝ่ายการตลาด">ตัวแทนฝ่ายการตลาด</option>
              <option value="ผู้จัดการฝ่ายทรัพยากรบุคคล">
                ผู้จัดการฝ่ายทรัพยากรบุคคล
              </option>
              <option value="ตัวแทนฝ่ายทรัพยากรบุคคล">
                ตัวแทนฝ่ายทรัพยากรบุคคล
              </option>
              <option value="ผู้จัดการฝ่ายเทคโนโลยีสารสนเทศ">
                ผู้จัดการฝ่ายเทคโนโลยีสารสนเทศ
              </option>
              <option value="โปรแกรมเมอร์">โปรแกรมเมอร์</option>
              <option value="ผู้เชี่ยวชาญสนับสนุนด้าน IT">
                ผู้เชี่ยวชาญสนับสนุนด้าน IT
              </option>
              <option value="ผู้จัดการฝ่ายขาย">ผู้จัดการฝ่ายขาย</option>
              <option value="ตัวแทนฝ่ายขาย">ตัวแทนฝ่ายขาย</option>
              <option value="ผู้จัดการลูกค้า">ผู้จัดการลูกค้า</option>
              <option value="ผู้จัดการฝ่ายปฏิบัติการ">
                ผู้จัดการฝ่ายปฏิบัติการ
              </option>
              <option value="ผู้จัดการฝ่ายคลังสินค้า">
                ผู้จัดการฝ่ายคลังสินค้า
              </option>
              <option value="ผู้จัดการฝ่ายจัดซื้อ">ผู้จัดการฝ่ายจัดซื้อ</option>
              <option value="ผู้ประสานงานด้านโลจิสติกส์">
                ผู้ประสานงานด้านโลจิสติกส์
              </option>
              <option value="ผู้จัดการผลิตภัณฑ์">ผู้จัดการผลิตภัณฑ์</option>
              <option value="ผู้เชี่ยวชาญด้านประกันคุณภาพ">
                ผู้เชี่ยวชาญด้านประกันคุณภาพ
              </option>
            </select>
          </div>

          <div className="form-section"></div>
        </div>

        <div className="form-row-date">
          <div className="form-section-date">
            <label>วันที่ต้องการ</label>
            <input
              type="date"
              name="Desired_Date"
              value={formData.Desired_Date}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("Desired_Date") ? "red" : "" }}

            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>ประเภทอัตราที่ร้องขอ</label>
            <select
              name="Employment_Type"
              value={formData.Employment_Type}
              onChange={handleChange}
              className="dropdown-select"
              style={{ borderColor: isFieldMissing("Employment_Type") ? "red" : "" }}

            >
              <option value="">เลือกประเภทอัตราที่ร้องขอ</option>
              <option value="พนักงานประจำ">พนักงานประจำ</option>
              <option value="พนักงานชั่วคราว">พนักงานชั่วคราว</option>
            </select>
          </div>

          <div className="form-section">
            <label>วุฒิการศึกษา</label>
            <select
              name="Education_Level"
              value={formData.Education_Level}
              onChange={handleChange}
              className="dropdown-select"
              style={{ borderColor: isFieldMissing("Education_Level") ? "red" : "" }}

            >
              <option value="">เลือกวุฒิการศึกษา</option>
              <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
              <option value="ปวช">ปวช</option>
              <option value="ปวส">ปวส</option>
              <option value="ปริญญาตรี">ปริญญาตรี</option>
              <option value="ปริญญาโท">ปริญญาโท</option>
              <option value="ปริญญาเอก">ปริญญาเอก</option>
            </select>
          </div>

          <div className="form-section">
            <label>จำนวนคนที่ขาด</label>
            <input
              type="text"
              placeholder="กรอกจำนวนคนที่ขาด"
              name="Num_Vacancies"
              value={formData.Num_Vacancies}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("Num_Vacancies") ? "red" : "" }}

            />
          </div>

          <div className="form-section">
            <label>จำนวนคนที่ต้องการ</label>
            <input
              type="text"
              placeholder="กรอกจำนวนคนที่ต้องการ"
              name="Total_num_req"
              value={formData.Total_num_req}
              onChange={handleChange}
              style={{ borderColor: isFieldMissing("Total_num_req") ? "red" : "" }}

            />
          </div>
        </div>

        <div className="form-section">
          <button type="submit">บันทึก</button>
        </div>
      </form>
    </div>

  );

};

export default General;
