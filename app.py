from dotenv import load_dotenv
import os
from mysql.connector import pooling
import mysql.connector
from flask import *
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# add by me
load_dotenv()

PASSWORD = os.getenv("PASSWORD")
DATABASE = os.getenv("DATABASE")

my_pool = pooling.MySQLConnectionPool(
    pool_name='my_pool',
    pool_size=10,
    pool_reset_session=True,
    host='localhost',
    user='root',
    password=PASSWORD,
    database=DATABASE
)


@app.route("/api/attraction/<attractionId>")
def getAttraction(attractionId):

    db = my_pool.get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM attractions WHERE id = '%s'" %
                   (attractionId))
    result = cursor.fetchone()
    try:
        if result == None:
            return app.response_class(json.dumps({"error": True, "message": "Invalid ID"}), status=400, mimetype='application/json')

        else:
            return app.response_class(json.dumps(
                {"data": {
                    "id": result[0],
                    "name": result[1],
                    "category": result[2],
                    "description": result[3],
                    "address": result[4],
                    "transport": result[5],
                    "mrt": result[6],
                    "latitude": result[7],
                    "longitude": result[8],
                    "images": json.loads(result[9])
                }}, indent=4,
                ensure_ascii=False, sort_keys=False), status=200, mimetype='application/json')
    except:
        return app.response_class(json.dumps({"error": True, "message": "Internal Server Error"}), status=500, mimetype='application/json')

    finally:
        db.close()


@app.route("/api/attractions")
def attractions():
    db = my_pool.get_connection()
    cursor = db.cursor()

    page = int(request.args.get("page",0))
    keyword = request.args.get("keyword", None)
    page_size = 12
    page_limit = page * page_size

    try:
        if keyword == None:
            sql = f"SELECT * FROM attractions LIMIT {page_limit}, {page_size}"
            cursor.execute(sql)
            results = cursor.fetchall()
            results_len = len(results)

            attractions_list = []
            for result in results:
                data = {
                    "id": result[0],
                    "name": result[1],
                    "category": result[2],
                    "description": result[3],
                    "address": result[4],
                    "transport": result[5],
                    "mrt": result[6],
                    "latitude": result[7],
                    "longitude": result[8],
                    "images": json.loads(result[9])
                }
                attractions_list.append(data)

            if results_len > 11:
                next_page = page + 1

            else:
                next_page = None

            return app.response_class(json.dumps({"nextPage": next_page, "data": attractions_list}, indent=4,
                                                 ensure_ascii=False, sort_keys=False), status=200, mimetype='application/json')

        else:
            sql = f"SELECT * FROM attractions WHERE name LIKE '%" + \
                keyword+f"%' LIMIT {page_limit}, {page_size}"
            cursor.execute(sql)
            results = cursor.fetchall()
            results_len = len(results)

            attractions_list = []
            for result in results:
                data = {
                    "id": result[0],
                    "name": result[1],
                    "category": result[2],
                    "description": result[3],
                    "address": result[4],
                    "transport": result[5],
                    "mrt": result[6],
                    "latitude": result[7],
                    "longitude": result[8],
                    "images": json.loads(result[9])
                }
                attractions_list.append(data)
            if attractions_list == []:
                return app.response_class(json.dumps(
                    {"error": True,
                     "message": "找不到資料"}, indent=4,
                    ensure_ascii=False, sort_keys=False), status=400, mimetype='application/json')
            if results_len > 11:
                next_page = page + 1

            else:
                next_page = None

            return app.response_class(json.dumps(
                {"nextPage": next_page, "data": attractions_list},
                indent=4, ensure_ascii=False, sort_keys=False),
                status=200, mimetype='application/json')
    except:
        return app.response_class(json.dumps(
            {"error": True, "message": "Internal Server Error"},
            indent=4, ensure_ascii=False, sort_keys=False),
            status=500, mimetype='application/json')

    finally:
        db.close()


# DO NOT MODIFY NOW
# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


# DO NOT MODIFY NOW
app.run(host='0.0.0.0', port=3000)
# change port by Angie
