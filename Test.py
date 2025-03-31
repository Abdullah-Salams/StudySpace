from pymongo import MongoClient

uri = "mongodb+srv://JH3617:StudySpace@studyspace.yb9yb.mongodb.net/?retryWrites=true&w=majority&appName=StudySpace"

with MongoClient(uri) as client:
    print("Databases:", client.list_database_names())  # List available databases