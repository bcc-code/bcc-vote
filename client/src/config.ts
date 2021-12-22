const keys = {
    local: {
        auth0ClientId: 'hPK4PRnpFkY5MmUoJZa31sNldB0Mprei',
        auth0Domain: 'bcc-sso-dev.eu.auth0.com',
        envName: 'local',
        isProduction: false,
    },
    dev: {
        auth0ClientId: 'hPK4PRnpFkY5MmUoJZa31sNldB0Mprei',
        auth0Domain: 'bcc-sso-dev.eu.auth0.com',
        envName: 'dev',
        isProduction: false,
    },
    beta: {
        auth0ClientId: 'gcCga8XX2HkIhR6KzTwkNgChybe47Dt0',
        auth0Domain: 'bcc-sso-sandbox.eu.auth0.com',
        envName: 'beta',
        isProduction: false,
    },
    prod: {
        auth0ClientId: 'e9qdZ4dhMhhG9YbDPmo9hzI7Sp644ulH',
        auth0Domain: 'login.bcc.no',
        envName: 'prod',
        isProduction: true,
    },
};

export default function determineConfigBasedOnEnvironment(): typeof keys.local {
    if (window.location.hostname === 'localhost') {
        return keys.local;
    }
    if (window.location.hostname.includes('dev')) {
        return keys.dev;
    }
    if (window.location.hostname.includes('beta')) {
        return keys.beta;
    }
    return keys.prod;
}
