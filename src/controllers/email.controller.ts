import { Request,Response } from "express"
import { Email } from "../models/email.model"
import { ApiError } from "../utils/ApiError";


const  email_scheduler = async (req:Request, res:Response) => {
    try {
        
        const { recipient_email, subject, body,schedule_type, weekly_day_selected,time,monthly_day_selected, quarterly_month_selected,quarterly_day_selected } = req.body;


        if(!recipient_email || !subject  || !body || !schedule_type || !time){
        throw new ApiError(401, "Enter all the required fields");
        }


        const email = await Email.create({
            recipient_email,subject, body, schedule_type, time, weekly_day_selected : "Sunday", monthly_day_selected:0
        })




    } catch (error) {
        res.status(400).json({
            message: "Error sending email",
        })
    }
}

const getAllScheduledEmails = async(req:Request, res:Response) => {
try {
    
    const response = await Email.find({})

    console.log(response);
    
} catch (error:any) {
    throw new ApiError(400, "Error while getting All Scheduled Emails", error)
}
}


const getScheduledEmail = async (req: Request, res: Response) => {
try {
    
} catch (error:any) {
    throw new ApiError(400, 'Error while getting Scheduled Email', error);
    
}
};

const deleteScheduledEmail = async(req:Request, res:Response) => {
    try {
        
    } catch (error:any) {
    throw new ApiError(400, 'Error while Deleting  Scheduled Email', error);
        
    }
}



export {email_scheduler,getAllScheduledEmails,getScheduledEmail,deleteScheduledEmail}