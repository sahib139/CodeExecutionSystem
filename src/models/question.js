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
    question: {
      type:"text",
      nullable:false,
    },
    inputDetail:{
      type:"text",
      nullable:false,
    },
    outputDetail:{
      type:"text",
      nullable:false,
    },
    constrains:{
      type:"text",
      nullable:false,
    },
    inputTestcases: {
      type: "simple-array",
      nullable:false
    },
    outputResult: {
      type: "simple-array",
      nullable:false
    },
    timeLimit:{
      type:"int", // in sec
      nullable:false
    },
    memoryLimit:{
      type:"int", // in MB
      nullable:false
    }
  }
});
