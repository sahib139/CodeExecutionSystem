const Questions = require("../models/question");
const {AppDataSource} = require("../config/database-config");
const {codeSubmitExecution,codeRunExecution} = require("../utils/index");

class SubmissionService{
    
    constructor(){  
        this.questionRepository = AppDataSource.getRepository(Questions);
    }

    async run(sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit){
        try {
            return await codeRunExecution({sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit});
        } catch (error) {
            console.log("Error during running of code due to "+error);
            return error;
        }
    }

    async submit(quesID,sourceCode,language){
        try {
            const question = await this.questionRepository.findOneBy({id:quesID});

            if (!question) {
                throw "Question not found";
            }

            let  inputTestcase  = JSON.parse(question.inputTestcases);
            inputTestcase = inputTestcase.map((testcase)=>{
                return testcase.replace(/\n/g, ' ');
            });

            const UserTestCaseOutput = await codeSubmitExecution({language,sourceCode,inputTestcase,timeLimit:question.timeLimit,memoryLimit:question.memoryLimit});

            if(UserTestCaseOutput.slice(0,6)=='stderr'){
                return UserTestCaseOutput;
            }
            
            const user_output = UserTestCaseOutput.split('ALL_TEST_CASES_OUTPUT:\n');
            const userTestResult = user_output[1].split('\nENDENDEND\n');
            userTestResult.pop()

            // Now check if the output matches the CorrectOutput
            const AllTestCaseMatches = (JSON.parse(question.outputResult)).toString() === userTestResult.toString();

            // also check if each output of the test case is under timeLimit

            
            // return "results";
            return user_output[0]+`\nSUCCESS:${AllTestCaseMatches}`;

        } catch (error) {
            console.log("Error during submission of code due to "+error);
            return error;
        }
    }

}

module.exports = SubmissionService;