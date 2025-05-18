import cron from "node-cron";
import { Borrow } from "../Models/borrow.models.js";
import { sendEmail } from "../Utils/sendEmailFunc.js";
import { User } from "../Models/user.models.js";

export const notifyUser = () => {
    cron.schedule("*/30 * * * *", async () => {
        // console.log("Scheduling is running ....")
        try {
            const OneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: { $lte: OneDayAgo },
                returned: null,
                notified: false,
            });
            for (const element of borrowers) {
                if (element.user && element.user.email) {
                    sendEmail({
                        email:element.user.email,
                        subject: "Book return Reminder",
                        message: `Hello ${element.user.name}, your book is due on ${element.dueDate}. Please return the book as soon as possible.`,
                    });
                    element.notified = true;
                    await element.save();
                    console.log(`${element.user.email} has been notified`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
}