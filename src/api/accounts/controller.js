const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const Account = require("./model")

const helpers = require("../../helpers")

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /accounts
  get: (req, res) => {
    Account.find({})
      .populate({
        path: "posts"
      })
      .exec((err, accounts) => {
        res.send({
          data: accounts
        })
      })
  },

  // ---------------------------------------------------------------------------
  // GET /accounts/bypass
  getBypass: (req, res) => {
    Account.find({})
      // .populate({
      //   path: "posts"
      // })
      .exec((err, accounts) => {
        res.send({
          data: accounts
        })
      })
  },

  // ---------------------------------------------------------------------------
  // GET /accounts/:id
  getById: (req, res) => {
    Account.findOne({id: Number(req.params.id)}, (err, account) => {
      res.send({
        params: req.params,
        data: account
      })
    })
  },

  // ---------------------------------------------------------------------------
  // GET /accounts?username=yourname&email=yourname@domain.com
  getByQuery: (req, res) => {
    const query = {
      username: req.params.username,
      email: req.params.email
    }

    Account.findOne(query, (error, account) => {
      res.send({
        params: req.params,
        data: account
      })
    })
  },

  // ---------------------------------------------------------------------------
  // DELETE /accounts
  delete: (req, res) => {
    Account.remove({}, (error) => {
      if (error) res.status(400).json({error: error})
      res.status(200).send({message: "All accounts have been removed."})
    })
  },

  // ---------------------------------------------------------------------------
  // POST /accounts/register
  register: (req, res) => {
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    const newAccount = new Account(body)
    delete body.password

    newAccount.save((error) => {
      if (error) res.send("error")
      else {
        res.send({
          registered: body,
          success: true
        })
      }
    })
  },

  // ---------------------------------------------------------------------------
  // POST /accounts/login
  login: (req, res) => {
    // Create body object
    const body = {
      email: req.body.email,
      password: req.body.password
    }

    // Find one account by email
    Account.findOne({email: body.email})
      .then((account) => {
        console.log(account);
        const validPassword = bcrypt.compareSync(
          body.password,
          account.password
        )

        // console.log(validPassword)

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

          // (6) Set logged in status
          helpers.setLoggedIn(account, true)
          // console.log(account.name
          // (7) Finally send that token
          res.send({
            message: "You are logged in",
            email: body.email,
            name: account.name,
            profile_picture: account.profile_picture,
            id: account.id,
            token: token
          })
        }
      })
      .catch((err) => {
        // If there's an error while finding the account
        if (err)
          res.send({
            message: `Something went wrong when try to logging in`
          })
      })
    // Finished sign in
  },

  // ---------------------------------------------------------------------------
  // GET /accounts/logout
  logout: (req, res) => {
    const decoded = {
      id: req.decoded.id
    }

    // (6) Set logged in status
    helpers.setLoggedIn(decoded, false)

    res.send({
      message: `User with id: ${decoded.id} is logged out`
    })
  },
  // ---------------------------------------------------------------------------
  // GET /accounts
  // getReviewHistory: (req, res) => {
  //
  //   Account.find({reviews: {$elemMatch: {_account: "5a8d300c4cf01a3ee36818a1"}}})
  //     .populate({
  //       path: "posts"
  //     })
  //     .exec((err, accounts) => {
  //       res.send({
  //         data: accounts
  //       })
  //     })
  // },

  // ---------------------------------------------------------------------------
  // GET /accounts/get_user_detail
  getUserDetail: (req, res) => {
    // res.send(req.decoded.id)
    Account.find({id: req.decoded.id})
      .exec((err, accounts) => {
        res.send({
          data: accounts
        })
      })
  },

}
