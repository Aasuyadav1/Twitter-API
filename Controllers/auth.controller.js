const User = require('../Models/user.model')
const cloudinary = require('../Conf/cloudinary.conf')

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


const signup = async (req, res) => {
    try {
        const {name, username, email, password} = req.body
        
        const isExists = await User.findOne({email})

        if(isExists){
            return res.status(400).json({
                message : "User already exists"
            })
        }

        const user = await User.create({
            name,
            username,
            email,
            password
        })

        const token = await user.generateToken();

        res.status(201).json({
            message : "User created successfully",
            token
        })
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "User not found"
            })
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            return res.status(400).json({
                message : "Invalid Password"
            })
        }

        const token = await user.generateToken()

        res.status(200).json({
            message : "User logged in successfully",
            token
        })
    } catch (error) {
        console.log(error)
    }
}


const userInfo = async (req, res) => {
    try {
        const user = await req.user

        if(!user){
            return res.status(400).json({
                message : "User not found"
            })
        }

        res.status(200).json({
            user
        })

    } catch (error) {
        console.log(error)
    }
}


const logout = async (req, res) => {
    try {
        const user = await req.user
        user.token = null
        await user.save()
        res.status(200).json({
            message : "User logged out successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id

        const user = await User.findById(id).populate("followers","name username avatar").populate("following", "name username avatar")

        if(!user){
            return res.status(400).json({
                message : "User not found"
            })
        }

        res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error)
    }
}


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const { name, username, bio } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        let avatar, coverimage;

      
        if (req.files && req.files.avatar && req.files.avatar.length > 0) {
            const avatarFile = req.files.avatar[0]; 
            avatar = await uploadImage(avatarFile);
        }

        if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
            const coverImageFile = req.files.coverImage[0]; 
            coverimage = await uploadImage(coverImageFile);
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;
        if (coverimage) user.coverimage = coverimage;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};





module.exports = {signup, login, userInfo, getUserById, updateUser, logout}