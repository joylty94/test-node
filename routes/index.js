module.exports = function (app, Book) {
    // books의 데이터를 조회 하는 API
    app.get('/api/books', function (req, res) {
        Book.find(function (err, books) { //.find 메소드 사용하여 books 파라미터에 값이 없으면 모두 출력.
            if (err) return res.status(500).send({ error: 'database failure' });
            res.json(books);
        })
    });

    // mongoDB books collection의 id 값을 사용하여 Document 출력 하기.
    app.get('/api/books/:book_id', function (req, res) {
        Book.findOne({ _id: req.params.book_id }, function (err, book) { // 하나의 Document만 출력하기 때문에 findOne 메소드 사용.
            if (err) return res.status(500).json({ error: err });
            if (!book) return res.status(404).json({ error: 'book not found' }); // Document가 없을 때 출력.
            res.json(book);
        })
    });

    // 파라미터 author 값에 매칭되는 값에 mongoDB projection기능을 사용하여 title과 Published_data만 출력.
    app.get('/api/books/author/:author', function (req, res) {
        Book.find({ author: req.params.author }, { _id: 0, title: 1, published_date: 1 }, function (err, books) {
            if (err) return res.status(500).json({ error: err });
            if (books.length === 0) return res.status(404).json({ error: 'book not found' });  // author가 없을때 출력.
            res.json(books);
        })
    });

    // 데이터 저장 하는 API
    app.post('/api/books', function (req, res) {
        var book = new Book();
        book.title = req.body.name;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);

        book.save(function (err) { //.save 메소드를 통해 저장
            if (err) {
                console.error(err);
                res.json({ result: 0 });
                return;
            }

            res.json({ result: 1 });

        });
    });

    // 파라미터 값으로 books 수정하는 API
    app.put('/api/books/:book_id', function (req, res) {
        Book.findById(req.params.book_id, function (err, book) { // id 값으로 수정될 부분 조회, 조회 할 필요가 없을 경우 update()메소드를 사용한다.
            if (err) return res.status(500).json({ error: 'database failure' });
            if (!book) return res.status(404).json({ error: 'book not found' });

            if (req.body.title) book.title = req.body.title;
            if (req.body.author) book.author = req.body.author;
            if (req.body.published_date) book.published_date = req.body.published_date;

            book.save(function (err) { // 대이터를 조회 한 후 변경하고 save()를 통하여 다시 저장.
                if (err) res.status(500).json({ error: 'failed to update' });
                res.json({ message: 'book updated' });
            });
        });
    });
    // update() 메소드 사용
    // app.put('/api/books/:book_id', function (req, res) {
    //     Book.update({ _id: req.params.book_id }, { $set: req.body }, function (err, output) {
    //         if (err) res.status(500).json({ error: 'database failure' });
    //         console.log(output);
    //         if (!output.n) return res.status(404).json({ error: 'book not found' });
    //         res.json({ message: 'book updated' });
    //     })
    // });

    // DELETE BOOK
    app.delete('/api/books/:book_id', function (req, res) {
        Book.remove({ _id: req.params.book_id }, function (err, output) {
            if (err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "book not found" });
            res.json({ message: "book deleted" });
            삭제 기능은 데이터가 조회되어 삭제 성공하던, 테이터가 조회되어 지지 않아 삭제를
            실패하건 같은 결과 값이 같다.
            때문에 반환 값이 필요 없다.
            */
            res.status(204).end(); // 204 HTTP status는 요청 작업을 수행 하고 반환할 데이터가 없음을 뜻한다.
        })
    });

}