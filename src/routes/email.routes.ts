import Router from 'express';
import {email_scheduler,getAllScheduledEmails,getScheduledEmail,deleteScheduledEmail} from '../controllers/email.controller';


export const router = Router();

router.route('/schedule-email').post(email_scheduler);
router.route('/scheduled-emails').get(getAllScheduledEmails);
router.route('/scheduled-emails/:id').get(getScheduledEmail);
router.route('/scheduled-emails/delete/:id').delete(deleteScheduledEmail);