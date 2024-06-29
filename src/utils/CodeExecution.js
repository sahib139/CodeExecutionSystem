const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateUniqueString() {
    try {
        const now = new Date();
        const randomNum = Math.floor(Math.random() * 100000);
        return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}_${randomNum}`;
    } catch (error) {
        throw "Unable to create unique due to Error:"+error;
    }
}


async function CodeRun({sourceCode, stdInput, timeLimit, memoryLimit, cpuCoreLimit,language,containerName}) {
    try {
        return new Promise((resolve, reject) => {
            
            const uniqueString = generateUniqueString();
            
            const sourceFileName = `myprogram_${uniqueString}.${language}`;
            const inputFileName = `input_${uniqueString}.txt`;
            
            fs.writeFileSync(path.join(__dirname,`${language}Files` ,sourceFileName), sourceCode);
            fs.writeFileSync(path.join(__dirname,`${language}Files`, inputFileName), stdInput);
    
            if (!cpuCoreLimit) {
                cpuCoreLimit = 1.0;
            }
            if (!timeLimit) {
                timeLimit = 5;
            }
            if (!memoryLimit) {
                memoryLimit = 256; // in MB
            }
            const command = `sudo docker run --rm --cpus="${cpuCoreLimit}" --memory="${memoryLimit}m" -v ${__dirname}/${language}Files/run.sh:/app/compile_and_run.sh -v ${__dirname}/${language}Files/${sourceFileName}:/app/myprogram.${language} -v ${__dirname}/${language}Files/${inputFileName}:/app/input.txt ${containerName} myprogram.${language} input.txt ${timeLimit}`;
            
            exec(command, (error, output) => {

                fs.unlinkSync(path.join(__dirname,`${language}Files` ,sourceFileName));
                fs.unlinkSync(path.join(__dirname,`${language}Files`, inputFileName));
    
                if (error) {
                    console.log(`Error: ${error.message}`);
                    reject(`Error: Unable to run the code!!`);
                }

                if(output.slice(0,5)=='Error'){
                    console.log(output);
                    resolve(`stderr: ${output}`)
                }

                resolve(`stdout: ${output}`);
            });
        });
    } catch (error) {
        console.log("Unable to execute the code.\nError:"+error);
        throw "Unable to execute the code.\nError:";
    }
}

async function CodeSubmit({sourceCode, inputTestcase, timeLimit, memoryLimit,language,containerName}) {
    try {
        return new Promise((resolve, reject) => {
            
            const uniqueString = generateUniqueString();

            const sourceFileName = `myprogram_${uniqueString}.${language}`; 
            const inputFileName = `inputTestCases_${uniqueString}.txt`;
            
            fs.writeFileSync(path.join(__dirname,`${language}Files` ,sourceFileName), sourceCode);
            fs.writeFileSync(path.join(__dirname,`${language}Files`, inputFileName), inputTestcase.join('\n'));
    
            const command = `sudo docker run --rm --cpus="1" --memory="${memoryLimit}m" -v ${__dirname}/${language}Files/submit.sh:/app/compile_and_run.sh -v ${__dirname}/${language}Files/${sourceFileName}:/app/myprogram.${language} -v ${__dirname}/${language}Files/${inputFileName}:/app/input.txt ${containerName} myprogram.${language} input.txt ${timeLimit}`;
            
            exec(command, (error, output) => {

                fs.unlinkSync(path.join(__dirname,`${language}Files` ,sourceFileName));
                fs.unlinkSync(path.join(__dirname,`${language}Files`, inputFileName));
    
                if (error) {
                    console.log(`Error: ${error.message}`);
                    reject(`Error: Unable to run the code`);
                }

                if(output.slice(0,5)=='Error'){
                    resolve(`stderr: ${output}`)
                }

                resolve(`stdout: ${output}`);
            });
        });
    } catch (error) {
        console.log("Unable to execute the code.\nError:"+error);
        throw "Unable to execute the code.\nError:";
    }
}

module.exports = {
    CodeRun,
    CodeSubmit,
};
