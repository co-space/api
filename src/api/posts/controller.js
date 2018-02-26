const Account = require("../accounts/model")
const Post = require("./model")

const helpers = require("../../helpers")

module.exports = {
  // ---------------------------------------------------------------------------
  // GET /posts
  get: (req, res) => {
    // Find all resources
    Post.find({})
      .populate({
        path: "creator"
      })
      .exec((error, resources) => {
        if (error) res.send(error)
        res.send({
          data: resources
        })
      })
  },

  // ---------------------------------------------------------------------------
  // GET /posts/:id
  getById: (req, res) => {
    // Find one resource
    Post.findOne({id: Number(req.params.id)}).exec((err, resource) => {
      res.send({
        params: req.params,
        data: resource
      })
    })
  },

  // ---------------------------------------------------------------------------
  // POST /posts
  post: (req, res) => {
    // Create resource object from resource
    const body = {
      creator: req.decoded.sub,
      id: req.decoded.id,
      name: req.decoded.name, // subject _id from JWT
      title: req.body.title,
      content: req.body.content
    }

    res.send(body)
    // Save into Posts
    // Post.create(body, (error, post) => {
    //   // Save new post into selected Account
    //   Account.findOneAndUpdate(
    //     {_id: body.creator},
    //     {
    //       $push: {
    //         posts: post._id
    //       }
    //     },
    //     (error, account) => {
    //       res.send({
    //         message: "New post has been saved",
    //         data: body
    //       })
    //     }
    //   )
    // })
  },

  // ---------------------------------------------------------------------------
  // POST /posts/bypass
  postBypass: (req, res) => {
    // Create resource object from resource
    const body = {
      title: req.body.title,
      content: req.body.content
    }

    // Save into Posts
    Post.create(body, (error, post) => {
      res.send({
        message: "New post has been saved",
        data: body
      })
    })
  },

  // ---------------------------------------------------------------------------
  // DELETE /posts
  delete: (req, res) => {
    // Remove all resources
    Post.remove({}, (error, account) => {
      res.send({
        message: "All posts have been deleted"
      })
    })
  },

  // ---------------------------------------------------------------------------
  // DELETE /posts/:id
  deleteById: (req, res) => {
    // Remove one resource by id
    Post.remove({id: Number(req.params.id)}, (error, account) => {
      res.send({
        message: `Post with id: ${id} has been deleted`,
        data: account
      })
    })
  },

  // ---------------------------------------------------------------------------
  // PUT /posts/:id
  putById: (req, res) => {
    // Create new resource object data
    const newPost = {
      title: req.body.title,
      content: req.body.content
    }

    // Find one resource and update with new data
    Post.findOneAndUpdate(
      {
        id: Number(req.params.id)
      },
      {$set: newPost},
      {
        new: true, // return the modified document
        upsert: false // create new resource if not exist
      },
      (error, resource) => {
        if (error) res.send({message: "Error when updating post"})
        res.send({
          message: `Post with id: ${id} has been updated`,
          data: resource
        })
      }
    )
  }
}
