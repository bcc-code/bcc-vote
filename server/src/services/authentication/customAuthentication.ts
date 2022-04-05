import { HookContext } from "@feathersjs/feathers";
import { NotAuthenticated } from "@feathersjs/errors";


export async function authenticateExternal(context: HookContext): Promise<HookContext> {
    const { params } = context;

    try {
        const result = await context.app.service('authentication').authenticate(params.authentication, {},'jwt')
        context.params.user = result.user;

    } catch(err) {
        throw new NotAuthenticated(`Access Denied: authentication for your user was unsuccesful: ${err}`);
    }
    return context;
}




