const express = require("express")
const router = express.Router()

const controller = require("./controller")

const helpers = require("../../helpers")

router.get("/", controller.get)
router.get("/:id", controller.getById)

router.post("/", helpers.isAuthenticated, controller.post)
router.post("/bypass", controller.postBypass)

router.delete("/", helpers.isAuthenticated, controller.delete)
router.delete("/:id", helpers.isAuthenticated, controller.deleteById)

router.put("/:id", helpers.isAuthenticated, controller.putById)

module.exports = router
