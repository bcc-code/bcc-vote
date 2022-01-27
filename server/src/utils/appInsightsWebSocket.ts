import { HookContext } from "@feathersjs/feathers";
import logger from "../logger";
import appInsights from "./appInsightsTelemetry";
import {ExceptionTelemetry} from 'applicationinsights/out/Declarations/Contracts';

const initTracking = async (context: HookContext): Promise<HookContext> => {
    if (context.params.provider === 'socketio') {
        context.params.startTime = new Date().getTime();
    }

    return context;
};

const finalizeTracking = async (context: HookContext): Promise<HookContext> => {
    if (context.params.provider === 'socketio') {
        const trackingData = {
            name: `${context.method} /${context.path}`,
            url: process.env.VOTE_API_BASE_URL ?? 'undefined',
            success: true,
            duration: context.params.startTime ? new Date().getTime() - context.params.startTime : 0,
            resultCode: '200',
        };
        if (appInsights.defaultClient) {
            appInsights.defaultClient.trackRequest(trackingData);
            logger.debug('MANUAL TRACKING', {trackingData});
        } else {
            logger.debug('MANUAL TRACKING ERROR', {trackingData, appInsights});
        }
    }

    return context;
};

const trackErrors = async (context: HookContext): Promise<void> => {
    if (context.params.provider === 'socketio') {
        const telemetryData: ExceptionTelemetry = {
            exception: context.error,
        };
        if (appInsights.defaultClient) {
            appInsights.defaultClient.trackException(telemetryData);
        }
    }
};

export {initTracking, finalizeTracking, trackErrors};
