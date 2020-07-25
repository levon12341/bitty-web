var express = require('express')
var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(appRoot + '/public/index.html');
});

module.exports = router;