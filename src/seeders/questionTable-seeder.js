const Question = require("../models/question");
const { AppDataSource } = require("../config/database-config");

async function seed() {
  try {
    await AppDataSource.initialize();
    const questionRepository = AppDataSource.getRepository(Question);

    const questionsData = [
      {
        question:`A permutation of integers 1,2,....,n is called beautiful if there are no adjacent elements whose difference is 1.
        Given n, construct a beautiful permutation if such a permutation exists.`,
        inputDetail:"The only input line contains an integer n.",
        outputDetail:`Print a beautiful permutation of integers 1,2,...,n. If there are several solutions, you may print any of them. If there are no solutions, print "NO SOLUTION".`,
        constrains:`1 <= n <= 10^6`,
        inputTestcases: JSON.stringify(["5","2","10"]),
        outputResult: JSON.stringify(["4 2 5 3 1", "NO SOLUTION","2 4 6 8 10 1 3 5 7 9"]),
        timeLimit: 1, 
        memoryLimit: 512, 
      },
      {
        question:`Consider a money system consisting of n coins. Each coin has a positive integer value. Your task is to produce a sum of money x using the available coins in such a way that the number of coins is minimal.
        For example, if the coins are {1,5,7} and the desired sum is 11, an optimal solution is 5+5+1 which requires 3 coins.`,
        inputDetail:`The first input line has two integers n and x: the number of coins and the desired sum of money.
        The second line has n distinct integers C1,C2,....,Cn: the value of each coin.`,
        outputDetail:`Print one integer: the minimum number of coins. If it is not possible to produce the desired sum, print -1.`,
        constrains:`1 <= n <= 100
        1 <= x <= 10^6
        1 <= Ci <= 10^6`,
        inputTestcases: JSON.stringify(["3 11\n1 5 7", "3 2000\n1 1500 1000","2 10\n3 6"]),
        outputResult: JSON.stringify(["3","2","-1"]),
        timeLimit: 1, 
        memoryLimit: 512, 
      },
    ];

    await Promise.all(
      questionsData.map(async (data) => {
        const question = questionRepository.create(data);
        await questionRepository.save(question);
      })
    );

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
