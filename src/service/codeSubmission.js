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

    #splitRunOutput(output){
        const executionOutputMatch = output.match(/Execution Output:\n(.*?)\n/);
        const timingInfoMatch = output.match(/Timing Information:\s*(.*?)\s*\n/);
        const cpuUsageMatch = output.match(/CPU Usage:\s*(.*?)\s*\n/);
        const memoryUsageMatch = output.match(/Memory Usage:\s*(.*?)\s*\n/);

        const executionOutput = executionOutputMatch ? executionOutputMatch[1].trim() : null;
        const timingInfo = timingInfoMatch ? timingInfoMatch[1].trim() : null;
        const cpuUsage = cpuUsageMatch ? cpuUsageMatch[1].trim() : null;
        const memoryUsage = memoryUsageMatch ? memoryUsageMatch[1].trim() : null;

        return {
            executionOutput,
            timingInfo,
            cpuUsage,
            memoryUsage
        }

    }
    
    #splitSubmitOutput(output) {
        try {
            const parts = output.split(/(?=ALL_TEST_CASES_OUTPUT:|ALL_TEST_CASES_TIMING|ALL_TEST_CASES_MEMORY|ALL_TEST_CASES_CPU)/);
    
            const stdout = parts[0].split(/(?=ALL_TEST_CASES_OUTPUT:)/)[0].trim();
            const allTestsOutput = parts.find(part => part.startsWith("ALL_TEST_CASES_OUTPUT:")).split("ALL_TEST_CASES_OUTPUT:")[1].trim();
            const allTestsTiming = parts.find(part => part.startsWith("ALL_TEST_CASES_TIMING")).split("ALL_TEST_CASES_TIMING")[1].trim();
            const allTestsMemory = parts.find(part => part.startsWith("ALL_TEST_CASES_MEMORY")).split("ALL_TEST_CASES_MEMORY")[1].trim();
            const allTestsCpu = parts.find(part => part.startsWith("ALL_TEST_CASES_CPU")).split("ALL_TEST_CASES_CPU")[1].trim();
    
            const outputArray = allTestsOutput.split("ENDENDEND").map(item => item.trim()).filter(item => item.length > 0);
            const timingArray = allTestsTiming.split("ENDENDEND").map(item => item.trim()).filter(item => item.length > 0).map(this.#convertTimeToSeconds);
            const memoryArray = allTestsMemory.split("ENDENDEND").map(item => parseFloat(item.trim()) / 1024).filter(item => !isNaN(item));
            const cpuArray = allTestsCpu.split("ENDENDEND").map(item => parseFloat(item.trim().replace('%', ''))).filter(item => !isNaN(item));
    
            return {
                stdout,
                outputArray,
                timingArray,
                memoryArray,
                cpuArray
            };
        } catch (error) {
            throw error; 
        }
    }
    

    async run(sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit){
        try {
            const UserOutput =  await codeRunExecution({sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit});
            
            if(UserOutput.slice(0,6)=='stderr'){
                return UserOutput;
            }

            const {executionOutput,timingInfo,cpuUsage,memoryUsage} = this.#splitRunOutput(UserOutput);

            console.log({
                stdInput,
                stdOutput:executionOutput,
                RunningTime:timingInfo,
                CpuUsage:cpuUsage,
                MemoryUsage:memoryUsage,
            });

            return {
                stdInput,
                stdOutput:executionOutput,
                RunningTime:timingInfo,
                CpuUsage:cpuUsage,
                MemoryUsage:memoryUsage,
            }

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

            const {stdout,outputArray,timingArray,memoryArray,cpuArray} = this.#splitSubmitOutput(UserTestCaseOutput);

            const JudgeOutput = JSON.parse(question.outputResult);

            const response = [];
            for(let i=0;i<inputTestcase.length;i++){
                response.push({
                    stdInput:inputTestcase[i],
                    stdOutput:outputArray[i],
                    judgeOutput:JudgeOutput[i],
                    RunningTime:`${timingArray[i]} sec`,
                    CpuUsage:`${cpuArray[i]} %`,
                    MemoryUsage:`${memoryArray[i]} MB`,
                    success: ((question.timeLimit>=timingArray[i])&&(question.memoryLimit>=memoryArray[i])&&JudgeOutput[i]===outputArray[i]),
                });
            }
            return response;

        } catch (error) {
            console.log("Error during submission of code due to "+error);
            return error;
        }
    }

}

module.exports = SubmissionService;