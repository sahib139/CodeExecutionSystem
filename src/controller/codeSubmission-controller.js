const SubmissionService = require("../service/codeSubmission");
const submissionService = new SubmissionService();

const codeRunner = async (req,res)=>{
    try {
        const sourceCode = req.body.sourceCode;
        const stdInput = req.body.input;
        const language = req.body.language;  
        const timeLimit = req.body.timeLimit;
        const memoryLimit = req.body.memoryLimit;
        const cpuCoreLimit = req.body.cpuCoreLimit;
        const response = await submissionService.run(sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit);
        return res.status(200).json({
            data:response,
            err:'',
            msg:'Successfully executed',
        });
    } catch (error) {
        return res.status(500).json({
            data:'',
            err:error,
            msg:'Successfully executed',
        });
    }
}

const codeSubmission = async (req,res)=>{
    try {
        // questionID,sourceCode,language
        const sourceCode = req.body.sourceCode;
        const language = req.body.language;  
        const quesID = parseInt(req.body.questionID);
        const response  = await submissionService.submit(quesID,sourceCode,language);
        return res.status(200).json({
            data:response,
            err:'',
            msg:'Successfully executed',
        });
    } catch (error) {
        return res.status(500).json({
            data:'',
            err:error,
            msg:'Successfully executed',
        });
    }

}

module.exports={
    codeRunner,
    codeSubmission
}