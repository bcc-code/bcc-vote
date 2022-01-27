import * as appInsights from 'applicationinsights';
if (process.env.BCC_VOTE_APPINSIGHTS_CONNECTIONSTRING) {
    appInsights
        .setup(process.env.BCC_VOTE_APPINSIGHTS_CONNECTIONSTRING)
        .setSendLiveMetrics(true)
        .setAutoDependencyCorrelation(true)
        .start();
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'members-backend';
}

export default appInsights;
