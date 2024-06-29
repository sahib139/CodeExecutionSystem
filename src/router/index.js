const router = require("express").Router();
const {codeRunner,codeSubmission} = require("../controller/codeSubmission-controller");

router.post('/run',codeRunner);
router.post("/submit",codeSubmission);

module.exports = router;