module.exports = function (app, fs) {

    app.get('/', function (req, res) {
        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5
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
}