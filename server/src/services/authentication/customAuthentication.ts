import { HookContext } from "@feathersjs/feathers";
import { NotAuthenticated } from "@feathersjs/errors";


export async function authenticateExternal(context: HookContext) {
  const { params } = context;

  try {

    const result = await context.app.service('authentication').authenticate(params.authentication, {},'jwt')
    context.params.user = result.user;

  } catch(err) {
    // attach err! 
    throw new NotAuthenticated('Access Denied: authentication for your user was unsuccesful')
  }
  return context
}




