/* coworking_space */

const mongoose = require("mongoose")
const sequence = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const Account = require("../accounts/model")

// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = "coworking_spaces"

// -----------------------------------------------------------------------------
// SCHEMA

const schema = new Schema({
  _account: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  name: {
    type: String
  },
  address: {
    type: String,
    default: ""
  },
  overview: {
    type: String,
    default: ""
  },
  coordinate: {
    lat: String,
    lng: String
  },
  reviews: [
    {
      _account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
      },
      review: String,
      post_date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  fb_link: {
    type: String,
    default: ""
  },
  twit_link: {
    type: String,
    default: ""
  },
  ln_link: {
    type: String,
    default: ""
  },
  location: {
    province: {
      type: String,
      default: "DKI Jakarta"
    },
    city: {
      type: String,
      default: "Jakarta Barat"
    }
  },
  ratings: [
    {
      _account: Schema.Types.ObjectId,
      rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
      }
    }
  ],
  amenities: [String],
  photos: [String]
}, {timestamps: true})

// -----------------------------------------------------------------------------
// GENERATED FIELDS

// Auto increment accountId
schema.plugin(sequence, {
  id: "coworking_space_counter",
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
