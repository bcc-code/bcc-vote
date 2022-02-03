const keys = {
    local: {
        auth0ClientId: 'hPK4PRnpFkY5MmUoJZa31sNldB0Mprei',
        auth0Domain: 'bcc-sso-dev.eu.auth0.com',
        auth0RedirectUri: 'http://localhost:8080',
        audience: 'bcc.vote',
        envName: 'local',
        isProduction: false,
        appInsisghtKey: 'InstrumentationKey=0a4a41a7-266c-4bf7-8792-69c83de62255;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',
    },
    dev: {
        auth0ClientId: 'hPK4PRnpFkY5MmUoJZa31sNldB0Mprei',
        auth0Domain: 'bcc-sso-dev.eu.auth0.com',
        auth0RedirectUri: 'https://dev.vote.bcc.no',
        audience: 'bcc.vote',
        envName: 'dev',
        isProduction: false,
        appInsisghtKey: 'InstrumentationKey=0a4a41a7-266c-4bf7-8792-69c83de62255;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',
    },
    beta: {
        auth0ClientId: 'gcCga8XX2HkIhR6KzTwkNgChybe47Dt0',
        auth0Domain: 'bcc-sso-sandbox.eu.auth0.com',
        auth0RedirectUri: 'https://beta.vote.bcc.no',
        audience: 'bcc.vote',
        envName: 'beta',
        isProduction: false,
        appInsisghtKey: 'InstrumentationKey=89af16a8-32f0-4ec7-8792-8af53839df49;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',
    },
    prod: {
        auth0ClientId: 'e9qdZ4dhMhhG9YbDPmo9hzI7Sp644ulH',
        auth0Domain: 'login.bcc.no',
        auth0RedirectUri: 'https://vote.bcc.no',
        audience: 'bcc.vote',
        envName: 'prod',
        isProduction: true,
        appInsisghtKey: 'InstrumentationKey=8fa4d4da-fb2f-41f0-9322-5446e9fa3cd2;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',
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
