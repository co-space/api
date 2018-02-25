const express = require("express")
const router = express.Router()

const controller = require("./controller")

const helpers = require("../../helpers")

router.get("/", controller.get)
router.get("/:id", controller.getById)

router.post("/", helpers.isAuthenticated, controller.post)

router.delete("/", helpers.isAuthenticated, controller.delete)
router.delete("/:id", helpers.isAuthenticated, controller.deleteById)

router.put("/:id", helpers.isAuthenticated, controller.putById)
router.post("/add_review/:id", helpers.isAuthenticated, controller.addReviewById)
router.post("/add_rating/:id", helpers.isAuthenticated, controller.addRatingById)

router.get("/filterCity/:location", controller.filterByCity)

module.exports = router
