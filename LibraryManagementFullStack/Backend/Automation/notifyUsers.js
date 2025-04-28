import cron from 'node-cron';
import { sendEmail } from '../utils/emailService.js';
import Borrow from '../Models/borrow.model.js';

export const notifyUsers=()=>{
    cron.schedule("*/30 * * * *", async () => {
        try {
            const oneDayAgo=new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers=await Borrow.find({
                dueDate: { $lt: oneDayAgo },
                returnDate:false,
                notified:false
            });
            for(const element of borrowers){
                
            }
        } catch (error) {
            
        }
    });
}