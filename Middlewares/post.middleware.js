const Post = require('../Models/post.model')

const postMiddlware = async (req, res, next) => {
    try {
        const id = req.params.id

        const post = await Post.findById(id)

        if(!post){
            return res.status(400).json({
                message : "Post not found"
            })
        }

        req.post = post

        next()

    } catch (error) {
        console.log(error)
    }
}

module.exports = postMiddlware