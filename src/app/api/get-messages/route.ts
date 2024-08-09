import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{
            status: 401
        })
    }
    // necesarry for aggregation pipline
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        // aggregation pipeline
        const user = await UserModel.aggregate([
            { $match: {_id: userId}},
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }

        // return messages
        return Response.json({
            success: true,
            messages: user[0].messages
        },{
            status: 200
        })

    } catch (error) {
        console.error('failed to get messages',error);
        return Response.json({
            success: false,
            message: "Messages not found"
        },{
            status: 500
        })
    }
}