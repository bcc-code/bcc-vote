import { defineComponent } from "vue";
import determineConfigBasedOnEnvironment from "./config";
import { Role } from "./domain";
import { logToSentry } from "./functions/sentry";
import router from "./router";

const config = determineConfigBasedOnEnvironment();

export default defineComponent({
    methods: {
        $handleError(error: Error) {
            logToSentry(error, this.$user.activeRole); 
            if(error.message === 'Poll is not active') {
                this.$toast(this.$t('error.pollNotActive'), getSentryOptions());
            } else {
                this.$toast(error.message, getSentryOptions());
            }
            
        },
        $showSuccess(message: string): void {
            this.$toast(message, getSentryOptions());
        },
        $logout(): void {
            router.$client.logout();
            localStorage.clear();
            sessionStorage.clear();
            const url = `https://${config.auth0Domain}/v2/logout?client_id=${config.auth0ClientId}&returnTo=${location.origin}&federated`;
            location.href = url;
        },
    },
    computed: {
        $canAdministratePollingEvents(): boolean {
            if (this.$user.roles) {
                const allowedRoles = [
                    'Developer',
                    'SentralInformasjonsmedarbeider',
                    'CentralAdministrator',
                    'VotingAdmin',
                ];
                const allowedUserRoles = this.$user.roles.filter((r: Role) => allowedRoles.includes(r.enumName));
                if (allowedUserRoles.length) {
                    return true;
                }
            }
            return false;
        },
    },
});

const getSentryOptions = () => {
    const settings = {
        class: 'error',
        positionY: window.innerHeight < 640 ? 'top' : 'bottom'
    } as const;
    return settings;
};
