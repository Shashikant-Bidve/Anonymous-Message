import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();

        // to decode value from URl
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodeUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 500
            })
        }

        const isValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            },{
                status: 200
            })
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code expired. Please signup again"
            },{
                status: 400
            })
        }else{
            return Response.json({
                success: false,
                message: "Verification Code is not correct"
            },{
                status: 400
            })
        }

    } catch (error) {
        console.error('Error verifying user', error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{
            status: 500
        })
        
    }
}
