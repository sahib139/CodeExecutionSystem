const Question = require("../models/question");
const {AppDataSource} = require("../config/database-config");

async function seed() {
  try {
    await AppDataSource.initialize();
    const questionRepository = AppDataSource.getRepository(Question);

    const questionsData = [
      {
        inputTestcases: ["testcase1", "testcase2"],
        outputResult: ["result1", "result2"],
      },
      {
        inputTestcases: ["testcase3", "testcase4"],
        outputResult: ["result3", "result4"],
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
  } finally{
    await AppDataSource.destroy(); 
  }
}

seed();
