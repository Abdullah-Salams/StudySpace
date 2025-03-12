from flask import Flask

app = Flask(__name__)


from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://abdullahsalam2302:XmazE02XVwUp3NuV@cluster0.kczcr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"




@app.route('/')
def hello_world():

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)


if __name__ == '__main__':
    app.run()
