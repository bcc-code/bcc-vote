import cron, { ScheduledTask } from "node-cron";
import { Application } from "./declarations";

let scheduledJob: ScheduledTask | undefined;

function init(app:Application) {
    try {
        const interval = '*/1 * * * * *';
        const options = { scheduled: false};

        scheduledJob = cron.schedule(interval, async () => {
            await app.services['answer-batch'].create({},{});
        }, options);
    }catch(err) {
        console.error(err);
    }
}

function start() {
    try {
        if(!scheduledJob) {
            throw Error('Scheduled job has not been initiated');
        }
        scheduledJob.start();
    }catch(err) {
        console.error(err);
    }
}

export default {init, start};