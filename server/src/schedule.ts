import cron, { ScheduledTask } from "node-cron";
import { Application } from "./declarations";
import { PollingEventStatus } from "./domain";

let scheduledJob: ScheduledTask | undefined;

function init(app:Application) {
    try {
        const interval = '*/1 * * * * *';
        const options = { scheduled: false};

        const createAnswerBatches = async () => {
            await app.services['answer-batch'].create({},{});
        };
        scheduledJob = cron.schedule(interval, createAnswerBatches, options);

        app.services["polling-event"].find({query: { status: PollingEventStatus['Live']}})
            .then(livePollingEvents => {
                if(livePollingEvents.length) {
                    start();
                }
            });

    } catch(err) {
        console.error("Unable to initiate scheduled job: " + err);
    }
}

function start() {
    try {
        if(!scheduledJob) {
            throw Error('Scheduled job has not been initiated');
        }
        scheduledJob.start();
    } catch(err) {
        console.error("Unable to start scheduled job: " + err);
    }
}

function stop() {
    try {
        if(!scheduledJob) {
            throw Error('Scheduled job has not been initiated');
        }
        scheduledJob.stop();
    } catch(err) {
        console.error("Unable to stop scheduled job: " + err);
    }
}

export default {init, start, stop};