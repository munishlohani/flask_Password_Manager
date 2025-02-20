from models import Users, Password
from flask_login import login_user, current_user, login_required, logout_user
from flask import request, jsonify
from encryption import encrypt_password, decrypt_password


def generate_routes(app, db):

    # register route
    @app.route("/api/register", methods=["POST"])
    def register():
        try:
            data = request.json
            username = data["username"]
            email = data.get("email", None)
            password = data["password"]
            password_again = data["password_again"]

            if not username or not email or not password:
                return jsonify({"error":"Username, Password and Email is required "}),400

            if password != password_again:
                return jsonify({"error": "Password is not correct"}), 400

            existing_user = Users.query.filter_by(username=username).first()

            if existing_user is not None:
                return jsonify({"error": "User Already Exists"}), 400

            user = Users(username=username, email=email)

            user.set_password_hash(password=password)

            db.session.add(user)
            db.session.commit()
            return jsonify({"message": "User Created Successfully"}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # login route
    @app.route("/api/login", methods=["POST"])
    def login():
        try:

            data = request.json

            username = data["username"]
            email = data.get("email",None)
            password = data["password"]

            user = Users.query.filter(Users.username == username).first()

            if user is not None:
                if user.check_password(password):
                    login_user(user)
                    return jsonify({"message": "Logged in successfully"}), 200

                else:
                    return jsonify({"error": "Password is incorrect"}), 400

            else:
                return jsonify({"error": "User not Found"}), 404

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/dashboard")
    @login_required
    def dashboard():

        try:
            if not current_user.is_authenticated:
                return jsonify({"error": "User is not Logged in"}), 401

            passwords = [
                {   "password_id": p.id,
                    "site_name": p.site_name,
                    "site_url": p.site_url,
                    "site_password": decrypt_password(p.site_password),
                }
                for p in current_user.passwords
            ]

            return jsonify(
                {   

                    "user_id": current_user.id,
                    "user_name": current_user.username,
                    "passwords": passwords,
                    
                }
            )

        except Exception as e:
            return jsonify({"error": "An error occoured"}), 400

    @app.route("/api/logout", methods=["POST"])
    @login_required
    def logout():
        try:
            logout_user()
            return jsonify({"message": "Logged out Successfully"}), 200

        except Exception as e:
            return jsonify({"error": "Could not log out"}), 400

    # create password route
    @app.route("/api/dashboard/create", methods=["POST"])
    @login_required
    def create_password():
        try:
            data = request.json
            site_name = data.get("site_name")
            site_password = data.get("site_password")
            site_url = data.get("site_url", None)

            if not site_name or not site_password:
                return jsonify({"error": "Site name and password are required"}), 400

            existing = Password.query.filter_by(
                user_id=current_user.id, site_name=site_name, site_url=site_url
            ).all()
            for p in existing:
                if decrypt_password(p.site_password) == site_password:
                    return jsonify({"message": "Password already Exists"})

            new_site_name = site_name
            new_site_url = site_url
            new_encrypted_password = encrypt_password(site_password)

            new_passwords = Password(
                user_id=current_user.id,
                site_name=new_site_name,
                site_url=new_site_url,
                site_password=new_encrypted_password,
            )

            db.session.add(new_passwords)
            db.session.commit()
            return jsonify({"message": "Password added successfully"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    #TODO: delete route
