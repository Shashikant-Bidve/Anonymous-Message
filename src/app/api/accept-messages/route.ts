// next auth gives default method to get session details
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// change state of accepting messages
export async function POST(request:Request) {
    await dbConnect();
    // get session
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !user){
        return Response.json({
            success: false,
            message: "user not authenticated"
        },{
            status: 401
        })
    }

    const UserId = user._id;
    const { acceptMessages } = await request.json();

    try {
        // return new updated user
        const updatedUser = await UserModel.findByIdAndUpdate(
            UserId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "failed to update status of accepting"
            },{
                status:401
            })
        }else{
            return Response.json({
                success: true,
                message: "Message acceptance state updated successfully",
                updatedUser
            },{
                status:200
            })
        }

    } catch (error) {
        console.error('failed to update status of accepting user');
        return Response.json({
            success: false,
            message: "failed to update status of accepting"
        },{
            status:500
        })
        
    }
}


// get status of accepting messages
export async function GET(request: Request) {
    await dbConnect();
    // get session
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !user){
        return Response.json({
            success: false,
            message: "user not authenticated"
        },{
            status: 401
        })
    }

    const UserId = user._id;

    try {
        const foundUser = await UserModel.findById(UserId);

    if(!foundUser){
        return Response.json({
            success: false,
            message:"User not found"
        },{
            status: 404
        })
    }

    return Response.json({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage
    },{
        status: 200
    })
    } catch (error) {
        console.error('Failed to get user',error);
        return Response.json({
            success: false,
            message:"User Acceptane status not found"
        },{
            status: 500
        })
    }

    
}