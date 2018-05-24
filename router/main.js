module.exports = function (app, fs) {

    app.get('/', function (req, res) {
        var sess = req.session;
        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5,
            name: sess.name,
            username: sess.username
        })
    });

    app.get('/list', function (req, res) {
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
            console.log(data);
            res.end(data);
        });
    })

    app.get('/getUser/:username', function (req, res) {
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function (req, res) {

        var result = {};
        var username = req.params.username;

        // 입력 값이 모두 입력 되었는지 검사(password와 name)
        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // data에 중복 값있는지 검사
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            if (users[username]) {
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // users 객체에 요청 json 저장
            users[username] = req.body;

            // data users 저장 후 success 응답
            fs.writeFile(__dirname + "/../data/user.json",
                JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                    result = { "success": 1 };
                    res.json(result);
                })
        })
    });

    app.put('/updateUser/:username', function (req, res) {

        var result = {};
        var username = req.params.username;

        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json",
                JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                    result = { "success": 1 };
                    res.json(result);
                })
        })
    });

    app.delete('/deleteUser/:username', function (req, res) {
        var result = {};
        //data 불러오기
        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);

            // data에 username이 없는 경우
            if (!users[req.params.username]) {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username]; // users 객체의 username 삭제
            fs.writeFile(__dirname + "/../data/user.json", // data에 저장
                JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                    result["success"] = 1;
                    res.json(result);
                    return;
                })
        })
    })
    // 세션 초기 설정
    app.get('/', function (req, res) {
        sess = req.session;
        console.log(sess.username);
    });
    // 세션 변수 설정
    app.get('/login', function (req, res) {
        sess = req.session;
        sess.username = "Lee" // sess.[키 이름] = 값으로 변수를 설정한다.
    });

    //로그인
    app.get('/login/:username/:password', function (req, res) {
        var sess;
        sess = req.session; // 세션 받기

        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if (!users[username]) { // users 객체의 username이 없을 경우
                // USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if (users[username]["password"] == password) { // users 객체 안에 username안에 password 비교
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);

            } else {
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });

    // 로그아웃
    app.get('/logout', function (req, res) {
        sess = req.session;
        if (sess.username) { // sess.username 변수가 있을 경우
            req.session.destroy(function (err) { // 세션 삭제
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
        } else {
            res.redirect('/');
        }
    })
}