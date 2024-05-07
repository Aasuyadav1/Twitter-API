const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String
    },
    coverimage : {
        type : String
    },
    bio : {
        type : String
    },
    followers : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    following : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    posts : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post'
        }
    ]
    

},{timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    } catch (error) {
        console.log(error)
    }
})


userSchema.methods.comparePassword = async function(enteredPassword){
    try {
        return await bcrypt.compare(enteredPassword, this.password)
    } catch (error) {
        console.log(error)
    }
}


userSchema.methods.generateToken = async function (){
    try{
        return await jwt.sign({
            id: this._id,
            name: this.name,
            email: this.email,
            token: this.token
        },
        "dkjfhskhfkjsdf",
        {
            expiresIn: "2d"
        }
    )

    }catch(error){
        console.log(error)
    }
}


const User = model('User', userSchema)
module.exports = User