import { Logging } from '@google-cloud/logging';
  
export default async function(message?:string):Promise<any> {
    // Creates a client

    const isLocal = process.env.VOTE_API_BASE_URL === 'https://localhost:4040';

    const projectId = 'bcc-vote';
    const logName = 'cloudbuild';
    const logging = new Logging({projectId});

    // Selects the log to write to
    const log = logging.log(logName);
  
    // return log;
    // The data to write to the log
    const text = message ? message : 'Testing logging, this is a fake Error';
  
    // The metadata associated with the entry
    const metadata = {
        resource: {
            type: 'global',
            labels: {
                service_name: "vote-dev",
                configuration_name: "vote-dev"
            }
        },
        severity: 'ERROR',
    };
  
    const entry = log.entry(metadata, text);
  
    if(!isLocal) {
        await log.write(entry);
    } else {
        console.log(`Logged: ${text}`);
    }
}