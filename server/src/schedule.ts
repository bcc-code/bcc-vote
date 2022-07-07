import cron, { ScheduledTask } from "node-cron";
import { Application } from "./declarations";
import { PollActiveStatus } from "./domain";
import { sleep } from './utils/promise';
import logger from "./logger";

let scheduledJob: ScheduledTask | undefined;

function init(app:Application) {
    const interval = '*/3 * * * * *';
    const options = { scheduled: false};

    const createAnswerBatches = async () => {
        await app.services['answer-batch'].create({},{});
    };
    scheduledJob = cron.schedule(interval, createAnswerBatches, options);

    let initiationError:string;
    app.services.poll.find({query: { activeStatus: PollActiveStatus['Live']}})
        .then(async (livePolls) => {
            logger.info(`Schedule startup ${livePolls.length} active polls found`);
            if(livePolls.length) {
                const activePoll_Ids = livePolls.map(p => p._id);
                await app.services["answer-batch"].patch('default',{activate: activePoll_Ids},{});
            }
        }).catch(async (err) => {
            logger.error(`Unable to initiate scheduled job: ${err}`);
            if(err.message !== initiationError) {
                await sleep(1000);
                initiationError = err.message;
                init(app);
            }
        });
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