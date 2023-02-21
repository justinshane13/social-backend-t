const express = require('express')

const {
    createPost,
    getAllPosts,
    getSinglePost,
    getGroupOfPosts,
    deletePost
} = require('../controllers/postController')

const router = express.Router()

// GET all posts
router.get('/', getAllPosts)

// GET a single post
router.get('/:id', getSinglePost)

// POST a new posts
router.post('/', createPost)

// DELETE a post
router.delete('/:id', deletePost)

module.exports = router