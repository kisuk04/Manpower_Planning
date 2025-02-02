from pydantic import BaseModel
from typing import Optional
from datetime import date


class JobModel(BaseModel):
    job_ID: str  
    job_Name: str

class DepartmentModel(BaseModel):
    department_ID: str
    department_Name: str

class EmployeeModel(BaseModel):
    emp_ID: str
    emp_Firstname: Optional[str] = None
    emp_Lastname: Optional[str] = None
    emp_Gender: Optional[str] = None
    emp_BirthDate: Optional[date] = None
    emp_Phone: Optional[str] = None
    hire_date: date
    department_ID: str
    job_ID: str
    emp_Salary: int

class JobhisModel(BaseModel):
    emp_ID: str
    emp_Firstname: str
    emp_Lastname: str
    department_Name: str
    job_Name: str
    startDate: date
    endDate: Optional[date] = None

class RequestModel(BaseModel):
    emp_ID: str
    emp_Firstname: str
    Request_Date: date
    Department_Name: str
    job_Name: str
    Education_Level: Optional[str] = None
    Employment_Type: Optional[str] = None
    Desired_Date: date
    Total_num_req: int
    Num_Vacancies: int

class Author1Model(BaseModel):
    emp_ID: str 
    emp_Firstname: str
    username: str 
    passw: str   
    access: str

class ApproveModel(BaseModel):
    # App_ID: Optional[int] = None 
    Request_ID: str 
    Emp_ID: str 

class ManpowerModel(BaseModel):
    plan_ID: str 
    Emp_ID: str
    plan_StartDate: Optional[date] = None 
    plan_EndDate: Optional[date] = None  

class ReportModel(BaseModel):
    Report_ID: str  
    dates: Optional[date] = None 

class ViewModel(BaseModel):
    Emp_ID: str  
    Report_ID: str 

