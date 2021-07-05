import { captureException, setTag, addBreadcrumb, Severity } from '@sentry/browser'

export const logToSentry = (error: Error, role?: string ) => {
    if(role){
        setTag('activeRole', role)
    }
    captureException(error)
}

export const createBreadcrumb = (category: string, data: any, message: string) => {
    let severityLevel = Severity.Info;
    if(message.includes('error'))
        severityLevel = Severity.Error;
    addBreadcrumb({
        category: category,
        message: message,
        data: data,
        level: severityLevel
    })
}

export const logConnectionsToSentry = (client: any) => {
    const allServiceEvents = [
        {service: 'polling-event', event: 'patched'},
        {service: 'answer', event: 'created'},
        {service: 'poll-result', event: 'patched'},
        {service: 'poll', event: 'patched'},
    ]

    const allConnectionEvents = [
        'connect_error',
        'connect_timeout',
        'reconnect', 
        'reconnect_attempt', 
        'reconnecting', 
        'reconnect_error', 
        'reconnect_failed', 
        'ping'
    ]

    allServiceEvents.forEach((eventType: any) => {
        client.service(eventType.service).on(eventType.event, (event: any) => {
            createBreadcrumb('socket.io', event, '[Socket Event]: '+eventType.service+' '+eventType.event)
        })
    })

    allConnectionEvents.forEach((connectionEvent: string) => {
        client.io.on(connectionEvent, (event: any) => {
            createBreadcrumb('socket.io', event, '[Socket Event]: '+connectionEvent)
        })
    })
}