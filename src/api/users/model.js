/*
Account is a Person: A person is either alive, dead, undead, or fictional.
http://schema.org/Person
*/

const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const sequence = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = "User"

const SALT_WORK_FACTOR = 8

// -----------------------------------------------------------------------------
// SCHEMA

const schema = new Schema(
  {
    // Internal
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    hash: String,
    salt: String
  },
  { timestamps: true }
)

// -----------------------------------------------------------------------------
// GENERATED FIELDS

// Auto increment accountId
schema.plugin(sequence, { inc_field: "id" })

// -----------------------------------------------------------------------------
// MIDDLEWARES
// - ROLES ASSIGNER
// - PASSWORD HASH + SALT GENERATOR

// BEWARE! We cannot define the same mongoose middlewares separately
schema.pre("save", function(next) {
  if (!this.isModified("password")) return next()
  else {
    // Generate salt with predefined factor
    // BEWARE! We cannot do these in synchronous way
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err)
      else {
        // Generate hash with current plain password and salt
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return next(err)
          else {
            // override the clear text password with the hashed one
            this.password = hash
            this.hash = hash
            this.salt = salt
            return next() // finally!
          }
        })
      }
    })
  }
})

// -----------------------------------------------------------------------------
// DATA POPULATION

// schema.pre("find", function(next) {
//   this.populate("books.book", "title")
//   next()
// })
//
// schema.pre("findOne", function(next) {
//   this.populate("books.book", "title")
//   next()
// })
//
// schema.pre("update", function() {
//   this.update({}, { $set: { updatedAt: new Date() } })
// })

// -----------------------------------------------------------------------------
// FINALLY REGISTER THE SCHEMA INTO MODEL

module.exports = mongoose.model(modelName, schema)
