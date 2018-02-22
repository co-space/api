/* coworking_space */

const mongoose = require("mongoose")
const sequence = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const Account = require("../accounts/model")
const Coworking_space = require("../accounts/model")


// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = "bookings"

// -----------------------------------------------------------------------------
// SCHEMA

const schema = new Schema({
  _account: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  _coworking_space: {
    type: Schema.Types.ObjectId,
    ref: "Coworking_space"
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  type: {
    type: String
  },
  person: {
    type: Number
  },
  start_date: {
    type: Date
  },
  message: {
    type: String
  }
}, {timestamps: true})

// -----------------------------------------------------------------------------
// GENERATED FIELDS

// Auto increment accountId
schema.plugin(sequence, {
  id: "booking_counter",
  inc_field: "id"
})

// -----------------------------------------------------------------------------
// DATA POPULATION

schema.pre("find", function(next) {
  next()
})

schema.pre("findOne", function(next) {
  next()
})

// Set updatedAt timestamp
schema.pre("update", function() {
  this.update({}, {
    $set: {
      updatedAt: new Date()
    }
  })
})

// -----------------------------------------------------------------------------
// FINALLY REGISTER THE SCHEMA INTO MODEL

module.exports = mongoose.model(modelName, schema)
