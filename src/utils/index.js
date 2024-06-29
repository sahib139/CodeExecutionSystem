const {CodeRun,CodeSubmit} = require("./CodeExecution");

const DockerContainerMap = {
    "cpp":'cpp_runner',
}

const codeRunExecution = ({sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit})=>{
    try {
        const containerName = DockerContainerMap[language];
        return CodeRun({sourceCode,stdInput,timeLimit,memoryLimit,cpuCoreLimit,containerName,language});
    } catch (error) {
        return new Error("Unable to find the corresponding Language\nError :"+error);
    }
}

const codeSubmitExecution = ({language,sourceCode,inputTestcase,timeLimit,memoryLimit})=>{
    try {
        const containerName = DockerContainerMap[language];
        return CodeSubmit({sourceCode,inputTestcase,timeLimit,memoryLimit,containerName,language});
    } catch (error) {
        return new Error("Unable to find the corresponding Language\nError :"+error);
    }
}

module.exports = {codeRunExecution,codeSubmitExecution};