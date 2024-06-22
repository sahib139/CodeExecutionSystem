const {cppCodeExecution} = require("./cppFiles/cppCodeExecution");

const languageMap = {
    'cpp':cppCodeExecution,
}

const codeExecution = (sourceCode,stdInput,language)=>{
    return languageMap[language](sourceCode,stdInput);
}

module.exports = {codeExecution};