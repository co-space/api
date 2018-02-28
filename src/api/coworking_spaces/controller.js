const Account = require("../accounts/model")
const Coworking_space = require("./model")
const _ = require("lodash")

const helpers = require("../../helpers")

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /coworking_spaces (HKL)
  // var searchKey = ""
  // if(req.body.city){
  //   search ={
  //
  //   }
  // }

  get: (req, res) => {
    // Find all resources
    var searchKey ={}
    var short_by = req.body.short_by || ""
    if(req.body.city){
      searchKey = {
        'location.city': req.body.city
      }
    }

    Coworking_space.find(searchKey).populate({path: "reviews._account"}).exec((error, resources) => {
      if (error) res.send(error)
      // reverse reviews array
      resources.map((resource, index) => {
        resource.reviews = resource.reviews.reverse()
        resource.total_review = resource.reviews.length
      })

      if(short_by === "most_reviewed"){
        resources = _.orderBy(resources, ['total_review'],['desc']); // Use Lodash to sort array by 'name'
      }

      res.send({data: resources})
    })
  },

  // ---------------------------------------------------------------------------
  // GET /coworking_spaces/:id (HKL)
  getById: (req, res) => {
    // Find one resource
    Coworking_space.findOne({
      id: Number(req.params.id)
    }).populate({path: "reviews._account"}).exec((err, resource) => {
      // console.log(_.has(resource,"reviews"));
      console.log(resource);
      // if(_.has(resource,'reviews')){
      //   resource.reviews = resource.reviews.reverse()
      //
      // }

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
      photos: [req.body.photo],
      price: req.body.price
    }

    // Save into Coworking_space
    Coworking_space.create(body, (error, coworking_space) => {
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
      res.send({message: "New post has been saved", data: coworking_space})
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

  // ---------------------------------------------------------------------------
  // GET /coworking_spaces/review_history/:id
  getReviewHistory: (req, res) => {
    //require user id
    Account.findOne({
      id: Number(req.params.id)
    }).exec((err, account) => {
      if (err)
        return res.send(`error while getting account OID: ${err}`)
      Coworking_space.find({
        reviews: {
          $elemMatch: {
            _account: account._id
          }
        }
      }).populate({
        path: "reviews._account",
        select: {
          "_id": 0,
          "createdAt": 0,
          "updatedAt": 0,
          "email": 0
        }
      }).select({name: 1, location: 1, photos: 1, 'reviews.review': 1, 'reviews.post_date': 1}).exec((err, coworking_spaces) => {
        coworking_spaces.map((coworking_space, index) => {
          coworking_space.reviews = coworking_space.reviews.filter(review => review._account.id === Number(req.params.id))
        })
        // res.send(coworking_spaces)
        res.send({param: req.params.id, data: coworking_spaces})
      })
    })
  },

  // ---------------------------------------------------------------------------
  // GET /coworking_spaces/get_cospace_by_user/:id
  getCospacesByUser: (req, res) => {
    //require user id
    Account.findOne({
      id: Number(req.params.id)
    }).exec((err, account) => {
      if(account._id){
        Coworking_space.find({_account: account._id}).select({name: 1, location: 1, photos: 1, id: 1}).exec((err, coworking_spaces) => {
          res.send({param: req.params.id, data: coworking_spaces})
        })
      } else {
        res.send({param: req.params.id, message: 'account not found'})
      }

    })
  }
}
