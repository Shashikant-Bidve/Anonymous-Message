import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions= {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "abc@gmail.com" },
                password: { label: "Password", type: "password" },
                // username: {label: "username", type:"text"}
              },
              async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify first before login')
                    }
                    const passCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(passCorrect){
                        return user;
                    }else{
                        throw new Error('Incorrect password');
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
              }
        })
    ],
callbacks:{
    async jwt({token, user}){
        // inject user data in token
        if(user){
        token._id = user._id?.toString(),
        token.isVerified = user.isVerified,
        token.isAcceptingMessages = user.isAcceptingMessages,
        token.username = user.username 
        }
        return token;
    },
    async session({session, token}){
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVeified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session;
    }
},
pages:{
    // custom route here nextAuth creates page for signIn
    signIn: '/sign-in'
},
session:{
    strategy: "jwt"
},
secret: process.env.NEXTAUTH_SECRET    
}