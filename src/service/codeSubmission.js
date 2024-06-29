const Questions = require("../models/question");
const {AppDataSource} = require("../config/database-config");
const {codeSubmitExecution,codeRunExecution} = require("../utils/index");

class SubmissionService{
    
    constructor(){  
        this.questionRepository = AppDataSource.getRepository(Questions);
    }

    #convertTimeToSeconds(timeString) {
        const timeParts = timeString.split(/[m\s]/).filter(Boolean);
        const minutes = parseFloat(timeParts[0]);
        const seconds = parseFloat(timeParts[1]);
        return minutes * 60 + seconds;
    }

    #splitOutput(output) {
        try {
            
            const parts = output.split(/(?=ALL_TEST_CASES_OUTPUT:|ALL_TEST_CASES_TIMING|ALL_TEST_CASES_MEMORY)/);
        
            const stdout = parts[0].split(/(?=ALL_TEST_CASES_OUTPUT:)/)[0].trim();
            const allTestsOutput = parts.find(part => part.startsWith("ALL_TEST_CASES_OUTPUT:")).split("ALL_TEST_CASES_OUTPUT:")[1].trim();
            const allTestsTiming = parts.find(part => part.startsWith("ALL_TEST_CASES_TIMING")).split("ALL_TEST_CASES_TIMING")[1].trim();
            const allTestsMemory = parts.find(part => part.startsWith("ALL_TEST_CASES_MEMORY")).split("ALL_TEST_CASES_MEMORY")[1].trim();
            
            const outputArray = allTestsOutput.split("ENDENDEND").map(item => item.trim()).filter(item => item.length > 0);
            const timingArray = allTestsTiming.split("ENDENDEND").map(item => item.trim()).filter(item => item.length > 0).map(this.#convertTimeToSeconds);
            const memoryArray = allTestsMemory.split("ENDENDEND").map(item => parseFloat(item.trim()) / 1024).filter(item => !isNaN(item));
            
            return {
                stdout,
                outputArray,
                timingArray,
                memoryArray
            };
        } catch (error) {
            throw error; 
        }
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

            const {stdout,outputArray,timingArray,memoryArray} = this.#splitOutput(UserTestCaseOutput);

            const AllTestCaseMatches = (JSON.parse(question.outputResult)).toString() === outputArray.toString();

            const AllTestCaseTimingMatches = timingArray.every((testcaseTiming)=> testcaseTiming <= (question.timeLimit));

            const AllTestCaseMemoryMatches = memoryArray.every((testcaseMemory) => testcaseMemory <= (question.memoryLimit));;

            return stdout+`\nOUTPUT_SUCCESS:${AllTestCaseMatches}\nTIME_SUCCESS:${AllTestCaseTimingMatches}\nMEMORY_SUCCESS:${AllTestCaseMemoryMatches}`;

        } catch (error) {
            console.log("Error during submission of code due to "+error);
            return error;
        }
    }

}

module.exports = SubmissionService;