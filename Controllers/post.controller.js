const Post = require('../Models/post.model')
const cloudinary = require('../Conf/cloudinary.conf')
const update = require('../Models/user.model')
const User = require('../Models/user.model')

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        // if (!file) {
        //     reject("No file uploaded");
            
        
        // }
        
        cloudinary.uploader.upload(file.path, (error, result) => {
            if (error) {
                console.log(error);
                reject("Image not uploaded");
            } else {
                resolve(result.url);
            }
        });
    });
};


const createPost = async (req, res) => {
    try {
        console.log(req.body) 
       
        console.log(req.user)
        // console.log(req.postPhoto)
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                message: "User not authenticated"
            });
        }

        const file = req.file;
console.log(file); 
        const postPhoto = await uploadImage(req.file);

        const { content } = req.body;
         
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const post = await Post.create({
            content,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            createdBy: req.user._id,
            postPhoto,
        });

        if (!post) {
            return res.status(400).json({
                message: "Post not created"
            });
        }

        await user.posts.push(post._id);

        await user.save();

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error
        });
    }
};

const updatePost = async (req, res) => {
    try {
        // const postPhoto = await uploadImage(req.file);

        const id = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(id, {
            content
        });

        if (!post) {
            return res.status(400).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error
        });
    }
};


const deletePost = async (req, res) => {
    try {
        const id = req.params.id
        
        const post = await Post.findByIdAndDelete(id)

        if(!post){
            return res.status(400).json({
                message : "Post not found"
            })
        }

        res.status(200).json({
            message : "Post deleted successfully"
        })
    } catch (error) {
       console.log(error) 
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("createdBy", "name username avatar")

        if(!posts){
            return res.status(400).json({
                message : "Posts not found"
            })
        }

        res.status(200).json({
            message : "Posts fetched successfully",
            posts
        })
    } catch (error) {
        console.log(error)
    }
}

const getPostById = async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id).populate("createdBy", "name username avatar")
        if(!post){
            return res.status(400).json({
                message : "Post not found"
            })
        }
        res.status(200).json({
            message : "Post fetched successfully",
            post
        })
    } catch (error) {
        console.log(error)
    }
}

const getPostByUser = async (req, res) => {
    try {
        const id = req.params.id
        if(!id){
            return res.status(400).json({
                message : "User id not found"
            })
        }
        const posts = await Post.find({createdBy : id}).populate("createdBy", "name username avatar coverimage")
        if(!posts){
            return res.status(400).json({
                message : "Posts not found"
            })
        }
        res.status(200).json({
            message : "Posts fetched successfully",
            posts
        })
    } catch (error) {
        console.log(error)
    }
}

const likePost = async (req, res) => {
    try {
        const id = req.params.id

        const post = await Post.findById(id)

        if(!post){
            return res.status(400).json({
                message : "Post not found"
            })
        }

        if(post.Likes.includes(req.user._id)){
            // unlike the post

            const index = await post.Likes.indexOf(req.user._id)

            await post.Likes.splice(index, 1);

            await post.save() // save the post

           return res.status(200).json({
                message : "Post unliked successfully",
                post
            })
        }

        post.Likes.push(req.user._id)

        await post.save() // save the post

        res.status(200).json({
            message : "Post liked successfully",
            post
        })
    } catch (error) {
        console.log(error)
    }
}

const followUser = async (req, res) => {
    try {
        const usersid = req.user._id
        const followid = req.params.id

        const user = await User.findById(usersid);
        const followUser = await User.findById(followid);

        if(!user){
            return res.status(400).json({
                message : "User not found"
            })
        }

        if(user.following.includes(followid)){
            const index = await user.following.indexOf(followid)
            await user.following.splice(index, 1);
            await user.save()
            const index1 = await user.followers.indexOf(usersid);
            await followUser.followers.splice(index1, 1);
            await followUser.save()
            return res.status(200).json({
                message : "User unfollowed successfully",
                user
            })
        }

        await user.following.push(followid)
        await followUser.followers.push(usersid)
        await user.save()
        await followUser.save()
        res.status(200).json({
            message : "User followed successfully",
            user
        })
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostById,
    getPostByUser,
    likePost,
    followUser
}