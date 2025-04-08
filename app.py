from dotenv import load_dotenv
from time_provider import get_current_time_est
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from time_provider import *
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

uri = os.environ.get('MONGODB_URI')
if not uri:
    uri = input("Enter your MongoDB URI: ")

@app.route('/')
def hello_world():
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            client.admin.command('ping')
            print("MongoDB connection successful!")
            return "Connected to MongoDB!"
    except Exception as e:
        print("Error connecting to MongoDB:", e)
        return str(e)

@app.route('/bookings', methods=['GET'])
def get_bookings():
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            collection = db["bookings"]

            print("Connected to MongoDB, fetching books...")

            bookings = list(collection.find({}, {"_id": 0}))
            print("Bookings from DB:", bookings)

            return jsonify({"bookings": bookings})
    except Exception as e:
        print("Error fetching bookings:", e)
        return jsonify({"error": str(e)})
@app.route('/bookings', methods=['POST'])
def add_booking():
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            collection = db["bookings"]
            data = request.get_json()
            collection.insert_one(data)
            return jsonify({"message": "Booking added!"})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/register', methods=['POST'])
def register_user():
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["Login"]
            users_collection = db["Login credentials"]
            data = request.get_json()

            print("received data for registration:", data)

            email = data.get("email")
            username = data.get("username")
            password = data.get("password")

            if not email or not username or not password:
                print("Missing fields")
                return jsonify({"message": "All fields are required to be filled!"}), 400

            existing_user = users_collection.find_one({"$or": [{"email": email}, {"username": username}]})
            if existing_user:
                print("Errors: Email or Username already exists!")
                return jsonify({"message": "Email or Username already exists!"}), 400

            result = users_collection.insert_one({
                "first_name": data.get("first_name"),
                "last_name": data.get("last_name"),
                "username": username,
                "email": email,
                "password": password
            })

            print("insert result:", result.inserted_id)

        return jsonify({"message": "User registered!"})
    except Exception as e:
        print("backend error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        with (MongoClient(uri, server_api=ServerApi('1')) as client):
            db = client["Login"]
            users_collection = db["Login credentials"]
            data = request.get_json()

            print("Login Attempt Data:", data)

            user_identify = data.get("usernameOrEmail")
            password = data.get("password")

            if not user_identify or not password:
                print("Missing Credentials")
                return jsonify({"message": "Username or email and password are required!"}), 400

            user = users_collection.find_one({
                "$or": [{"email": user_identify}, {"username": user_identify}],
                "password": password
            })

            print("found user:", user)

            if not user:
                print("User not found")
                return jsonify({"message": "Invalid credentials!"}), 401

            if user.get("password") != password:
                print("Incorrect Password")
                return jsonify({"message": "Invalid credentials!"}), 401

        return jsonify({"message": "Login successful!"}), 200
    except Exception as e:
        print("backend error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/rooms', methods=['GET'])
def get_rooms():
    floor = request.args.get('floor')
    time_slot = request.args.get('time')

    if floor == "1":
        return jsonify({"rooms": []})

    if not floor or not time_slot:
        return jsonify({"error": "Missing floor or time slot!"}), 400

    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            rooms_collection = db["study_rooms"]
            rooms = list(rooms_collection.find({
                "floor": floor,
                "available_slots" : time_slot,
            }, {"_id": 0}))
            return jsonify({"rooms": rooms})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)