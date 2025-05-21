import cron from "node-cron";
import { User } from "../Models/user.models.js";

export const removeUnverifiedAccounts = async () => {
    cron.schedule("*/30 * * * *", async () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: thirtyMinutesAgo },
        });
        console.log("Unverified accounts removed");
    });
};