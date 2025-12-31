/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity")

// USER SCHEMA

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timesTamps: true }
);

// GENERATE TOKEN
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

// USER MODEL
const User = mongoose.model("User", userSchema);

// VALIDATION FUNCTIONS

function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().min(2).max(200).required(),
    password: Joi.required(),
  });

  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).required(),
  });

  
  return schema.validate(obj);
}
// Validate change password 

function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });

  
  return schema.validate(obj);
}

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    username: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6),
  });

  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword
};
