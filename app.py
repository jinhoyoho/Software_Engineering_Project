from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = 'software_engineering'

CORS(app, supports_credentials=True)


# MongoDB 설정
client = MongoClient(
    "mongodb+srv://edwardoh99:991020@cluster0.jdvgvlb.mongodb.net/")
db = client['your_database']
users = db['users']
posts = db['posts']
dms = db['dms']

user = "jinho"  # 테스트 코드


# 파일 업로드 설정
UPLOAD_FOLDER = '/path/to/upload/directory'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return redirect('http://localhost:3000/')


# 회원가입
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    password_confirm = data.get('password_confirm')

    if not username or not password or not password_confirm:
        return jsonify({'message': '빈칸을 모두 채워주세요.'}), 400

    # MongoDB가 있어야 실행가능
    # if users.find_one({'username': username}):
    #     return jsonify({'message': '이미 아이디가 존재합니다.'}), 400

    if password != password_confirm:
        return jsonify({'message': '패스워드가 일치하지 않습니다.'}), 400

    # users.insert_one({
    #     'username': username,
    #     'password': generate_password_hash(password)
    # })

    return jsonify({'message': "회원가입이 완료되었습니다. 로그인 해주세요.",
                    'redirect_url': 'http://localhost:3000/'}), 200


# 로그인
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': '빈칸을 모두 채워주세요.'}), 400

    # user = users.find_one({'username': username})

    # if not user or not check_password_hash(user['password'], password):
    #     return jsonify({'message': 'ID 혹은 비밀번호가 틀렸습니다.'}), 400

    session['user_type'] = 'user'  # 로그인 유형을 세션에 저장
    return redirect(url_for('main', username=user))


# 메인화면
@app.route('/main/<username>')
def main(username):
    # user = users.find_one({'username': username})
    return jsonify({'message': f"{username}님, 환영합니다!", 'redirect_url': 'http://localhost:3000/main/{username}'}), 200


# 게스트 로그인
@app.route('/guest_login', methods=['GET'])
def guest_login():
    session['user_type'] = 'guest'
    return jsonify({'message': '게스트로 로그인합니다.', 'redirect_url': 'http://localhost:3000/guest'}), 200


# 로그아웃
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session.pop('user_type', None)
    return jsonify({'message': "안전하게 로그아웃 되었습니다.", 'redirect_url': "http://localhost:3000/"})


# 아이디 로그인한 사람 조회
@app.route('/user', methods=['GET'])
def get_user():

    return jsonify({"username": user})

    # if 'username' in session:
    # user = users.find_one({'username': session['username']})
    #     if user:
    #         return jsonify({'username': user['username']}), 200
    # return jsonify({'message': 'User not logged in'}), 401

    # 유저 리스트 조회


@app.route('/userlists', methods=['GET'])
def get_users():
    user_list = users.find({}, {'_id': 0, 'password': 0})  # password는 반환하지 않음
    return jsonify(list(user_list)), 200

# 사진 리스트 조회


@app.route('/userlists/<username>/postlists', methods=['GET'])
def get_user_posts(username):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403

    user = users.find_one({'username': username})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    post_list = posts.find({'username': username}, {'_id': 0})
    return jsonify(list(post_list)), 200

# 업로드 페이지로 이동


@app.route('/go_upload', methods=['POST'])
def go_upload():
    # username을 db에서 뽑으면 됨
    username = "jinho"
    return jsonify({'redirect_url': 'http://localhost:3000/upload/{username}'}), 200


@ app.route('/upload', methods=['POST'])
def upload_file():
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403

    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        description = request.form.get('description')
        keywords = request.form.get('keywords')

        if len(keywords) >= 10:
            return jsonify({'message': 'Keyword must be less than 10 characters'}), 400
        posts.insert_one({
            'filename': filename,
            'description': description,
            'keywords': keywords
        })
        return jsonify({'message': 'File successfully uploaded'}), 200

    else:
        return jsonify({'message': 'Allowed file types are png, jpg, jpeg, gif'}), 400

# 내가 업로드한 사진 조회


@ app.route('/my_posts/<username>', methods=['GET'])
def get_my_posts(username):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
    my_posts = posts.find({'username': username}, {'_id': 0})
    return jsonify(list(my_posts)), 200

# 내가 업로드한 사진 수정


@ app.route('/my_posts/<username>/<filename>', methods=['PUT'])
def update_my_post(username, filename):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
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
    # if session.get('user_type') == 'guest':
    #     return jsonify({'message': 'Access denied'}), 403
    # if len(keyword) >= 10:
    #     return jsonify({'message': 'Keyword must be less than 10 characters'}), 400
    # keyword = '#' + keyword  # 키워드 앞에 #을 붙여줌
    # matching_posts = posts.find({'keywords': {'$regex': keyword}}, {'_id': 0})
    # matching_posts_list = list(matching_posts)
    # if not matching_posts_list:
    #     return jsonify({'message': 'No results found for input keyword'}), 200
    # return jsonify(list(matching_posts)), 200

    return jsonify({'message': f'{keyword}에 대한 검색 결과입니다.'})


# dm으로 이동
@app.route('/go_dm', methods=['POST'])
def go_dm():
    # username을 db에서 뽑으면 됨
    username = "jinho"
    return jsonify({'redirect_url': 'http://localhost:3000/DirectMessage/{username}'}), 200


# dm 전송
@ app.route('/dm', methods=['POST'])
def send_dm():
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
    sender = request.form.get('sender')
    receiver = request.form.get('receiver')
    message = request.form.get('message')
    dms.insert_one(
        {'sender': sender, 'receiver': receiver, 'message': message})
    return jsonify({'message': 'DM successfully sent'}), 200


# dm 조회


@ app.route('/dm/<username>', methods=['GET'])
def get_dms(username):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
    user_dms = dms.find({'receiver': username}, {'_id': 0})
    return jsonify(list(user_dms)), 200

# dm 답장


@ app.route('/dm/<username>/<dm_id>', methods=['PUT'])
def reply_dm(username, dm_id):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
    reply = request.form.get('reply')
    dms.update_one({'_id': dm_id, 'receiver': username},
                   {'$set': {'reply': reply}})
    return jsonify({'message': 'DM successfully replied'}), 200

# dm 삭제


@ app.route('/dm/<username>/<dm_id>', methods=['DELETE'])
def delete_dm(username, dm_id):
    if session.get('user_type') == 'guest':
        return jsonify({'message': 'Access denied'}), 403
    dms.delete_one({'_id': dm_id, 'sender': username})
    return jsonify({'message': 'DM successfully deleted'}), 200


if __name__ == '__main__':
    app.run(debug=True)
