const Account = require("../accounts/model")
const Coworking_space = require("../coworking_spaces/model")
const Booking = require("./model")

const helpers = require("../../helpers")

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /coworking_spaces (HKL)
  get: (req, res) => {
    // Find all resources
    Booking.find({}).populate({path: "_account"}).exec((error, resources) => {
      if (error)
        res.send(error)
      res.send({data: resources})
    })
  },

  // ---------------------------------------------------------------------------
  // GET /coworking_spaces/:id (HKL)
  getById: (req, res) => {
    // Find one resource
    Booking.findOne({
      id: Number(req.params.id)
    }).exec((err, resource) => {
      res.send({params: req.params, data: resource})
    })
  },

  // ---------------------------------------------------------------------------
  // POST /bookings (HKL)
  post: (req, res) => {
    // Create resource object from resource
    const coworking_space_id = req.body.coworking_space_id
    // get coworking space object id
    Coworking_space.findOne({
      id: coworking_space_id
    }, function(err, coworking_space) {
      if (err)
        return res.send("error while searching coworking space _id")

      const body = {
        _account: req.decoded.sub, // subject _id from JWT
        _coworking_space: coworking_space._id,
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        person: req.body.person,
        start_date: new Date(req.body.start_date),
        message: req.body.message
      }
      // res.send(body)
      // Save into Bookings
      Booking.create(body, (error, post) => {
        // Save new post into selected Account
        if (err) return res.send("error while creating new Booking")
        
        res.send({message: "New Booking has been saved", data: body})
      })

    });

    // const body = {
    //   _account: req.decoded.sub,  subject _id from JWT
    //    _coworking_space: req.body.name,
    //   name: req.body.address,
    //   email: req.body.overview,
    //   type: req.body.type,
    //   person: req.body.person,
    //   start_date: new Date(req.body.start_date),
    //   message: req.body.message
    // }

    // console.log(body);
    // res.send(body);

    //  Save into Coworking_space
    // Coworking_space.create(body, (error, post) => {
    //    Save new post into selected Account
    //    Account.findOneAndUpdate(
    //      { _id: body.creator },
    //      {
    //        $push: {
    //          posts: post._id
    //        }
    //      },
    //      (error, account) => {
    //        res.send({
    //          message: "New post has been saved",
    //          data: body
    //        })
    //      }
    //    )
    //   res.send({message: "New post has been saved", data: body})
    // })
  },

  //  ---------------------------------------------------------------------------
  //  DELETE /coworking_spaces
  delete: (req, res) => {
    //  Remove all resources
    Coworking_space.remove({}, (error, account) => {
      res.send({message: "All posts have been deleted"})
    })
  },
  //
  //  ---------------------------------------------------------------------------
  //  DELETE /coworking_spaces/:id
  deleteById: (req, res) => {
    //  Remove one resource by id
    const id = req.params.id
    Coworking_space.remove({
      id: Number(id)
    }, (error, account) => {
      res.send({message: `Post with id: ${id} has been deleted`, data: account})
    })
  },

  //  ---------------------------------------------------------------------------
  //  PUT /coworking_spaces/:id
  putById: (req, res) => {
    //    Create new resource object data
    const newCoworkingSpace = req.body
    const id = req.params.id
    // res.send(newCoworkingSpace)
    //    Find one resource and update with new data
    Coworking_space.findOneAndUpdate({
      id: Number(id)
    }, {
      $set: newCoworkingSpace
    }, {
      new: true, //return the modified document
      upsert: false // create new resource if not exist
    }, (error, resource) => {
      if (error)
        res.send({message: "Error when updating post"})
      res.send({message: `Coworking space with id: ${id} has been updated`, data: resource})
    })
  },

  //  ---------------------------------------------------------------------------
  //  PUT /coworking_spaces/add_review/:id
  addReviewById: (req, res) => {
    //    Create new resource object data
    // require body.review
    req.body.date = new Date()
    req.body._account = req.decoded.sub
    const newReview = req.body
    const id = req.params.id
    // res.send(newReview)
    //    Find one resource and update with new data
    Coworking_space.findOneAndUpdate({
      id: Number(id)
    }, {
      $push: {
        reviews: newReview
      }
    }, {
      new: true, //return the modified document
      upsert: false //create new resource if not exist
    }, (error, resource) => {
      if (error) {
        res.send({message: "Error when updating post"})
      } else {
        res.send({message: `Coworking space with id: ${id} has been updated`, data: resource})
      }
    })
  },
  //  ---------------------------------------------------------------------------
  //  PUT /coworking_spaces/add_rating/:id
  addRatingById: (req, res) => {
    //    Create new resource object data
    // require body.rate
    console.log("test");
    req.body._account = req.decoded.sub
    const newRating = req.body
    const id = req.params.id
    // res.send(newRating)
    //   Find one resource and update with new data
    Coworking_space.findOneAndUpdate({
      id: Number(id)
    }, {
      $push: {
        ratings: newRating
      }
    }, {
      new: true, //return the modified document
      upsert: false //create new resource if not exist
    }, (error, resource) => {
      if (error) {
        res.send({message: "Error when updating post"})
      } else {
        res.send({message: `Coworking space with id: ${id} has been updated`, data: resource})
      }
    })
  }
}
