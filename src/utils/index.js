const {CodeRun,CodeSubmit} = require("./CodeExecution");

const DockerContainerMap = {
    "cpp":'cpp_runner',
}

const codeRunExecution = async ({sourceCode,stdInput,language,timeLimit,memoryLimit,cpuCoreLimit})=>{
    try {
        const containerName = DockerContainerMap[language];
        return await CodeRun({sourceCode,stdInput,timeLimit,memoryLimit,cpuCoreLimit,containerName,language});
    } catch (error) {
        throw error;
    }
}

const codeSubmitExecution = async ({language,sourceCode,inputTestcase,timeLimit,memoryLimit})=>{
    try {
        const containerName = DockerContainerMap[language];
        return await CodeSubmit({sourceCode,inputTestcase,timeLimit,memoryLimit,containerName,language});
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {codeRunExecution,codeSubmitExecution};