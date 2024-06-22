const {codeExecution} = require("../utils/index");

const codeSubmission = async (req,res)=>{
    try {
        const sourceCode = req.body.sourceCode;
        const stdInput = req.body.input;
        const language = req.body.language;  
        const response = await codeExecution(sourceCode,stdInput,language);
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
    codeSubmission,
}