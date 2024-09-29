from pydantic import BaseModel, Field
from typing import List

class Userschema(BaseModel):
    name: str = Field("", min_length=5, max_length=100)
    email: str = Field("", min_length=5, max_length=100)
    phone: str = Field("", min_length=10)