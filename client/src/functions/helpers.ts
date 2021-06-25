import { captureException, setTag } from '@sentry/browser'

export const logToSentry = (error: Error, role?: string ) => {
    if(role){
        setTag('activeRole', role)
    }
    captureException(error)
}