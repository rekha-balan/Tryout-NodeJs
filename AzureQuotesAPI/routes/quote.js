var router = require('express').Router();
var TYPES = require('tedious').TYPES;

/* GET task listing. */
router.get('/', function (req, res) {

    if (req.query.category === undefined) {

        req.sql("select * from quote for json path")
            .into(res, '[]');
    }
    else {

        req.sql("select * from quote where category = @category for json path")
            .param('category', req.query.category, TYPES.NVarChar)
            .into(res, '[]');
    }

});

/* GET single task. */
router.get('/:id', function (req, res) {

    req.sql("select * from quote where id = @id for json path, without_array_wrapper")
        .param('id', req.params.id, TYPES.Int)
        .into(res, '{}');

});

/* POST create task. */
router.post('/', function (req, res) {

    req.sql("exec createquote @quote")
        .param('quote', JSON.stringify(req.body), TYPES.NVarChar)
        .exec(res);

});

/* PUT update task. */
router.put('/:id', function (req, res) {

    req.sql("exec updatequote @id, @quote")
        .param('id', req.params.id, TYPES.Int)
        .param('quote', JSON.stringify(req.body), TYPES.NVarChar)
        .exec(res);

});

/* DELETE single task. */
router.delete('/:id', function (req, res) {

    req.sql("delete from quote where id = @id")
        .param('id', req.params.id, TYPES.Int)
        .exec(res);

});

module.exports = router;