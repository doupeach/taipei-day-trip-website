# Part 1 - 1:將景點資料存放至資料庫
# 在我們的專案中有一個 data 資料夾，裡面存放了一個 taipei-attractions.json 檔案，包含所有 景點的相關資料。
# 請在 MySQL 資料庫中，設計你的資料表，在 data 資料夾下，額外寫一隻獨 立的 Python 程式統一將景點資料存放到資料庫中。
# 請特別注意景點圖片的處理，我們會過濾資料中，不是 JPG 或 PNG 的檔案，景點的每張圖片 網址都必須被想辦法儲存在資料庫中。


# 1. connect mysql
import json
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
load_dotenv()

PASSWORD = os.getenv("PASSWORD")
DATABASE = os.getenv("DATABASE")

db = mysql.connector.connect(
  host = 'localhost',
  user = 'root',
  password = PASSWORD,
  database = DATABASE,
  )
cursor=db.cursor()


# 2. create table
# 3. handle img url
# 4. insert to table

with open("taipei-attractions.json", encoding="utf-8") as response:
    json_data = json.load(response)
    raw_data = json_data["result"]["results"]

# Clean image files
def getImage():
    for data in raw_data:
        images_url = data["file"].split("https://")
        del images_url[0]
            
        for image_url in images_url:
            image_format = image_url[-4:].lower()
            if image_format == ".jpg" or image_format == ".png":
                image_url = ["https://" + final for final in images_url]
                return image_url

def insertData():
    for data in raw_data:
        id = data["_id"]
        name = data["stitle"]
        category = data["CAT2"]
        description = data["xbody"]
        address = data["address"].replace(" ", "")
        transport = data["info"]
        mrt = data["MRT"]
        latitude = data["latitude"]
        longitude = data["longitude"]
        images = getImage()

        sql = 'INSERT INTO attractions (id, name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        val = (id, name, category, description, address, transport, mrt, latitude, longitude, json.dumps(images))
        
        try:
            cursor.execute(sql, val)
            db.commit()
        except Error as err:
            print("Error msg:", err)
        finally:
            print("Table inserted")
            

insertData()
cursor.close()
db.close()
