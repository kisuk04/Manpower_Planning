from fastapi import HTTPException,APIRouter
from database.query import query_get , query_create, query_update

from .models import JobModel, DepartmentModel, EmployeeModel, JobhisModel
from .models import RequestModel, Author1Model, ApproveModel
from .models import ManpowerModel, ReportModel, ViewModel


def get_all_Jobs():
    jobs = query_get("""
        SELECT * FROM Jobs
        """, ())
    return jobs

def get_all_departments():
    departments = query_get("""
        SELECT * FROM Departments
        """, ())
    return departments

def get_all_employees():
    employees = query_get("""
        SELECT * FROM Employees
        """, ())
    return employees

def get_all_job_his():
    job_his = query_get("""
        SELECT * FROM job_history
        """, ())
    return job_his

def get_all_req():
    reqs = query_get("""
        SELECT * FROM Requests ORDER BY Request_ID DESC
        """, ())
    return reqs

def get_all_author():
    authori = query_get("""
        SELECT * FROM AuthorizedUsers
        """, ())
    return authori

def get_all_manpower():
    man = query_get("""
        SELECT * FROM Manpower
        """, ())
    return man

def get_all_view():
    view = query_get("""
        SELECT * FROM views
        """, ())
    return view

def get_user():
    user = query_get("""
        SELECT * FROM AuthorizedUsers
        """, ())
    return user

# insert
def add_req(req: RequestModel):
    last_row_id = query_create("""
                INSERT INTO Requests (
                    emp_ID,
                    emp_Firstname,
                    Request_Date,
                    Department_Name,
                    job_Name,
                    Education_Level,
                    Employment_Type,
                    Desired_Date,
                    Total_num_req,
                    Num_Vacancies
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    req.emp_ID,
                    req.emp_Firstname,
                    req.Request_Date,
                    req.Department_Name,
                    req.job_Name,
                    req.Education_Level,
                    req.Employment_Type,
                    req.Desired_Date,
                    req.Total_num_req,
                    req.Num_Vacancies
                )
                )
    return last_row_id

def get_emp_name(emp_ID: str):
    employee = query_get("""
        SELECT concat(emp_firstname, ' ', emp_lastname)
        FROM Employees
        WHERE emp_ID = %s;
    """, (emp_ID))
    return employee

def get_job_id(department_Name: str):
    job_id = query_get("""
        SELECT job_ID
        FROM Jobs j join Departments d
        ON j.department_ID = d.department_ID
        WHERE department_Name = %s;
    """, (department_Name))
    return job_id
    
def delete_user(emp_ID: str):
    is_deleted = query_update("""
        DELETE FROM AuthorizedUsers
        WHERE emp_ID = %s;
        """,
        (emp_ID,)
        )
    return is_deleted

def get_req_id(Request_ID: str):
    req = query_get("""
        SELECT Request_ID
        FROM Requests
        WHERE Request_ID = %s;
    """, (Request_ID))
    return req


def add_user(user: Author1Model):
    last_row_id = query_create("""
                INSERT INTO AuthorizedUsers (
                    emp_ID,
                    emp_Firstname,
                    username,
                    passw,
                    access
                ) VALUES (%s, %s, %s, %s, %s)

                """, (
                    user.emp_ID,
                    user.emp_Firstname,
                    user.username,
                    user.passw,
                    user.access
                )
                )
    return last_row_id

def get_jobemp_id(emp_ID: str):
    req = query_get("""
        SELECT emp_ID
        FROM job_history
        WHERE emp_ID = %s;
    """, (emp_ID))
    return req


# ฟังก์ชันสำหรับบันทึกข้อมูลลงในฐานข้อมูล
def add_job_history(job_history: JobhisModel):
    last_row_id = query_create("""
        INSERT INTO job_history (
            emp_ID, 
            emp_Firstname, 
            emp_Lastname, 
            department_Name, 
            job_Name, 
            startDate
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            job_history.emp_ID,
            job_history.emp_Firstname,
            job_history.emp_Lastname,
            job_history.department_Name,
            job_history.job_Name,
            job_history.startDate
        ))
    return last_row_id

def add_appr(appr: ApproveModel):
    last_row_id = query_create("""
        INSERT INTO Approves (
            Request_ID, 
            Emp_ID
        ) VALUES (%s, %s)
        """, (
            appr.Request_ID,
            appr.Emp_ID
        ))
    return last_row_id

def delete_appr(Request_ID: str):
    is_deleted = query_update("""
        DELETE FROM Requests
        WHERE Request_ID = %s;
        """,
        (Request_ID,)
        )
    return is_deleted

def update_jobhis(emp_ID: str, job_his: JobhisModel):
    try:
        is_update = query_update("""
            UPDATE job_history
            SET emp_Firstname = %s,
                emp_Lastname = %s,
                department_Name = %s,
                job_Name = %s,
                startDate = %s,
                endDate = %s
            WHERE emp_ID = %s
        """, (
            job_his.emp_Firstname,
            job_his.emp_Lastname,
            job_his.department_Name,
            job_his.job_Name,
            job_his.startDate,
            job_his.endDate,
            emp_ID
        ))

        if is_update:
            return job_his.dict()
        else:
            raise HTTPException(status_code=500, detail="การอัปเดตข้อมูลล้มเหลว")
    except Exception as e:
        logger.error(f"เกิดข้อผิดพลาด: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดภายใน")

def delete_jobhis(emp_ID: str):
    is_deleted = query_update("""
        DELETE FROM job_history
        WHERE emp_ID = %s;
        """,
        (emp_ID,)
        )
    return is_deleted

def get_emp_by_id(emp_ID: str):
    emp = query_get("""
        SELECT emp_ID 
        FROM AuthorizedUsers
        WHERE emp_ID = %s;
    """, (emp_ID,))
    return emp  


def update_user(emp_ID: str, user: Author1Model):
    try:
        is_update = query_update("""
            UPDATE AuthorizedUsers
            SET emp_Firstname = %s, 
                username = %s, 
                passw = %s, 
                access = %s
            WHERE emp_ID = %s
        """, (
            user.emp_Firstname,
            user.username,
            user.passw,
            user.access,
            emp_ID
        ))

        if is_update:
            return user.dict() 
        else:
            return None
    except Exception as e:
        print(f"Error occurred: {e}")
        return None
