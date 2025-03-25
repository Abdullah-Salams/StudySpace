from time_provider import get_current_time_est
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
CORS(app)

uri = "mongodb+srv://JH3617:StudySpace@studyspace.yb9yb.mongodb.net/?retryWrites=true&w=majority&appName=StudySpace"

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