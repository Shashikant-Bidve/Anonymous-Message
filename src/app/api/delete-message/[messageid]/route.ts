import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
import mongoose from "mongoose";

export async function DELETE(request:Request, {params}: {params: {messageid: string}}) {

    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if(!session || !user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{
            status: 401
        })
    }

    try {
        const updateResult = await UserModel.updateOne({
            _id: user._id
        },{
            $pull: {messages: {_id: messageId}}
        });

        if(updateResult.modifiedCount == 0){
            return Response.json({
                success: false,
                message: "Message deletion failed"
            },{
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        },{
            status: 200
        })

    } catch (error) {
        console.log("Deletion error",error);
        return Response.json({
            success: false,
            message: "Failed to delete message"
        },{
            status: 500
        })
    }
  
}