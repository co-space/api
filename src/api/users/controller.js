const bcrypt = require("bcryptjs")

const User = require("./model")

const helpers = require("../../helpers")

module.exports = {
  getAll: (req, res) => {
    User.find({}, (err, accounts) => {
      res.send({
        data: accounts
      })
    })
  },

  getOne: (req, res) => {
    const id = Number(req.params.id)

    User.findOne({ id: id }, (err, account) => {
      res.send({
        id: id,
        data: account
      })
    })
  },

  register: (req, res) => {
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    const newUser = new User(body)

    newUser.save((err) => {
      delete body.password

      if (err) res.send("error")
      else {
        res.send({
          registered: body,
          success: true
        })
      }
    })
  },

  login: (req, res) => {
    const body = {
      email: req.body.email,
      password: req.body.password
    }

    User.findOne({ email: body.email })
      .then((account) => {
        const validPassword = bcrypt.compareSync(
          body.password,
          account.password
        )

        // console.log(">>> account found:", account)
        // console.log({ validPassword })

        if (!account) {
          // (1) If account is not found
          res.send({
            message: `Login failed because account with email '${
              body.email
            }' is not found`
          })
        } else if (!validPassword) {
          // (2) If the found account is logged in with unmatched password
          res.send({
            message: `Sign in failed because password of '${username}' is not match.`
          })
        } else {
          // (3) If the found account is matched with the password
          // console.log({ account })

          // (4) Create token content and config
          let content = {
            payload: {
              // or claims
              iss: process.env.URL, // ISSUER: DOMAIN/URL of the service
              sub: account._id, // SUBJECT: OID/UID/UUID/GUID
              id: account.id, // ACCOUNTID: Sequential ID
              name: account.name, // NAME: Full name
              email: account.email // EMAIL: Email address
            },
            secret: process.env.JWT_SECRET,
            options: {
              expiresIn: "30d" // EXPIRATION: 30 days
            }
          }
          // console.log({ content })

          // (5) Generate a token
          const token = helpers.generateJWT(content)

          // console.log({ token })

          // (6) Finally send that token
          res.send({
            message: "Logged in",
            email: body.email,
            token: token
          })
        }
      })
      .catch((err) => {
        // (7) If there's an error while finding the account
        if (err)
          res.send({
            message: `Something went wrong when try to logging in`
          })
      })
    // Finished sign in
  },

  logout: (req, res) => {
    const body = {}

    res.send({
      registered: body
    })
  },

  test: (req, res) => {
    const body = { email: req.body.email }
    User.findOne({ email: body.email }).then((account) => {
      res.send({
        account
      })
    })
  }
}
