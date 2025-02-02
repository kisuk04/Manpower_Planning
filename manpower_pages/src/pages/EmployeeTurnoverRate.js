import React, { useState } from 'react';
import '../components/EmployeeTurnoverRate.css';
import { Link } from 'react-router-dom';

const API_JOB = '/add_jobhis';
const API_DEL = '/delete_jobhis/{emp_ID}';
const API_UP = '/update_jobhis/{emp_ID}';

const EmployeeTurnoverRate = () => {
    const [employees, setEmployees] = useState(() => {
        const savedEmployees = localStorage.getItem('employees');
        return savedEmployees ? JSON.parse(savedEmployees).map(employee => ({ ...employee, showPassword: false })) : [];
    });

    const [newEmployee, setNewEmployee] = useState({
        emp_ID: '',
        emp_Firstname: '',
        emp_Lastname: '',
        department_Name: '',
        job_Name: '',
        startDate: '',
        endDate: '',
    });

    const [addingNewEmployee, setAddingNewEmployee] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAddEmployee = () => {
        setAddingNewEmployee(true);
    };

    const handleSaveEmployee = async () => {
        const { emp_ID, emp_Firstname, emp_Lastname, department_Name, job_Name, startDate, endDate } = newEmployee;

        if (!emp_ID || !emp_Firstname || !emp_Lastname || !department_Name || !job_Name || !startDate) {
            alert('คุณยังกรอกข้อมูลไม่ครบ');
            return;
        }

        const finalEndDate = endDate || null;

        const response = await fetch(API_JOB, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...newEmployee, endDate: finalEndDate }),
        });

        if (response.ok) {
            const jobhis = await response.json();
            const updatedEmployees = [...employees,
            {
                ...newEmployee, id: jobhis.User.id
            }];
            setEmployees(updatedEmployees);
            localStorage.setItem('employees', JSON.stringify(updatedEmployees));
            setNewEmployee({
                emp_ID: '',
                emp_Firstname: '',
                emp_Lastname: '',
                department_Name: '',
                job_Name: '',
                startDate: '',
                endDate: ''
            });
            setAddingNewEmployee(false);
            alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        } else {
            const errorResponse = await response.json();
            alert('ไม่สามารถบันทึกข้อมูลได้: ' + (errorResponse.detail ? errorResponse.detail.join(", ") : "Unknown error"));
        }
    };

    const handleDeleteEmployee = async (id) => {
        const employeeToDelete = employees.find(employee => employee.id === id);
        if (!employeeToDelete) {
            return;
        }

        const confirmDelete = window.confirm(`คุณต้องการลบผู้ใช้ ${employeeToDelete.employeeId} หรือไม่?`);

        if (confirmDelete) {

            try {
                const response = await fetch(API_DEL.replace('{emp_ID}', employeeToDelete.emp_ID), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถลบผู้ใช้ได้');
                }


            const updatedEmployees = employees.filter(employee => employee.id !== id);
            setEmployees(updatedEmployees);
            localStorage.setItem('employees', JSON.stringify(updatedEmployees));
            window.alert('ลบผู้ใช้เรียบร้อยแล้ว');
        } catch (error) {
            alert(error.message);
        }
    }
};

    const handleEditEmployee = (id) => {
        setEditingEmployeeId(id);
        const employeeToEdit = employees.find(employee => employee.id === id);
        setNewEmployee({ ...employeeToEdit });
    };

    const handleSaveEditEmployee = async (id) => {
        try {
            const response = await fetch(API_UP.replace('{emp_ID}', newEmployee.emp_ID), {  // ใช้ newEmployee แทน userToEdit
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emp_ID: newEmployee.emp_ID,
                    emp_Firstname: newEmployee.emp_Firstname,
                    emp_Lastname: newEmployee.emp_Lastname,
                    department_Name: newEmployee.department_Name,
                    job_Name: newEmployee.job_Name,
                    startDate: newEmployee.startDate,
                    endDate: newEmployee.endDate,
                }),
            });

            if (response.ok) {
                const updatedEmployees = employees.map(user =>
                    user.id === id
                        ? {
                            ...user, emp_Firstname: newEmployee.emp_Firstname,
                            emp_Lastname: newEmployee.emp_Lastname,
                            department_Name: newEmployee.department_Name,
                            job_Name: newEmployee.job_Name,
                            startDate: newEmployee.startDate,
                            endDate: newEmployee.endDate
                        }
                        : user
                );
                setEmployees(updatedEmployees);
                localStorage.setItem('employees', JSON.stringify(updatedEmployees));
                setEditingEmployeeId(null);
                setNewEmployee({ emp_ID: '', emp_Firstname: '', emp_Lastname: '', department_Name: '', job_Name: '', startDate: '', endDate: '' });
                window.alert('บันทึกข้อมูลเรียบร้อยแล้ว');
            }
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.detail || 'Error updating user');
            }
        } catch (error) {
            window.alert(`เกิดข้อผิดพลาด: ${error.message}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEmployees = employees.filter(employee =>
        (employee.emp_Firstname + ' ' + employee.emp_Lastname).toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCancelEmployee = () => {
        setNewEmployee({
            emp_ID: '',
            emp_Firstname: '',
            emp_Lastname: '',
            department_Name: '',
            job_Name: '',
            startDate: '',
            endDate: ''
        });
        setAddingNewEmployee(false);
        setEditingEmployeeId(null);
    };

    return (
        <div className="admin-container">
            <div className="employee-management-box">
                <div className="navbar">
                    <Link to="/General" >ข้อมูลคำร้อง</Link>
                    <Link to="/Approve">การอนุมัติคำร้อง</Link>
                    <Link to="/Administrator">Administrator</Link>
                    <Link to="/Employee-Turnover-Rate" className="active">อัตราการเข้า-ออก</Link>
                    <Link to="/Report">รายงาน</Link>
                    <Link to="/">Log out</Link>
                </div>

                <div className="search-container">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="ค้นหารายชื่อ..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {!addingNewEmployee && (
                            <button className="add-employee-btn" onClick={handleAddEmployee}>+ เพิ่มพนักงาน</button>
                        )}
                        {addingNewEmployee && (
                            <button className="cancel-employee-btn" onClick={handleCancelEmployee}>ยกเลิกการเพิ่มพนักงาน</button>
                        )}
                    </div>
                </div>
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>รหัสพนักงาน</th>
                            <th>ชื่อ</th>
                            <th>นามสกุล</th>
                            <th>ชื่อแผนก</th>
                            <th>ชื่อตำแหน่ง</th>
                            <th>วันที่เข้า</th>
                            <th>วันที่ออก</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee.emp_ID}>
                                <td>{employee.emp_ID}</td>
                                <td>{employee.emp_Firstname}</td>
                                <td>{employee.emp_Lastname}</td>
                                <td>{employee.department_Name}</td>
                                <td>{employee.job_Name}</td>
                                <td>{employee.startDate}</td>
                                <td>
                                    {editingEmployeeId === employee.id ? (
                                        <input type="date" name="endDate" value={newEmployee.endDate} onChange={handleInputChange} />
                                    ) : (
                                        employee.endDate
                                    )}
                                </td>
                                <td>
                                    {editingEmployeeId === employee.id ? (
                                        <button className="save-btn" onClick={() => handleSaveEditEmployee(employee.id)}>บันทึก</button>
                                    ) : (
                                        <>
                                            <button className="edit-btn" onClick={() => handleEditEmployee(employee.id)}>แก้ไข</button>
                                            <button className="delete-btn" onClick={() => handleDeleteEmployee(employee.id)}>ลบ</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {addingNewEmployee && (
                            <tr key="new-employee-row"> {/* key สำหรับแถวใหม่ */}
                                <td><input type="text" name="emp_ID" value={newEmployee.emp_ID} onChange={handleInputChange} placeholder="รหัสพนักงาน" /></td>
                                <td><input type="text" name="emp_Firstname" value={newEmployee.emp_Firstname} onChange={handleInputChange} placeholder="ชื่อ" /></td>
                                <td><input type="text" name="emp_Lastname" value={newEmployee.emp_Lastname} onChange={handleInputChange} placeholder="นามสกุล" /></td>
                                <td>
                                    <select name="department_Name" value={newEmployee.department_Name} onChange={handleInputChange}>
                                        <option value="">ชื่อแผนก</option>
                                        <option value="ฝ่ายบริหาร">ฝ่ายบริหาร</option>
                                        <option value="ฝ่ายทรัพยากรบุคคล">ฝ่ายทรัพยากรบุคคล</option>
                                        <option value="ฝ่ายการเงินและบัญชี">ฝ่ายการเงินและบัญชี</option>
                                        <option value="ฝ่ายการตลาด">ฝ่ายการตลาด</option>
                                        <option value="ฝ่ายไอที">ฝ่ายไอที</option>
                                        <option value="ฝ่ายปฏิบัติการ">ฝ่ายปฏิบัติการ</option>
                                        <option value="ฝ่ายขาย">ฝ่ายขาย</option>
                                        <option value="ฝ่ายผลิตภัณฑ์">ฝ่ายผลิตภัณฑ์</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="job_Name" value={newEmployee.job_Name} onChange={handleInputChange}>
                                        <option value="">ชื่อตำแหน่ง</option>
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
                                        <option value="ผู้จัดการฝ่ายทรัพยากรบุคคล">ผู้จัดการฝ่ายทรัพยากรบุคคล</option>
                                        <option value="ตัวแทนฝ่ายทรัพยากรบุคคล">ตัวแทนฝ่ายทรัพยากรบุคคล</option>
                                        <option value="ผู้จัดการฝ่ายเทคโนโลยีสารสนเทศ">ผู้จัดการฝ่ายเทคโนโลยีสารสนเทศ</option>
                                        <option value="โปรแกรมเมอร์">โปรแกรมเมอร์</option>
                                        <option value="ผู้เชี่ยวชาญสนับสนุนด้าน IT">ผู้เชี่ยวชาญสนับสนุนด้าน IT</option>
                                        <option value="ผู้จัดการฝ่ายขาย">ผู้จัดการฝ่ายขาย</option>
                                        <option value="ตัวแทนฝ่ายขาย">ตัวแทนฝ่ายขาย</option>
                                        <option value="ผู้จัดการลูกค้า">ผู้จัดการลูกค้า</option>
                                        <option value="พนักงานทั่วไป">พนักงานทั่วไป</option>
                                        <option value="ผู้ช่วยฝ่ายขาย">ผู้ช่วยฝ่ายขาย</option>
                                    </select>
                                </td>
                                <td><input type="date" name="startDate" value={newEmployee.startDate} onChange={handleInputChange} /></td>
                                <td><input type="date" name="endDate" value={newEmployee.endDate} onChange={handleInputChange} /></td>
                                <td><button className="save-btn" onClick={handleSaveEmployee}>บันทึก</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTurnoverRate;
