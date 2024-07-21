import mongoose,{Schema, Document} from "mongoose";

// std practice in TS with mongoose for interface
export interface Message extends Document{
    content: string,
    createdAt: Date
}

// type is schema and specifically Message schema
const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    password: string,
    email: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: Boolean,
    isAcceptingMessage: boolean,
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        // custom error message 
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // this operator takes first arg as regex and second as error
        match: [/.+\@.+\..+/, "Not a valid email ID"]
    }, password: {
        type: String,
        required: [true, "Password is required"],
    }, verifyCode: {
        type: String,
        required: [true, "Verification code is needed"]
    }, verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is needed"]
    }, isVerified: {
        type: Boolean,
        default: false
    } , isAcceptingMessage: {
        type: Boolean,
        default: true
    },  
    // type of messages is array of MessageSchema
    messages: [MessageSchema]
})

// model creation in TS and NextJS. First check if already created, if not create. reason to do this is nextjs edge runtime
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema)); 

export default UserModel;