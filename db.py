from pymongo import MongoClient
from config import Config

# client = MongoClient(Config.MONGO_URI)
# db = client[Config.DB_NAME]

client = MongoClient("mongodb+srv://will:IS455@cluster0.ulqgakk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.IS455Final


# Export db for use in app.py
def get_db():
    return db
