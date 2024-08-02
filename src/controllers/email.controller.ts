import { Request, Response } from 'express';
import { Email } from '../models/email.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import Scheduler from 'node-cron';
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
      from: 'info@demomailtrap.com',
      to: recipient_email,
      subject: subject,
      text: body,
    };

    // Extract hour and minute from time
    const [hour, minute] = time.split(':').map(Number);



    if (schedule_type === 'daily') {

        console.log('daily');
        
      // Cron job for daily scheduler
      Scheduler.schedule(`${minute} ${hour} * * *`, () => {
        sendEmail(options);
      });
    } else if (schedule_type === 'weekly') {
        console.log('weekly');

      // Convert day of the week to cron format (0 for Sunday, 6 for Saturday)
      const dayOfWeek = convertDayToCron(weekly_day_selected || 'Sunday');
      Scheduler.schedule(`${minute} ${hour} * * ${dayOfWeek}`, () => {
        sendEmail(options);
      });
    } else if (schedule_type === 'monthly') {
        console.log('monthly');

      // Cron job for monthly scheduler
      Scheduler.schedule(
        `${minute} ${hour} ${monthly_day_selected || 1} * *`,
        () => {
          sendEmail(options);
        },
      );
    } else if (schedule_type === 'quarterly') {
        console.log('quarterly');

      // Cron job for quarterly scheduler
      const quarterlyCronExpression = getQuarterlyCronExpression(
        hour,
        minute,
        quarterly_day_selected || 1,
        quarterly_month_selected || 1,
      );
      Scheduler.schedule(quarterlyCronExpression, () => {
        sendEmail(options);
      });
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

// Function to send email
const sendEmail = (options: any) => {
    console.log('sendEmail fn');
    
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.error(err);
    }
    console.log('Email sent with info', info);
  });
};

// Function to convert day of the week to cron format
const convertDayToCron = (day: string): number => {
  const days: any = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return days[day];
};

// Function to get quarterly cron expression
const getQuarterlyCronExpression = (
  hour: number,
  minute: number,
  day: number,
  month: number,
): string => {
  // Quarter months can be January, April, July, and October (1, 4, 7, 10)
  const quarterMonths = [1, 4, 7, 10];
  if (!quarterMonths.includes(month)) {
    throw new ApiError(400, 'Invalid quarterly month selected');
  }
  return `${minute} ${hour} ${day} ${month}/3 *`;
};

const getAllScheduledEmails = async (req: Request, res: Response) => {
  try {
    const response = await Email.find({});

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          'Successfully fetched all the scheduled emails',
        ),
      );
  } catch (error: any) {
    throw new ApiError(400, 'Error while getting All Scheduled Emails', error);
  }
};

const getScheduledEmail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await Email.findById(id);

    if (!response) {
      throw new ApiError(401, `No Email found with ${id}`);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          `Successfully fetched Email with id : ${id}`,
        ),
      );
  } catch (error: any) {
    throw new ApiError(
      400,
      'Error while getting Scheduled Email with id',
      error,
    );
  }
};

const deleteScheduledEmail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const response = await Email.findByIdAndDelete(id);

    if (!response) {
      throw new ApiError(401, 'Error while deleting scheduled email');
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, response, `Successfully Deleted Email with ${id}`),
      );
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
