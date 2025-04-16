from time_provider import get_current_time_est
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from time_provider import *
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from bson import ObjectId
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
            bookings_collection = db["bookings"]
            study_rooms_collection = db["study_rooms"]
            data = request.get_json()
            print("Received Booking data:", data)
            booking_result = bookings_collection.insert_one(data)
            return jsonify({
                "message": "Booking added and room updated successfully!",
                "booking_id": str(booking_result.inserted_id)
            })
    except Exception as e:
        print("error processing booking:", e)
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
                return jsonify({"message": "Username or email and password are required!"}), 400

            user = users_collection.find_one({
                "$or": [{"email": user_identify}, {"username": user_identify}],
                "password": password
            })

            print("found user:", user)

            if not user:
                return jsonify({"message": "Invalid credentials!"}), 401

            if user.get("password") != password:
                return jsonify({"message": "Invalid credentials!"}), 401

            fullName = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
            return jsonify({
                "message": "Login successful!",
                "username": user.get("username"),
                "fullName": fullName,
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rooms', methods=['GET'])
def get_rooms():
    floor = request.args.get('floor')
    time_slot = request.args.get('time')
    booking_date = request.args.get('date')

    if floor == "1":
        return jsonify({"rooms": []})

    if not floor or not time_slot or not booking_date:
        return jsonify({"error": "Missing floor, time, or date!"}), 400

    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            rooms_collection = db["study_rooms"]
            bookings_collection = db["bookings"]

            rooms = list(rooms_collection.find({"floor": floor}, {"_id": 0}))
            available_rooms = []

            for room in rooms:
                default_slots = room.get("available_slots", [])
                booked_slots_cursor = bookings_collection.find({
                    "room": room.get("room"),
                    "floor": floor,
                    "bookingDate": booking_date,
                }, {"bookingTime": 1, "_id": 0})
                booked_slots = [booking["bookingTime"] for booking in booked_slots_cursor]

                available_slots = [slot for slot in default_slots if slot not in booked_slots]
                room["available_slots"] = available_slots

                if time_slot in available_slots:
                    available_rooms.append(room)

            return jsonify({"rooms": available_rooms})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/bookings/<booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            bookings_collection = db["bookings"]
            study_rooms_collection = db["study_rooms"]
            booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
            if not booking:
                return jsonify({"error": "Booking not found!"}), 404

            bookings_collection.delete_one({"_id": ObjectId(booking_id)})

            study_rooms_collection.update_one(
                {"room": booking.get("room"), "floor": booking.get("floor")},
                {"$addToSet": {"available_slots": booking.get("bookingTime")}}
            )

            return jsonify({"message": "Booking deleted!"})
    except Exception as e:
        print("backend error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/user_bookings', methods=['GET'])
def get_user_bookings():
    userName = request.args.get("userName")
    print(f"Received userName: {userName}")
    if not userName:
        return jsonify({"error": "Missing userName!"}), 400
    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            db = client["study_room_booking"]
            bookings_collection = db["bookings"]
            bookings = list(bookings_collection.find({"userName": userName}))
            for booking in bookings:
                booking['_id'] = str(booking['_id'])

            return jsonify({"bookings": bookings})
    except Exception as e:
        print("Error fetching user bookings:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)