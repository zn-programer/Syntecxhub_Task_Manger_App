/** @format */

const { required, boolean } = require("joi");
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  { timesTamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
