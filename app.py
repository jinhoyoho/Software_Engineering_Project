from flask import Flask, request, jsonify, redirect, url_for, render_template
from flask_session import Session
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from bson.json_util import dumps
import datetime


app = Flask(__name__)
app.secret_key = 'software_engineering'
# CORS 설정에서 credentials 허용
CORS(app)

session_list = dict()

# MongoDB 설정
client = MongoClient(
    "mongodb+srv://jinhoyoho:000406@cluster0.uncddjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['your_database']
users = db['users']
posts = db['posts']
dms = db['dms']


# 파일 업로드 설정
UPLOAD_FOLDER = './static/images/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return redirect('http://localhost:3000/')


# 회원가입 -> 완료
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    password_confirm = data.get('password_confirm')

    if not username or not password or not password_confirm:
        return jsonify({'message': '빈칸을 모두 채워주세요.'}), 400

    if users.find_one({'username': username}):
        return jsonify({'message': '이미 아이디가 존재합니다.'}), 400

    if password != password_confirm:
        return jsonify({'message': '패스워드가 일치하지 않습니다.'}), 400

    users.insert_one({
        'username': username,
        'password': generate_password_hash(password)
    })

    return jsonify({'message': "회원가입이 완료되었습니다. 로그인 해주세요.",
                    'redirect_url': 'http://localhost:3000/'}), 200


# 로그인 -> 완료
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': '빈칸을 모두 채워주세요.'}), 400

    user = users.find_one({'username': username})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'ID 혹은 비밀번호가 틀렸습니다.'}), 400

    # session['user_type'] = 'user'  # 로그인 유형을 세션에 저장
    session_list['username'] = username  # 아이디 저장

    # 로그인 성공 시 세션 정보와 함께 응답
    return jsonify({'message': f"{username}님, 환영합니다!",
                    'redirect_url': 'http://localhost:3000/main'}), 200


# 게스트 로그인 -> 완료
@app.route('/guest_login', methods=['GET'])
def guest_login():
    # session_list['user_type'] = 'guest'
    return jsonify({'message': '게스트로 로그인합니다.', 'redirect_url': 'http://localhost:3000/guest'}), 200


# 로그아웃 -> 완료
@app.route('/logout', methods=['GET'])
def logout():
    session_list.pop('username', None)
    session_list.pop('user_type', None)
    return jsonify({'message': "안전하게 로그아웃 되었습니다.", 'redirect_url': "http://localhost:3000/"})


# 세션 정보 확인 -> 디버깅용
@app.route('/session_info', methods=['GET'])
def session_info():
    return jsonify({'session_info': session_list}), 200


# 아이디 로그인한 사람 조회 -> 완료
@app.route('/user', methods=['GET'])
def get_user():
    if 'username' in session_list:
        user = users.find_one({'username': session_list['username']})
        if user:
            return jsonify({'username': user['username']}), 200

    return jsonify({'message': 'User not logged in'}), 200


# 유저 리스트 조회 -> 완료
@app.route('/userlists', methods=['GET'])
def get_users():
    user_list = users.find({}, {'_id': 0, 'password': 0})  # password는 반환하지 않음
    return jsonify({'userlist': list(user_list)}), 200


# 사진 리스트 조회 -> 완료
@app.route('/postlists', methods=['GET'])
def postlists():
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403

    # user = users.find_one({'username'})
    # if not user:
    #     return jsonify({'message': 'User not found'}), 404

    post_list = posts.find({}, {'_id': 0})
    post_list = list(post_list)

    return dumps({"postlist": post_list, "message": "complete message"}), 200


# 사진, hashtag, text 업로드 -> 완료
@ app.route('/upload', methods=['POST'])
def upload_file():
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403

    if 'file' not in request.files:
        return jsonify({'message': '파일이 올바르지 않습니다.'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': '파일이 선택되지 않았습니다.'}), 400

    if file and allowed_file(file.filename):
        extension = file.filename.split('.')[-1]

        # static 폴더에 저장될 파일 이름 생성하기
        today = datetime.datetime.now()
        mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
        filename = f'file-{mytime}'
        # 확장자 나누기
        extension = file.filename.split('.')[-1]
        # static 폴더에 저장
        save_to = f'static/{filename}.{extension}'
        file.save(save_to)

        text = request.form.get('text')
        hashtags = [value for key, value in request.form.items()
                    if 'hashtags[' in key]

        # 파일을 MongoDB에 저장
        image_data = {
            'username': session_list['username'],
            'file': f'{filename}.{extension}',
            'text': text,
            'hashtags': hashtags
        }

        posts.insert_one(image_data)

        return jsonify({'message': '게시글이 작성되었습니다!',
                        "redirect_url": "http://localhost:3000/main"}), 200

    # if len(keywords) >= 10:
    #     return jsonify({'message': 'Keyword must be less than 10 characters'}), 400

    # else:
    #     return jsonify({'message': 'Allowed file types are png, jpg, jpeg, gif'}), 400


# 내가 업로드한 사진 조회
@ app.route('/my_posts/<username>', methods=['GET'])
def get_my_posts(username):
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    my_posts = posts.find({'username': username}, {'_id': 0})
    return jsonify(list(my_posts)), 200


# 내가 업로드한 사진 수정
@ app.route('/my_posts/<username>/<filename>', methods=['PUT'])
def update_my_post(username, filename):
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    file = request.files['file']
    description = request.form.get('description')
    keywords = request.form.get('keywords')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        posts.update_one({'username': username, 'filename': filename}, {'$set': {
                         'filename': filename, 'description': description, 'keywords': keywords}})
        return jsonify({'message': 'Post successfully updated'}), 200
    else:
        return jsonify({'message': 'Invalid file'}), 400


# 키워드 검색
@ app.route('/search', methods=['POST'])
def search_posts():
    data = request.get_json()  # 요청의 JSON 바디에서 데이터 추출
    keyword = data.get('keyword', '')  # 'keyword' 값 추출, 없으면 빈 문자열 반환
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    if len(keyword) >= 10:
        return jsonify({'message': 'Keyword must be less than 10 characters'}), 400
    keyword = '#' + keyword  # 키워드 앞에 #을 붙여줌
    matching_posts = posts.find({'keywords': {'$regex': keyword}}, {'_id': 0})
    matching_posts_list = list(matching_posts)
    if not matching_posts_list:
        return jsonify({'message': 'No results found for input keyword'}), 200
    return jsonify(list(matching_posts)), 200


# dm 전송
@ app.route('/dm', methods=['POST'])
def send_dm():
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    sender = request.form.get('sender')
    receiver = request.form.get('receiver')
    message = request.form.get('message')
    dms.insert_one(
        {'sender': sender, 'receiver': receiver, 'message': message})
    return jsonify({'message': 'DM successfully sent'}), 200


# dm 조회
@ app.route('/dm/<username>', methods=['GET'])
def get_dms(username):
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    user_dms = dms.find({'receiver': username}, {'_id': 0})
    return jsonify(list(user_dms)), 200


# dm 답장
@ app.route('/dm/<username>/<dm_id>', methods=['PUT'])
def reply_dm(username, dm_id):
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    reply = request.form.get('reply')
    dms.update_one({'_id': dm_id, 'receiver': username},
                   {'$set': {'reply': reply}})
    return jsonify({'message': 'DM successfully replied'}), 200


# dm 삭제
@ app.route('/dm/<username>/<dm_id>', methods=['DELETE'])
def delete_dm(username, dm_id):
    # if session_list.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    dms.delete_one({'_id': dm_id, 'sender': username})
    return jsonify({'message': 'DM successfully deleted'}), 200


if __name__ == '__main__':
    app.run(debug=True)
