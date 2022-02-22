import determineConfigBasedOnEnvironment from '../config';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
    config: {
        connectionString: determineConfigBasedOnEnvironment().appInsightsKey,
        enableAutoRouteTracking: true,
        disableFetchTracking: false,
    },
});
appInsights.loadAppInsights();
appInsights.trackPageView();
appInsights.addTelemetryInitializer((envelope: any) => {
    envelope.tags['ai.cloud.role'] = 'vote-frontend';
});

export default appInsights;
