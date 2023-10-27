import  mongoose from "mongoose"

const connect = async () => {
    if(mongoose.connections[0].readyState) return;
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Connection Successfully Established")
    } catch (error){
        throw new Error("Mongo Connection Error")
    }
}

export default connect;