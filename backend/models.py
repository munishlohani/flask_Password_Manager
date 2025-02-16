from app import db
from flask_login import UserMixin
from flask_bcrypt import generate_password_hash ,check_password_hash 


# A Users Class to store UserNames

class Users(db.Model,UserMixin):
    __tablename__="users"
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(50),nullable=False,unique=True)
    email=db.Column(db.String(150),unique=True,nullable=False)
    password_hash=db.Column(db.String(128),nullable=False)
    passwords=db.relationship('Password',backref='user',lazy=True) # One to Many Relationship between User-Password.


    def set_password_hash(self,password):
        self.password_hash=generate_password_hash(password)
    
    def check_password(self,password):
        return check_password_hash(self.password_hash,password)

# Stores Password for Users. 
class Password(db.Model,UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    site_name=db.Column(db.String(150),nullable=False)
    site_url=db.Column(db.String(200))
    site_password=db.Column(db.String(150),nullable=False)

