from fastapi import FastAPI, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from product import JobModel, get_all_Jobs, get_job_id
from product import EmployeeModel, get_all_employees, get_emp_name
from product import RequestModel, add_req, get_all_req
from product import Author1Model, get_user, delete_user
from product import add_user, get_emp_by_id,update_user, get_jobemp_id
from product import ApproveModel, add_appr, delete_appr, get_req_id
from product import JobhisModel ,add_job_history, delete_jobhis
from product import get_all_job_his, update_jobhis, get_emp_by_id, add_job_history
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET
@app.get("/get_all_jobs/", response_model=list[JobModel])
def get_all_job_api():
    jobs = get_all_Jobs()
    print(jobs)
    return JSONResponse(status_code=200, content=jsonable_encoder(jobs))

@app.get("/get_all_employees", response_model=list[EmployeeModel])
def get_all_job_api():
    emp = get_all_employees()
    print(emp)
    return JSONResponse(status_code=200, content=jsonable_encoder(emp))

@app.get("/get_all_req", response_model=list[RequestModel])
def get_all_req_api():
    req = get_all_req()
    print(req)
    return JSONResponse(status_code=200, content=jsonable_encoder(req))

@app.get("/get_users", response_model=list[Author1Model])
def get_user_api():
    user = get_user()
    print(user)
    return JSONResponse(status_code=200, content=jsonable_encoder(user))

@app.get("/get_name/{emp_ID}", response_model=EmployeeModel)
def get_empname_api(emp_ID: str):
    employee = get_emp_name(emp_ID)
    return JSONResponse(status_code=200, content=jsonable_encoder(employee))

@app.get("/get_emp_id/{emp_ID}", response_model=EmployeeModel)
def get_emp_id_api(emp_ID: str):
    empId = get_emp_by_id(emp_ID)
    return JSONResponse(status_code=200, content=jsonable_encoder(empId))


@app.get("/get_job_id/{department_Name}", response_model=JobModel)
def get_job_id_api(department_Name: str):
    job_id = get_job_id(department_Name)
    return JSONResponse(status_code=200, content=jsonable_encoder(job_id))



@app.post('/add_user', response_model=Author1Model)
def add_user_api(user: Author1Model):
    user = add_user(user)
    return JSONResponse(status_code=201, content={'status': 'success', 'User': user}) 



# Delete
@app.delete("/delete_user/{emp_ID}", response_model=Author1Model)
def delete_user_api(emp_ID: str):
    # ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูล
    existing_user = get_emp_name(emp_ID)  # ฟังก์ชันนี้ควรตรวจสอบทั้งสองตาราง
    if not existing_user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้")

    is_deleted = delete_user(emp_ID)
    if is_deleted:
        return JSONResponse(status_code=200, content={'status': 'success', 'message': 'ลบผู้ใช้สำเร็จ'})
    else:
        raise HTTPException(status_code=500, detail="ไม่สามารถลบผู้ใช้ได้")

@app.delete("/delete_jobhis/{emp_ID}", response_model=JobhisModel)
def delete_jobhis_api(emp_ID: str):
    # ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูล
    existing_jobhis = get_jobemp_id(emp_ID)  # ฟังก์ชันนี้ควรตรวจสอบทั้งสองตาราง
    if not existing_jobhis:
        raise HTTPException(status_code=404, detail="ไม่พบประวัติพนักงาน")

    is_deleted = delete_jobhis(emp_ID)
    if is_deleted:
        return JSONResponse(status_code=200, content={'status': 'success', 'message': 'ลบข้อมูลสำเร็จ'})
    else:
        raise HTTPException(status_code=500, detail="ไม่สามารถลบข้อมูลได้")


@app.delete("/delete_req/{Request_ID}")
def delete_approv(Request_ID: str):
    try:
        existing_req = get_req_id(Request_ID)
        if not existing_req:
            raise HTTPException(status_code=404, detail="Request not found")

        is_deleted = delete_appr(Request_ID) 
        if is_deleted:
            return JSONResponse(status_code=200, content={'status': 'success', 'message': 'Request deleted successfully'})
        else:
            raise HTTPException(status_code=500, detail="Could not delete the request")
    except HTTPException as e:
        raise e  
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

#Post insert
@app.post('/create_req/', response_model=RequestModel)
def create_req_api(req: RequestModel):
    try:
        Request = add_req(req)
        return JSONResponse(status_code=201, content={'status': 'success', 'Request': Request})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/add_appr/', response_model=ApproveModel)
def create_appr_api(appr: ApproveModel):
    try:
        appro = add_appr(appr)
        return JSONResponse(status_code=201, content={'status': 'success', 'appr': appro})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post('/add_jobhis', response_model=JobhisModel)
def add_jobhis_api(jobh: JobhisModel):
    jobhis = add_job_history(jobh)
    return JSONResponse(status_code=201, content={'status': 'success', 'User': jobhis})

@app.put("/update_user/{emp_ID}", response_model=Author1Model)
def update_user_api(emp_ID: str, AuthorizedUsers: Author1Model):
    existing_user = get_emp_by_id(emp_ID)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Data not found")

    updated_user = update_user(emp_ID, AuthorizedUsers)
    if updated_user:
        return updated_user
    else:
        raise HTTPException(status_code=500, detail="Failed to update data")

@app.put("/update_jobhis/{emp_ID}", response_model=JobhisModel)
def update_jobh_api(emp_ID: str, job_history: JobhisModel):
    existing_jh = get_jobemp_id(emp_ID)
    if not existing_jh:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูล")

    update_jh = update_jobhis(emp_ID, job_history)
    return update_jh