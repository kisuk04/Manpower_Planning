import React, { useState } from 'react';
import {
  BarChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, ScatterChart, Scatter
} from 'recharts';
import '../components/Report.css'; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง
import '../components/Navbar.css'; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง
import { Link } from 'react-router-dom';


// Data สำหรับ Pie Chart
const pieData = [
  { plan: 'Complete', value: 70 }, // 70% ดำเนินการแล้ว
  { plan: 'Incomplete', value: 30 }, // 30% ยังไม่ดำเนินการ
];

const COLORS = ['#84a9db', '#fae39e']; // กำหนดสีสำหรับแต่ละส่วน
// Data สำหรับ Scatter Chart
const scatterData = [
  { vacancies: 35, quarter: 1 },  // ไตรมาส 1: การจ้างงานใหม่ 300 คน, อัตราการลาออก 50 คน
  { vacancies: 25, quarter: 2 },  // ไตรมาส 2: การจ้างงานใหม่ 175 คน, อัตราการลาออก 30 คน
  { vacancies: 20, quarter: 3 },   // ไตรมาส 3: การจ้างงานใหม่ 95 คน, อัตราการลาออก 21 คน
  { vacancies: 15, quarter: 4 },    // ไตรมาส 4: การจ้างงานใหม่ 50 คน, อัตราการลาออก 5 คน
  { vacancies: null, quarter: 5 },
];
const barData = [
  { month: 'สิงหาคม', employees: 60, new_hires: 15, resignation: 5 }, // ข้อมูลปี 2021
  { month: 'กันยายน', employees: 70, new_hires: 20, resignation: 10 }, // ข้อมูลปี 2022
  { month: 'ตุลาคม', employees: 75, new_hires: 25, resignation: 12 }, // ข้อมูลปี 2023
];
const lineData = [
  { department: 'บริหาร', vacancies: 2, employees: 2 },
  { department: 'ทรัพยากรบุคคล', vacancies: 2, employees: 2 },
  { department: 'การเงินและบัญชี', vacancies: 2, employees: 6 },
  { department: 'การตลาด', vacancies: 2, employees: 13 },
  { department: 'ไอที', vacancies: 2, employees: 5 },
  { department: 'ปฏิบัติการ', vacancies: 10, employees: 42 },
  { department: 'ขาย', vacancies: 35, employees: 62 },
  { department: 'ผลิตภัณฑ์', vacancies: 12, employees: 48 },
];

// Header Component
function Header({ OpenSidebar }) {
  return (
    <header className='header'>
      {/* Your header content here */}
    </header>
  );
}

// Home Component (Main Content)
function Home() {


  // Getting current date
  const today = new Date();
  const dateString = today.toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className='main-container'>
      <div className="navbar">
        <Link to="/General" >ข้อมูลคำร้อง</Link>
        <Link to="/Approve">การอนุมัติคำร้อง</Link>
        <Link to="/Administrator">Administrator</Link>
        <Link to="/Employee-Turnover-Rate">อัตราการเข้า-ออก</Link>
        <Link to="/Report" className="active">รายงาน</Link>
        <Link to="/">Log out</Link>
      </div>

      <div className='main-title' style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginTop: '0' }}>RP005</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: '0 10px 0 0' }}>{dateString}</h3> {/* แสดงวันที่ */}
          <button className="btn btn-primary" onClick={() => window.print()}>
            พิมพ์รายงาน
          </button>
        </div>
      </div>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>จำนวนพนักงานทั้งหมด</h3>
          </div>
          <h1>70</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>จำนวนตำแหน่งว่างทั้งหมด</h3>
          </div>
          <h1>30</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>อัตราการจ้างงานใหม่ </h3>
          </div>
          <h1>20%</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>อัตราการลาออก</h3>
          </div>
          <h1>10%</h1>
        </div>
      </div>
      <div className='charts'>
        <div className='chart-row'>
          <div className='chart-container'>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>

            </ResponsiveContainer>
            <h4 style={{ textAlign: 'center' }}> Pie Chart : สัดส่วนแผนกำลังคนที่ดำเนินการไปแล้ว</h4>
          </div>

          <div className='chart-container'>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'เดือน', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'จำนวน (คน)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="new_hires" name="การจ้างงานใหม่ " fill="#84a9db" />
                <Bar dataKey="resignation" name="การลาออก" fill="#fae39e" />
              </BarChart>
            </ResponsiveContainer>
            <h4 style={{ textAlign: 'center' }}> Bar Chart : จำนวนการจ้างงานใหม่ - ลาออกของพนักงานแบบรายเดือน </h4>
          </div>
        </div>

        <div className='chart-row'>
          <div className='chart-container'>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" label={{ value: 'แผนก', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'จำนวน (คน)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vacancies" name="จำนวนแผนกที่ว่าง" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="employees" name="จำนวนพนักงานปัจจุบัน" stroke="#fae39e" />
              </LineChart>
            </ResponsiveContainer>
            <h4 style={{ textAlign: 'center' }}> Line Chart : จำนวนแผนกที่ว่างและพนักงานในแผนกปัจจุบัน</h4>
          </div>

          <div className='chart-container'>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="vacancies" name="ตําแหน่งว่าง" label={{ value: 'ตำแหน่งว่าง', position: 'insideBottom', offset: -5 }} />
                <YAxis type="number" dataKey="quarter" name="ไตรมาส" label={{ value: 'ไตรมาส', angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="ข้อมูลการจ้างงานใหม่และการลาออก" data={scatterData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
            <h4 style={{ textAlign: 'center' }}>Scatter Chart : จำนวนตำแหน่งว่างรายไตรมาส</h4>
          </div>
        </div>
      </div>
    </main >
  );
}

// Main App Component
function Report() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='report-container'>
      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
        <Home />
      </div>
    </div>
  );
}

export default Report;
