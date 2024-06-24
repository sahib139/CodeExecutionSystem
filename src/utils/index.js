const {cppCodeExecution} = require("./cppFiles/cppCodeExecution");

const languageMap = {
    'cpp':cppCodeExecution,
}

const codeExecution = (sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit)=>{
    return languageMap[language](sourceCode,stdInput,timeLimit,memoryLimit,cpuCoreLimit);
}

module.exports = {codeExecution};