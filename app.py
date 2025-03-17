from dotenv import load_dotenv
from time_provider import get_current_time_est
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
load_dotenv()
import os

uri = os.environ.get('MONGODB_URI')
if not uri:
    uri = input("Enter your MongoDB URI: ")

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Deployment pinged. Connected to MongoDB.")
except Exception as e:
    print(e)