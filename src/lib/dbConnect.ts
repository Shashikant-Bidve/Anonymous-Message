import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

// this returns promise and type is not known, void here is nor=t same as c++
async function dbConnect() : Promise<void> {

    // check in nextjs is already connected cause edge runtime
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    try {
       // connect db
       const db =  await mongoose.connect(process.env.MONGODB_URI || '',{});

       connection.isConnected = db.connections[0].readyState
       console.log(db.connections);
       

       console.log('DB connected successfully');
       
    } catch (error) {
        
        console.log('DB connection failed', error);
        
        process.exit(1);
    }

}

export default dbConnect;