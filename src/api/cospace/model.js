/*
Post
*/

const mongoose = require("mongoose")
const sequence = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const Account = require("../accounts/model")

// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = "Cospace"

// -----------------------------------------------------------------------------
// SCHEMA

const schema = new Schema(
  {
    _account: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    overview: {
      type: String
    },
    create_date: {
      type: Date
    },
    coordinate: [{
      lat: String,
      lng: String
    }],
    reviews: [{
      _account: Schema.Types.ObjectId,
      review: String,
      post_date: Date
    }],
    fb_link: {
      type: String
    },
    twit_link: {
      type: String
    },
    ln_link: {
      type: String
    },
    location: {
      province: String,
      city: String
    },
    rating: [{
      _account: Schema.Types.ObjectId,
      rate: Number
    }],
    amenities: [String]
  },
  { timestamps: true }
)

// -----------------------------------------------------------------------------
// GENERATED FIELDS

// Auto increment accountId
schema.plugin(sequence, { id: "cospace_counter", inc_field: "id" })

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
  this.update(
    {},
    {
      $set: { updatedAt: new Date() }
    }
  )
})

// -----------------------------------------------------------------------------
// FINALLY REGISTER THE SCHEMA INTO MODEL

module.exports = mongoose.model(modelName, schema)
