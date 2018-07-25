const express = require("express");

const RequestController = require("../controllers/requests");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, RequestController.createRequest);

router.put("/:id", checkAuth, RequestController.updateRequest);

router.get("", RequestController.getRequests);

router.get("/:id", RequestController.getRequest);

router.delete("/:id", checkAuth, RequestController.deleteRequest);

module.exports = router;
