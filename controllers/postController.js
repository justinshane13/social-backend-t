const Post = require('../models/postModel')
const mongoose = require('mongoose')

// create array of categories to be used in route checking
const categories = [
    "general",
    "strength",
    "endurance",
    "bodybuilding",
    "athletics",
    "running",
    "hiit"
]

// get all posts
const getAllPosts = async (req, res) => {
    const posts = await Post.find({}).sort({createdAt: -1})
    res.status(200).json(posts)
}

// get a single post
const getSinglePost = async (req, res) => {
    const { id } = req.params
    
    if (categories.includes(id)) {
        if (id === "general") {
            const posts = await Post.find({}).sort({createdAt: -1})
            return res.status(200).json(posts)
        }
        const posts = await Post.find({topic: id}).sort({createdAt: -1})
        return res.status(200).json(posts)
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Post ID does not exist'})
    }

    const post = await Post.findById(id)

    if (!post) {
        return res.status(404).json({error: 'No such post'})
    }

    res.status(200).json(post)
}

// get specific group of posts
const getGroupOfPosts = async (req, res) => {
    const { topic } = req.params

    const posts = await Post.find({topic: topic})

    res.status(200).json(posts)
}

// create a new post
const createPost = async (req, res) => {
    const { title, content, author, topic } = req.body

    const newPost = {
        title: title,
        content: content,
        likes: 0,
        author: author,
        topic: topic
    }

    let emptyFields = []

    if (!title) {
        emptyFields.push('title')
    }
    if (!content) {
        emptyFields.push('content')
    }
    if (!author) {
        emptyFields.push('author')
    }
    if (!topic) {
        emptyFields.push('topic')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
    }

    // try to add doc to db
    try {
        const post = await Post.create(newPost)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a post
const deletePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Post ID does not exist'})
    }

    const post = await Post.findOneAndDelete({_id: id})

    if (!post) {
        return res.status(404).json({error: 'No such post'})
    }

    res.status(200).json({post})
}

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    getGroupOfPosts,
    deletePost
}