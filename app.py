from time_provider import get_current_time_est
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://JH3617:<db_password>@studyspace.yb9yb.mongodb.net/?retryWrites=true&w=majority&appName=StudySpace"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Deployment pinged. Connected to MongoDB.")
except Exception as e:
    print(e)