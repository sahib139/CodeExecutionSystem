const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function cppCodeExecution(sourceCode, stdInput) {
    return new Promise((resolve, reject) => {
        const currentDir = process.cwd();
        const cppDir = path.join(currentDir, 'src','utils','cppFiles');
        fs.writeFileSync(path.join(cppDir, 'myprogram.cpp'), sourceCode);
        fs.writeFileSync(path.join(cppDir, 'input.txt'), stdInput);

        const command = `sudo docker run --rm -v ${cppDir}/myprogram.cpp:/app/myprogram.cpp -v ${cppDir}/input.txt:/app/input.txt code_execution myprogram.cpp input.txt`;

        exec(command, (error, output) => {
            if (error) {
                reject(`Error: ${error.message}`);
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
