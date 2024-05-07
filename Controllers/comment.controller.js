const Comment = require('../Models/comment.model')
const Post = require('../Models/post.model')

const createComment = async (req, res) => {
    try {
        const id = req.params.id
        const {content} = req.body

        const post = await Post.findById(id)
         
        if(!post){
            return res.status(400).json({
                message : "Post not found"
            })
        }

        const comment = await Comment.create({
            content,
            createdBy : req.user._id,
            postId : post._id
        })

        if(!comment){
            return res.status(400).json({
                message : "Comment not added" 
            })
        }

        await comment.save()

        await post.comments.push(comment._id)

        await post.save()

        res.status(201).json({
            message : "Comment added successfully",
            comment
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id
        const comment = await Comment.findById(id)
        const userId = req.user._id
        if(comment.createdBy == userId){
            await Comment.findByIdAndDelete(id)
            res.status(200).json({
                message : "Comment deleted successfully"
            })
        }
        return res.status(400).json({
            message : "Unauthorized"
        })
    } catch (error) {
        console.log(error)
    }
}

const getCommentById = async (req, res) => {
    try {
        const id = req.params.id

        const comment = await Comment.findById(id)

        if(!comment){
            return res.status(400).json({
                message : "Comment not found"
            })
        }

        res.status(200).json({
            comment
        })
    } catch (error) {
        console.log(error)
    }
}

const updateComment = async (req, res) => {
    try {
        const id = req.params.id
        const {content} = req.body
        const comment = await Comment.findById(id)
        if(comment.createdBy !== req.user._id){
            return res.status(400).json({
                message : "Unauthorized"
            })
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            message : "Comment updated successfully",
            comment
        })


    } catch (error) {
        console.log(error)
    }
}

const getCommentByPostId = async (req, res) => {
    try {
        const id = req.params.id;

        const comments = await Comment.find({ postId: id }).populate('createdBy', 'username avatar');

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: "Comments not found"
            });
        }

        res.status(200).json({
            comments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}



module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getCommentById,
    getCommentByPostId
}