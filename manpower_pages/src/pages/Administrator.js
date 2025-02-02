import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../components/Administrator.css';
import { Link } from 'react-router-dom';

const API_ADD = '/add_user';
const API_DEL = '/delete_user/{emp_ID}';
const API_UP = '/update_user/{emp_ID}';

const Administrator = () => {
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers).map(user => ({ ...user, showPassword: false })) : [];
    });

    const [newEmployee, setNewEmployee] = useState({
        emp_ID: '',
        emp_Firstname: '',
        username: '',
        passw: '',
        access: '',
    });

    const [addingNewUser, setAddingNewUser] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAddUser = () => {
        setAddingNewUser(true);
    };

    const handleSaveUser = async () => {
        const { emp_ID, emp_Firstname, username, passw, access } = newEmployee;

        if (!emp_ID || !emp_Firstname || !username || !passw || !access) {
            alert('คุณยังกรอกข้อมูลไม่ครบ');
            return;
        }
        try {
            const response = await fetch(API_ADD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถเพิ่มผู้ใช้ได้');
            }

            const result = await response.json();
            if (result.status === 'success') {
                const updatedUsers = [...users, { ...newEmployee, id: users.length + 1 }];
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                setNewEmployee({ emp_ID: '', emp_Firstname: '', username: '', passw: '', access: '' });
                setAddingNewUser(false);
                window.alert('บันทึกข้อมูลเรียบร้อยแล้ว');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        const userToDelete = users.find(user => user.id === id);
        if (!userToDelete) {
            return;
        }

        const confirmDelete = window.confirm(`คุณต้องการลบผู้ใช้ ${userToDelete.emp_Firstname} หรือไม่?`);

        if (confirmDelete) {
            try {
                const response = await fetch(API_DEL.replace('{emp_ID}', userToDelete.emp_ID), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถลบผู้ใช้ได้');
                }

                const updatedUsers = users.filter(user => user.id !== id);
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                window.alert('ลบผู้ใช้เรียบร้อยแล้ว');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleEditUser = (id) => {
        setEditingUserId(id);
        const userToEdit = users.find(user => user.id === id);
        setNewEmployee({ ...userToEdit });
    };
    
    const handleSaveEditUser = async (id) => {
        try {
            const response = await fetch(API_UP.replace('{emp_ID}', newEmployee.emp_ID), {  // ใช้ newEmployee แทน userToEdit
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emp_ID: newEmployee.emp_ID,
                    emp_Firstname: newEmployee.emp_Firstname,
                    username: newEmployee.username,
                    passw: newEmployee.passw,
                    access: newEmployee.access,
                }),
            });

            
            if (response.ok) {
                const updatedUsers = users.map(user =>
                    user.id === id
                        ? { ...user, emp_Firstname: newEmployee.emp_Firstname, username: newEmployee.username, passw: newEmployee.passw, access: newEmployee.access }
                        : user
                );
    
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                setEditingUserId(null);
                setNewEmployee({ emp_ID: '', emp_Firstname: '', username: '', passw: '', access: '' });
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

    const filteredUsers = users.filter(user =>
        (user.emp_Firstname && user.emp_Firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCancelUser = () => {
        setNewEmployee({ emp_ID: '', emp_Firstname: '', username: '', passw: '', access: '' });
        setAddingNewUser(false);
        setEditingUserId(null);
    };

    const handleTogglePassword = (id) => {
        const updatedUsers = users.map(user =>
            user.id === id ? { ...user, showPassword: !user.showPassword } : user
        );
        setUsers(updatedUsers);
    };

    return (
        <div className="admin-container">
            <div className="user-management-box">
                <div className="navbar">
                    <Link to="/General">ข้อมูลคำร้อง</Link>
                    <Link to="/Approve" >การอนุมัติคำร้อง</Link>
                    <Link to="/Administrator" className="active">Administrator</Link>
                    <Link to="/Employee-Turnover-Rate">อัตราการเข้า-ออก</Link>
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
                        {!addingNewUser && (
                            <button className="add-user-btn" onClick={handleAddUser}>+ เพิ่มผู้ใช้</button>
                        )}
                        {addingNewUser && (
                            <button className="cancel-user-btn" onClick={handleCancelUser}>ยกเลิกการเพิ่มผู้ใช้</button>
                        )}
                    </div>
                </div>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>รหัสพนักงาน</th>
                            <th>ชื่อ</th>
                            <th>ชื่อผู้ใช้</th>
                            <th>รหัสผ่าน</th>
                            <th>สิทธิ์การเข้าถึง</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.emp_ID}</td>
                                <td>{user.emp_Firstname}</td>
                                <td>{user.username}</td>
                                <td>
                                    <div className="password-wrapper">
                                        <input
                                            type={user.showPassword ? "text" : "password"}
                                            value={user.passw}
                                            disabled
                                        />
                                        <span onClick={() => handleTogglePassword(user.id)}>
                                            {user.showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select name="access" value={newEmployee.access} onChange={handleInputChange}>
                                            <option value="">สิทธิ์การเข้าถึง</option>
                                            <option value="ดูได้เท่านั้น">ดูได้เท่านั้น</option>
                                            <option value="ดูและอนุมัติได้">ดูและอนุมัติได้</option>
                                            <option value="แอดมิน">แอดมิน</option>
                                        </select>
                                    ) : (
                                        user.access
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <button className="save-btn" onClick={() => handleSaveEditUser(user.id)}>บันทึก</button>
                                    ) : (
                                        <>
                                            <button className="edit-btn" onClick={() => handleEditUser(user.id)}>แก้ไข</button>
                                            <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>ลบผู้ใช้</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {addingNewUser && (
                            <tr>
                                <td><input type="text" name="emp_ID" value={newEmployee.emp_ID} onChange={handleInputChange} placeholder="รหัสพนักงาน" /></td>
                                <td><input type="text" name="emp_Firstname" value={newEmployee.emp_Firstname} onChange={handleInputChange} placeholder="ชื่อ ตย. สุชาติ" /></td>
                                <td><input type="text" name="username" value={newEmployee.username} onChange={handleInputChange} placeholder="ชื่อผู้ใช้" /></td>
                                <td>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="passw"
                                            value={newEmployee.passw}
                                            onChange={handleInputChange}
                                            placeholder="รหัสผ่าน"
                                        />
                                        <span onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <select name="access" value={newEmployee.access} onChange={handleInputChange}>
                                        <option value="">สิทธิ์การเข้าถึง</option>
                                        <option value="ดูได้เท่านั้น">ดูได้เท่านั้น</option>
                                        <option value="ดูและอนุมัติได้">ดูและอนุมัติได้</option>
                                        <option value="แอดมิน">แอดมิน</option>
                                    </select>
                                </td>
                                <td><button className="save-btn" onClick={handleSaveUser}>บันทึก</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Administrator;
