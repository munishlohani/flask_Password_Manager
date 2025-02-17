from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS

db=SQLAlchemy()

def create_app():
    app=Flask(__name__)
    cors=CORS(app=app,origins='*')
    
    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///./sqdb.db'
    app.config['SECRET_KEY']="secret_key"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

    db.init_app(app=app)
    login_manager=LoginManager()
    login_manager.init_app(app)
    login_manager.login_view='login'


    
    bcrypt=Bcrypt(app=app)


    from models import Users

    @login_manager.user_loader
    def user_loader(id):
       return Users.query.get(id)
    



    from routes import generate_routes

    generate_routes(app=app,db=db)

    migrate=Migrate(app=app,db=db)


    return app


    