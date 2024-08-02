import mongoose, { Document, Schema, Model } from 'mongoose';

interface IEmail extends Document {
  recipient_email: string;
  subject: string;
  body: string;
  attachments?: string[];
  schedule_type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  weekly_day_selected?:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  time: string;
  monthly_day_selected?: number;
  quarterly_month_selected?: number;
  quarterly_day_selected? : number
}

const emailSchema = new Schema<IEmail>(
  {
    recipient_email: {
      type: String,
      required: [true, 'Recipient Email is required'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
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
      type: [String], // Storing file paths or URLs
    },
    schedule_type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly'],
      required: [true, 'Schedule type is required'],
    },
    weekly_day_selected: {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      required: function (this: IEmail) {
        return this.schedule_type === 'weekly';
      },
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    monthly_day_selected: {
      type: Number,
      min: 1,
      max: 31,
      required: function (this: IEmail) {
        return this.schedule_type === 'monthly';
      },
    },
    quarterly_month_selected: {
      type: Number,
      min: 1,
      max: 12,
      required: function (this: IEmail) {
        return this.schedule_type === 'quarterly';
      },
    },
    quarterly_day_selected : {
      type: Number,
      min: 1,
      max: 31,
      required: function (this: IEmail) {
        return this.schedule_type === 'quarterly';
      },
    },
  },
  { timestamps: true },
);

// Custom validation for schedule_type
emailSchema.path('schedule_type').validate(function (value: string) {
  if (value === 'weekly' && !this.weekly_day_selected) {
    throw new Error('Weekly day must be selected for weekly schedules');
  }
  if (value === 'monthly' && !this.monthly_day_selected) {
    throw new Error('Monthly day must be selected for monthly schedules');
  }
  if (value === 'quarterly' && !this.quarterly_month_selected) {
    throw new Error('Quarterly month must be selected for quarterly schedules');
  }
  return true;
});

export const Email: Model<IEmail> = mongoose.model<IEmail>(
  'Email',
  emailSchema,
);
