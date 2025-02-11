from dotenv import load_dotenv
import os
from mysql.connector import pooling
import mysql.connector
import requests

from threading import Semaphore
from contextlib import contextmanager
from flask import *
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = 'asbs'
# app.config['Access-Control-Allow-Origin'] = '*'

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
    database=DATABASE, auth_plugin='mysql_native_password'
)

mysql_config = {
    'pool_name': 'my_pool',
    'pool_size': 10,
    'pool_reset_session': True,
    'host': 'localhost',
    'user': 'root',
    'password': PASSWORD,
    'database': DATABASE,
    'auth_plugin': 'mysql_native_password'
}

# prevent pool exhausted


class ReallyMySQLConnectionPool(mysql.connector.pooling.MySQLConnectionPool):
    def __init__(self, **mysql_config):
        pool_size = mysql_config.get('pool_size', 10)
        self._semaphore = Semaphore(pool_size)
        super().__init__(**mysql_config)

    def get_connection(self):
        self._semaphore.acquire()
        return super().get_connection()

    def put_connection(self, con):
        con.close()  # con是PooledMySQLConnection的实例
        self._semaphore.release()


cnxpool = ReallyMySQLConnectionPool(**mysql_config, connection_timeout=30)


@contextmanager
def get_cursor():
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor()
        yield cursor
    except mysql.connector.Error as err:
        print('errno={}'.format(err))

    finally:
        cursor.close()
        cnxpool.put_connection(con)


class PyMysql(object):
    @staticmethod
    def get_all(sql):
        with get_cursor() as cursor:
            cursor.execute(sql)
            return cursor.fetchall()


if __name__ == '__main__':
    import time
    from concurrent.futures import ThreadPoolExecutor

    def t(n):
        r1 = PyMysql.get_all("select * from TABLE")
        print(str(n) + str(r1))

    s = time.time()
    with ThreadPoolExecutor(max_workers=15) as pool:
        for i in range(20):
            pool.submit(t, (i))

    print(time.time() - s)


@app.route("/api/attraction/<attractionId>")
def getAttraction(attractionId):

    db = my_pool.get_connection()
    cursor = db.cursor(buffered=True)
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
    cursor = db.cursor(buffered=True)

    page = int(request.args.get("page", 0))
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


@app.route("/api/user", methods=["GET", "POST", "PATCH", "DELETE"])
def user():
    db = my_pool.get_connection()
    cursor = db.cursor(buffered=True)

    if (request.method == "GET"):
        if "id" in session:
            mem_dict = {
                "id": session["id"],
                "name":  session["name"],
                "email":  session["email"]
            }
            stud_json = json.dumps(
                {"data": mem_dict}, indent=2, ensure_ascii=False)
        else:
            stud_json = json.dumps(
                {"data": None}, indent=2, ensure_ascii=False)
        db.close()
        return stud_json, 200
    elif (request.method == "POST"):
        data = request.get_json()
        sname = data['name']
        semail = data['email']
        spassword = data['password']
        cursor = db.cursor(buffered=True)
        sql = "SELECT `email` FROM `user` WHERE `email` = %s ;"
        check_user = (semail,)
        cursor.execute(sql, check_user)
        new_check = 0
        for check in cursor:
            new_check = check[0]
        if (new_check == semail):
            db.close()
            return jsonify({"error": True, "message": "The email has already been registered."}), 400
        else:
            sql = "INSERT INTO `user` (name, password, email) VALUES ( %s, %s, %s );"
            member_data = (sname, spassword, semail)
            cursor.execute(sql, member_data)
            db.commit()
            db.close()
            return jsonify({"ok": True}), 200
    elif (request.method == "PATCH"):
        data = request.get_json()
        uemail = data['email']
        upassword = data['password']
        cursor = db.cursor(buffered=True)
        sql = "SELECT `id`, `name`, `email`, `password` FROM `user` WHERE `email` = %s AND `password` = %s ;"
        check_data = (uemail, upassword)
        cursor.execute(sql, check_data)
        db.commit()
        rid = 0
        rname = 0
        remail = 0
        rpw = 0
        for id, name, email, pw in cursor:
            rid = id
            rname = name
            remail = email
            rpw = pw
        db.close()
        if (remail == uemail and rpw == upassword):
            session["id"] = rid
            session["name"] = rname
            session["email"] = remail
            print(session["id"])
            print(session["name"])
            print(session["email"])
            print('logged in')
            return jsonify({"ok": True}), 200
        else:
            return jsonify({"error": True, "message": "此帳號未註冊"}), 400
    elif (request.method == "DELETE"):
        session.pop("id", None)
        session.pop("name", None)
        session.pop("email", None)
        stud_json = json.dumps({"ok": True}, indent=2, ensure_ascii=False)
        print('logged out')
        db.close()
        return stud_json, 200


@app.route("/api/booking", methods=["GET", "POST", "DELETE"])
def api_booking():
	if(request.method == "GET"):
		if "id" in session:
			if "attractionId" in session:
				attraction_dict = {
					"id": session["attractionId"],
					"name": session["attr_name"],
					"address": session["attr_address"],
					"image": session["attr_img"]
				}
				get_dict = {"attraction": attraction_dict,
				    "date": session["date"], "time": session["time"], "price": session["price"]}

				stud_json = json.dumps({"data": get_dict}, indent=2, ensure_ascii=False)

				return stud_json, 200
			else:
				return jsonify({"data": None}), 200
		else:
			return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

	elif(request.method == "POST"):
		if "id" in session:
			data = request.get_json()

			session["attractionId"] = data["attractionId"]
			session["attr_name"] = data["name"]
			session["attr_address"] = data["address"]
			session["attr_img"] = data["image"]
			session["date"] = data["date"]
			session["time"] = data["time"]
			session["price"] = data["price"]
			return jsonify({"ok": True}), 200
		elif "id" not in session:
			return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
		else:
			return jsonify({"error": True, "message": "檔案建立失敗"}), 400

	elif(request.method == "DELETE"):
		if "id" in session:

			session.pop("attractionId", None)
			session.pop("attr_name", None)
			session.pop("attr_address", None)
			session.pop("attr_img", None)
			session.pop("date", None)
			session.pop("time", None)
			session.pop("price", None)

			return jsonify({"ok":True}), 200
		else:
			return jsonify({"error": True, "message":"未登入系統，拒絕存取"}), 403


@app.route("/api/orders", methods = ["POST"])
def order_post():
	db = my_pool.get_connection()
	cursor = db.cursor(buffered=True)
	if "id" in session:
		data = request.get_json()
		order_no = str(time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))) + str(time.time()).replace('.', '')[-4:]
		price = data["order"]["price"]
		attr_id = data["order"]["trip"]["attraction"]["id"]
		attr_name = data["order"]["trip"]["attraction"]["name"]
		attr_address = data["order"]["trip"]["attraction"]["address"]
		attr_image = data["order"]["trip"]["attraction"]["image"]
		go_date = data["order"]["trip"]["date"]
		go_time = data["order"]["trip"]["time"]
		contact_name = data["order"]["contact"]["name"]
		contact_email = data["order"]["contact"]["email"]
		contact_phone = data["order"]["contact"]["phone"]
		url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
		toTP = {
			"prime": data["prime"],
			"partner_key": os.getenv("PARTNER_KEY"),
			"merchant_id": os.getenv("MERCHANT_ID"),
			"details":"TapPay Test",
			"amount": price,
			"cardholder": {
				"phone_number": contact_phone,
				"name": contact_name,
				"email": contact_email,
			},
			"remember": True
		}
		head = {
			"Content-Type" : "application/json;",
			"x-api-key" : os.getenv("PARTNER_KEY")
			}
		send_TP = json.dumps(toTP, indent=2)
		Tprequest = requests.post(url, headers = head, data = send_TP)
		status = json.loads(Tprequest.text)["status"]

		if(status == 0): 
			status_message = "付款成功"
			session.pop("attractionId", None)
			session.pop("attr_name", None)
			session.pop("attr_address", None)
			session.pop("attr_img", None)
			session.pop("date", None)
			session.pop("time", None)
			session.pop("price", None)
		else: 
			status_message = "付款失敗"


		cursor = db.cursor(buffered=True)
		sql = """INSERT INTO `booking` (number, price, attr_id, attr_name, attr_address, attr_image, date, time, contact_name, contact_email, contact_phone, status)
				 VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s );"""
		booking_data = (order_no, price, attr_id, attr_name, attr_address, attr_image, go_date, go_time, contact_name, contact_email, contact_phone, status)
		cursor.execute(sql, booking_data)
		db.commit()   
		db.close()
		
		return jsonify({"data": {"number":order_no, "payment":{"status":status, "message":status_message}}}), 200
	elif "id" not in session:
		return jsonify({"error": True, "message":"未登入系統，拒絕存取"}), 403
	else:
		return jsonify({"error": True, "message":"訂單建立錯誤"}), 400


@app.route("/api/order/<orderNumber>", methods = ["GET"])
def order_get(orderNumber):
	db = my_pool.get_connection()
	cursor = db.cursor(buffered=True)

	if "id" in session:
		sql = "SELECT * FROM `booking` WHERE `number` = %s;"
		check = (orderNumber,)
		cursor.execute(sql, check)
		data = cursor.fetchall()
		cursor.close()

		if (data != []):

			for row in data:
				order = {
					"data":{
						"number" : row[1],
						"price" : row[2],
						"trip" : {
							"attraction" : {
								"id" : row[3],
								"name" : row[4],
								"address" : row[5],
								"image" : row[6]
							},
							"date" : row[7],
							"time" : row[8]
						},
						"contact" : {
							"name" : row[9],
							"email" : row[10],
							"phone" : row[11]
						},
						"status" : 0
					}
				}
			stud_json = json.dumps(order, indent=2, ensure_ascii=False)
			session.pop("attractionId", None)
			session.pop("attr_name", None)
			session.pop("attr_address", None)
			session.pop("attr_img", None)
			session.pop("date", None)
			session.pop("time", None)
			session.pop("price", None)
			return stud_json, 200
		else:
			stud_json = json.dumps({"data":None}, indent=2, ensure_ascii=False)
			return stud_json, 200
	else:
		return jsonify({"error": True, "message":"未登入系統，拒絕存取"}), 403


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
