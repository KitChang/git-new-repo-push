const express = require("express");

const UserController = require("../controllers/users");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.put("/:id", checkAuth, UserController.updateUser);

router.get("", UserController.getUsers);

router.get("/:id", UserController.getUser);

router.delete("/:id", checkAuth, UserController.deleteUser);

module.exports = router;
