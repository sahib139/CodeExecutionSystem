const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Question",
  tableName: "questions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    inputTestcases: {
      type: "simple-array",
      nullable:false
    },
    outputResult: {
      type: "simple-array",
      nullable:false
    }
  }
});
