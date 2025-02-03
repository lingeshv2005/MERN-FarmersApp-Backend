import IndividualMessage from '../models/Message.js';

export const createMessage =async (req,res)=>{
    const {userId1,userId2,content,messageType,messagedUserId}=req.body;

    if(!userId1 || !userId2 || !content || !messagedUserId){
        return res.status(400).json({ message: "All fields are required" });
    }
    try{
        let chat=await IndividualMessage.findOneAndUpdate(
            {userId1,userId2},
            {
                $push:{
                    messages: {
                        messagedUserId,
                        content,
                        messageType,
                    }
                },
                updatedAt:new Date()
            },
            {new:true,upsert:true}
        );
        res.status(200).json({ message: 'Message sent successfully', chat });
    }catch(error){
        console.log(error);
    }
}
