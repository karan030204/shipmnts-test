import { Request, Response } from 'express';
import { Email } from '../models/email.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import Scheduler from 'node-cron'
import { transporter } from '../utils/email.utility';

const email_scheduler = async (req: Request, res: Response) => {
  try {
    console.log(req.body, 'body');

    const {
      recipient_email,
      subject,
      body,
      schedule_type,
      weekly_day_selected,
      time,
      monthly_day_selected,
      quarterly_month_selected,
      quarterly_day_selected,
    } = req.body;

    if (!recipient_email || !subject || !body || !schedule_type || !time) {
      throw new ApiError(401, 'Enter all the required fields');
    }

    const email = await Email.create({
      recipient_email,
      subject,
      body,
      schedule_type,
      time,
      weekly_day_selected: weekly_day_selected || 'Sunday',
      monthly_day_selected: monthly_day_selected || 1,
      quarterly_day_selected: quarterly_day_selected || 1,
      quarterly_month_selected: quarterly_month_selected || 1,
    });

    // Set up the email options
    const options = {
      from: 'karan.personal.324@gmail.com',
      to: recipient_email,
      subject: subject,
      body: body,
    };

    // Schedule the email to be sent at noon every day
    Scheduler.schedule('0 12 * * *', () => {
      // Try to send the email
      try {
        transporter.sendMail(options, (err, info) => {
          if (err) {
            console.error(err);
          }
          console.log('Email send with info', info);
        });
      } catch (err) {
        console.error(err);
      }
    });

    if (schedule_type === 'daily') {
      //cron job for daily scheduler
    } else if (schedule_type === 'weekly') {
      //cron job for weekly scheduler
    } else if (schedule_type === 'monthly') {
      //cron job for monthly scheduler
    } else {
      //cron job for quarterly scheduler
    }

    res
      .status(200)
      .json(new ApiResponse(200, 'Successfully stored the message'));
  } catch (error) {
    res.status(400).json({
      message: 'Error sending email',
    });
  }
};

const getAllScheduledEmails = async (req: Request, res: Response) => {
  try {
    const response = await Email.find({});

    res.status(200).json(new ApiResponse(200,response,"Successfully fetched all the scheduled emails"));
  } catch (error: any) {
    throw new ApiError(400, 'Error while getting All Scheduled Emails', error);
  }
};

const getScheduledEmail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await Email.findById(id);

    if(!response){
        throw new ApiError(401, `No Email found with ${id}`)
    }
    
  } catch (error: any) {
    throw new ApiError(400, 'Error while getting Scheduled Email', error);
  }
};

const deleteScheduledEmail = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    throw new ApiError(400, 'Error while Deleting  Scheduled Email', error);
  }
};

export {
  email_scheduler,
  getAllScheduledEmails,
  getScheduledEmail,
  deleteScheduledEmail,
};
