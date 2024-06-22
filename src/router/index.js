const router = require("express").Router();
const {codeSubmission} = require("../controller/codeSubmission-controller");

router.post('/submission',codeSubmission);

module.exports = router;