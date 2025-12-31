/** @format */

const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
/**
 * @desc  Update User
 * @route  /api/users/:id
 * @method  PUT
 * @access  private
 */

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    // if (req.user.id !== req.params.id) {
    //   return res
    //     .status(403) //403 => forbidden
    //     .json({
    //       message: "You are not allowed you only can update your profile.",
    //     });
    // }
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  })
);


/**
 * @desc  Get All Users
 * @route  /api/users
 * @method  GET
 * @access  private(only admin)
 */

router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const allusers = await User.find().select("-password");
    res.status(200).json(allusers);
  })
);


/**
 * @desc  Get User By Id
 * @route  /api/users/:id
 * @method  GET
 * @access  private(only admin and user himself)
 */

router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");;
    if(user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: "user is not found"});
    }
  })
);



/**
 * @desc  Delete User By Id
 * @route  /api/users/:id
 * @method  DELETE
 * @access  private(only admin and user himself)
 */

router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");;
    if(user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({message:"user has been deleted  successfully"});
    } else {
      res.status(404).json({message: "user is not found"});
    }
  })
);

module.exports = router;
