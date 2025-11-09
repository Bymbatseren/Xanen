import mongoose , {Schema,model,models} from "mongoose";

const UserSchema = new Schema({
    username :{
        type:String ,
        required : true,
        unique :true,
        trim : true,
        minLength : 3,
        maxLength: 30,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password:{
        type:String,
        required: true,
        minLength: 6,
        select :false
    },
    avatar : {
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:""
   
    },
    location :{
        type:{
            lat:Number,
            lng:Number,
        },
        default:null
    },
    verified:{
        type:Boolean,
        default : false
    },
    role :{
        type :String,
        enum : ["user","admin"],
        default :"user"

    },
    posts :[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref:"Post"
        },
    ],
    bio :{
        type:String,
        maxLength:200,
        default:""
    },
    resetPasswordOtp:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,

    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
    otp:{
        type:String,

    },
    otpExpires:{
        type:Date,
    },
    lastLogin:{
        type:Date,
    },
},
    {timestamps:true}
    
)
export default mongoose.models.User || mongoose.model("User", UserSchema )