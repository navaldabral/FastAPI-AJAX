from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from models import Userdb, Base
from schemas import Userschema
from database import engine, get_db
from sqlalchemy.orm import Session, joinedload
from fastapi.responses import HTMLResponse
from sqlalchemy import asc, desc


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

Base.metadata.create_all(engine) # below code is use for check or create the table in database

# This api is to add data
@app.post("/add_user")
def add_user(request: Userschema, db: Session = Depends(get_db)):
    new_userdata = Userdb(name=request.name, email=request.email, phone=request.phone)
    db.add(new_userdata)
    db.commit()
    db.refresh(new_userdata)
    response = {
        "status": "success",
    }
    return response

# This api is to get data of particular id
@app.get("/get_user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Userdb).filter(Userdb.id == user_id).first()
    response = {
        "status": "success",
    }
    if user is None:
        response = {
            "status": "User Not Found",
        }
        return response
    else:
        response = {
            "status": "success",
            "data": user
        }
        return response
    
# This api is to update data
@app.put("/update_user/{user_id}")
def update_user(user_id: int, request: Userschema, db: Session = Depends(get_db)):
    user = db.query(Userdb).filter(Userdb.id == user_id).first()
    if user is None:
        response = {
            "status": "User Not Found",
        }
        return response
    else:
        user.name = request.name
        user.email = request.email
        user.phone = request.phone
        db.commit()
        db.refresh(user)

        response = {
            "status": "Update Sucessfully",
        }
        return response

# This api is to delete data
@app.delete("/delete_user/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Userdb).filter(Userdb.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "success"}


# this api to get all data form database
@app.get("/get_all_users")
def get_all_users(
    page: int = Query(1, ge=1),  
    per_page: int = Query(10, ge=1),  
    sort_by: str = Query("id"),  
    sort_direction: str = Query("desc", regex="^(asc|desc)$"),  
    db: Session = Depends(get_db)
):
    total_users = db.query(Userdb).count()
    offset = (page - 1) * per_page
    if sort_direction == "asc":
        order = asc(getattr(Userdb, sort_by))
    else:
        order = desc(getattr(Userdb, sort_by))
    users = db.query(Userdb).order_by(order).offset(offset).limit(per_page).all()
    return {
        "users": users,
        "total_pages": (total_users + per_page - 1) // per_page,
        "current_page": page,
    }