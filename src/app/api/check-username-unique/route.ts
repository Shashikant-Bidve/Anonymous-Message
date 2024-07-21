import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        // localhost:3000/api/cuu?username=xyz
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length>0 ? usernameErrors.join(",") : 'Invalid username'
            },{
                status: 400
            })
        }

        const {username} = result.data;

        const existinVerifiedUser = await UserModel.findOne({
            username, isVerified: true
        })

        if(existinVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already taken"
            },{
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "Username availaible"
        },{
            status: 400
        })

    } catch (error) {
        console.error('Error checking username', error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },{
                status: 500
            }
        )
    }
}