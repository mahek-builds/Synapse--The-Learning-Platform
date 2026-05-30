from jose import jwt 
from datetime import datetime,timedelta 
SECRET_KEY="mysecretkey"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.ctnow()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode({"exp":expire})
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
def verify_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    except:
        return None