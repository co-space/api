const express = require("express")
const router = express.Router()

const controller = require("./controller")
const helpers = require("../../helpers")

router.post("/register", controller.register)
router.post("/login", controller.login)
router.put("/logout", helpers.isAuthenticated, controller.logout)

router.get("/", helpers.isAuthenticated, controller.get)
router.get("/bypass", controller.getBypass)
router.get("/:id", controller.getById)

router.get("/review_history/:id", controller.getReviewHistory)


// router.delete("/", helpers.isAuthenticated, controller.delete)
// router.delete("/:id", helpers.isAuthenticated, controller.deleteById)

// router.put("/:id", helpers.isAuthenticated, controller.putById)

module.exports = router
