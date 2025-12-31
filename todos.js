/** @format */

const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Todo = require("../models/Todos");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

/**
 * @desc  Add Todo
 * @route  /api/todos
 * @method  POST
 * @access  private
 */

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const todo = new Todo({
      title: req.body.title,
      completed:req.body.completed
    });
    const result = await todo.save();
    res.status(200).json(result);
  })
);

/**
 * @desc  Get All Todos
 * @route  /api/todos
 * @method  Get
 * @access  private
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const todos = await Todo.find();
    res.status(200).json(todos);
  })
);

/**
 * @desc  Update Todo
 * @route  /api/users/:id
 * @method  PUT
 * @access  private
 */

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          completed: req.body.completed,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedTodo);
  })
);

/**
 * @desc  Delete Todo By Id
 * @route  /api/todos/:id
 * @method  DELETE
 * @access  public
 */

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      await Todo.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "todo has been deleted  successfully" });
    } else {
      res.status(404).json({ message: "todo is not found" });
    }
  })
);

module.exports = router;
