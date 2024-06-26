const { MigrationInterface, QueryRunner, Table } = require("typeorm");

module.exports = class CreateQuestionTable1719406659738 {
    name = 'CreateQuestionTable1719406659738'

    async up(queryRunner) {
        await queryRunner.createTable(
          new Table({
            name: "questions",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "inputTestcases",
                type: "text",
              },
              {
                name: "outputResult",
                type: "text",
              },
            ],
          }),
          true
        );
      }
    
      async down(queryRunner) {
        await queryRunner.dropTable("questions");
      }
}
