const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function cppCodeExecution(sourceCode, stdInput,timeLimit,memoryLimit,cpuCoreLimit) {
    return new Promise((resolve, reject) => {
        const currentDir = process.cwd();
        const cppDir = path.join(currentDir, 'src','utils','cppFiles');
        fs.writeFileSync(path.join(cppDir, 'myprogram.cpp'), sourceCode);
        fs.writeFileSync(path.join(cppDir, 'input.txt'), stdInput);

        if(!cpuCoreLimit){
            cpuCoreLimit = 1.0;
        }
        if(!timeLimit){
            timeLimit = 5;
        }
        if(!memoryLimit){
            memoryLimit = 256 // in MB
        }

        const command = `sudo docker run --rm --cpus="${cpuCoreLimit}" --memory="${memoryLimit}m" -v ${cppDir}/myprogram.cpp:/app/myprogram.cpp -v ${cppDir}/input.txt:/app/input.txt code_execution myprogram.cpp input.txt ${timeLimit}`;

        exec(command, (error, output) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                reject(`Error: Unable to execute docker Command`);
                return;
            }
            if(output.slice(0,5)=='Error'){
                reject(`stderr: ${output}`)
            }
            resolve(`stdout: ${output}`);
        });
    });
}

module.exports = {
    cppCodeExecution,
};
