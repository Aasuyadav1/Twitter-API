const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Post'
    },
    content : {
        type : String,
        required : true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps:true})

const Comment = model('Comment', commentSchema)
module.exports = Comment