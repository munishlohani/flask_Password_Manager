from app import create_app

react_app=create_app()

if __name__=='__main__':
    react_app.run('0.0.0.0',debug=True)