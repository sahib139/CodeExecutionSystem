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
            name:"question",
            type:"text",
            isNullable:"false",
          },
          {
            name:"inputDetail",
            type:"text",
            isNullable:"false",
          },
          {
            name:"outputDetail",
            type:"text",
            isNullable:"false",
          },
          {
            name:"constrains",
            type:"text",
            isNullable:"false",
          },
          {
            name: "inputTestcases",
            type: "text",
            isNullable: false,
          },
          {
            name: "outputResult",
            type: "text",
            isNullable: false,
          },
          {
            name: "timeLimit",
            type: "int",
            isNullable: false,
          },
          {
            name: "memoryLimit",
            type: "int",
            isNullable: false,
          }
        ],
      }),
      true
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable("questions");
  }
}
