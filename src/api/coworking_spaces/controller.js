const Account = require("../accounts/model")
const Coworking_space = require("./model")

const helpers = require("../../helpers")

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /coworking_spaces (HKL)
  get: (req, res) => {
    // Find all resources
    Coworking_space.find({}).populate({path: "_account"}).exec((error, resources) => {
      if (error)
        res.send(error)
      res.send({data: resources})
    })
  },

  // ---------------------------------------------------------------------------
  // GET /coworking_spaces/:id (HKL)
  getById: (req, res) => {
    // Find one resource
    Coworking_space.findOne({
      id: Number(req.params.id)
    }).exec((err, resource) => {
      res.send({params: req.params, data: resource})
    })
  },

  // ---------------------------------------------------------------------------
  // POST /coworking_spaces (HKL)
  post: (req, res) => {
    // Create resource object from resource
    const body = {
      _account: req.decoded.sub, // subject _id from JWT
      name: req.body.name,
      address: req.body.address,
      overview: req.body.overview,
      coordinate: {
        lat: req.body.lat,
        lng: req.body.lng
      } || {},
      fb_link: req.body.fb_link,
      twit_link: req.body.twit_link,
      ln_link: req.body.ln_link,
      location: {
        province: req.body.province,
        city: req.body.city
      } || "",
      amenities: [req.body.amenities],
      photos: [req.body.photo]
    }

    // Save into Coworking_space
    Coworking_space.create(body, (error, post) => {
      // Save new post into selected Account
      // Account.findOneAndUpdate(
      //   { _id: body.creator },
      //   {
      //     $push: {
      //       posts: post._id
      //     }
      //   },
      //   (error, account) => {
      //     res.send({
      //       message: "New post has been saved",
      //       data: body
      //     })
      //   }
      // )
      res.send({message: "New post has been saved", data: body})
    })
  },

  //  ---------------------------------------------------------------------------
  //  DELETE /coworking_spaces (HKL)
  delete: (req, res) => {
    //  Remove all resources
    Coworking_space.remove({}, (error, account) => {
      res.send({message: "All posts have been deleted"})
    })
  },
  //
  //  ---------------------------------------------------------------------------
  //  DELETE /coworking_spaces/:id (HKL)
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

    console.log(newReview);
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
  },

  //---------------------------------------------------------------------------------------------//
  //FILTER BY CITY  /coworking_spaces/filterCity/:location
  // filterByCity: (req, res) => {
  //   var city = req.params.city;
  //   Coworking_space.find({
  //     city: city
  //   }, (err, resource) => {
  //     if (err) {
  //       return res.status(500).json({message: 'Error when getting by city', error: err})
  //     }
  //     if (!resource) {
  //       return res.status(404).json({message: 'No such list'});
  //     }
  //     res.json({params: req.params, data: resource})
  //     // res.send({params: req.params, data: resource})
  //   }).skip(2).limit(3);
  // },

  //FILTER BY MEMBER /coworking_space/filterMember/:
  // filterByCity: (req, res, next) => {
  //   var city = req.params.city;
  //   var perPage = 4;
  //   var page = req.params.page || 1;
  //   Coworking_space
  //       .find({})
  //       .skip((perPage * page) - perPage)
  //       .limit(perPage)
  //       .exec(function(err, resource) {
  //           Coworking_space.count().exec(function(err, count) {
  //               if (err) return next(err)
  //               res.send({
  //                   data: resource,
  //                   current_page: page,
  //                   pages: Math.ceil(count / perPage)
  //               })
  //           })
  //       })
  // }
  // filterBy: (req, res, next) => {
  //   var city = req.param('city');
  //   var perPage = 4;
  //   const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  //   Coworking_space
  //       .find({city})
  //       .skip((perPage * page) - perPage)
  //       .limit(perPage)
  //       .exec(function(err, resource) {
  //           Coworking_space.count().exec(function(err, count) {
  //               if (err) return next(err)
  //               res.send({
  //                   data: resource,
  //                   current_page: page,
  //                   pages: Math.ceil(count / perPage)
  //               })
  //           })
  //       })
  // }



}
