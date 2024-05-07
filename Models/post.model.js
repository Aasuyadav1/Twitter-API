const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    postPhoto : {
        type : String
    },
    name : {
        type : String
    },
    username :{
        type : String
    },
    avatar : {
        type : String
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    Likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
}, {timestamps:true})


const Post = model('Post', postSchema);
module.exports = Post