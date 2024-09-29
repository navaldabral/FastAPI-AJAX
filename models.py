from sqlalchemy import Column, Integer, String, Date, func, Text, ForeignKey
from database import Base
from sqlalchemy.sql import text
from sqlalchemy.orm import relationship


class Userdb(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(length=100))
    email = Column(String(length=100))
    phone = Column(String(length=10))

    class Config:
        orm_mode = True