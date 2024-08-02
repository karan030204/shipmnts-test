import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema(
  {
    recipient_email: {
      type: String,
      required: [true, 'Receiptent Email is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    attachments: {
      type: File,
    },
    schedule_type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    },
    weekly_day_selected : {
        type : String,
        enum : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    },
    time: {
      type: String,
      required : [true, "Time is required"]
    },
  },
  { timestamps: true },
);


export const Email = mongoose.model('Email', emailSchema)
