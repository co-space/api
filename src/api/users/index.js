const express = require("express")
const router = express.Router()

const controller = require("./controller")

router.get("/", controller.getAll)
router.get("/:id", controller.getOne)

router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/logout", controller.logout)

router.post("/test", controller.test)

module.exports = router
