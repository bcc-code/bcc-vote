import logger from './logger';
import { HookContext } from "@feathersjs/feathers";
import { defineAbilityFor,  } from './permissions/appAbility';
import {authenticateExternal } from './services/authentication/customAuthentication';
import { ForbiddenError, subject } from '@casl/ability';
import { BadRequest } from '@feathersjs/errors';
import { User } from './domain';
import {initTracking, finalizeTracking, trackErrors} from './utils/appInsightsWebSocket';
import { db } from './firestore';


// Application hooks that run for every service
const startAuthenticationAtTheStartOfRequest = async (context: HookContext):Promise<HookContext> => {
    const { params } = context;

    // Allow all calls to and during authentication
    if(context.path == 'authentication' || params.authenticationInProgress == true){
        if(context.type =='before'){
            params.authenticationInProgress = true;
        }
        return context;
    }

    // Allow internal calls
    if(!params.provider){
        return context;
    }

    // Authenticate external calls, Then continue to hook
    if(params.authenticated == undefined){
        try {
            await authenticateExternal(context);
            return context;
        } catch(err) {
            throw err;
        }
    } else {
        throw Error('Access Denied: We were not able to authenticate the request');
    }
};

const endAuthenticationAtEndOfRequest = (context: HookContext):HookContext => {
    if(context.path == 'authentication' && context.type == 'after'){
        context.params.authenticationInProgress = false;
    }
    return context;
};

const checkAbilityWithFullFieldAccess = (context: HookContext):HookContext => {
    // If the params.provider is not specified then we can assume it is an external call
    // and we will therefore not check the permissions for it.
    if(context.params.authenticationInProgress || !context.params.provider){
        return context;
    }

    if(context.params.user){
        const ability = defineAbilityFor(context.params.user as User);

        const requestedAction = context.method;
        const requestedSubject = context.path;

        const subjectData = Object.assign(
            context.data,
            context.id ? { _key: context.id} : {}
        );

        ForbiddenError.from(ability).throwUnlessCan(requestedAction,subject(requestedSubject,subjectData));

        return context;
    } else {
        throw Error('User has not been set in params.');
    }

};

const checkRemoveAbility = (context: HookContext):HookContext => {
    // If the params.provider is not specified then we can assume it is an external call
    // and we will therefore not check the permissions for it.
    if(context.params.authenticationInProgress || !context.params.provider ){
        return context;
    }

    if(context.params.user){
        const ability = defineAbilityFor(context.params.user as User);

        const requestedAction = context.method;
        const requestedSubject:any = context.path;
        if(context.data){
            ForbiddenError.from(ability).throwUnlessCan(requestedAction,subject(requestedSubject,context.data));
        }else{
            ForbiddenError.from(ability).throwUnlessCan(requestedAction,requestedSubject);
        }

        return context;
    } else {
        throw Error('User has not been set in params.');
    }
};

const checkFindAbility = (context: HookContext):HookContext => {
    // If the params.provider is not specified then we can assume it is an external call
    // and we will therefore not check the permissions for it.
    if(context.params.authenticationInProgress || !context.params.provider){
        return context;
    }

    if(context.params.user){

        const ability = defineAbilityFor(context.params.user as User);

        const requestedAction = context.method;
        const requestedSubject:any = context.path;

        let results;
        if(Array.isArray(context.result)){
            results = context.result;
        }else{
            results = context.result.data;
        }
        const allowedItems = [];
        for (const item of results){
            const entityAllowed = ability.can(requestedAction,subject(requestedSubject,item));
            if(entityAllowed){
                allowedItems.push(item);
            }
        }

        if(Array.isArray(context.result)){
            context.result = allowedItems;
        }else{
            context.result.data = allowedItems;
        }

        return context;
    } else {
        throw Error('User has not been set in params.');
    }
};


const checkGetAbility = (context: HookContext):HookContext => {
    if(context.params.authenticationInProgress || !context.params.provider){
        return context;
    }

    if(context.params.user){
        const ability = defineAbilityFor(context.params.user as User);

        const action = 'get';
        const requestedSubject:any = context.path;
        const entity = context.result;
        ForbiddenError.from(ability).throwUnlessCan(action,subject(requestedSubject,entity));

        return context;
    } else {
        throw Error('User has not been set in params.');
    }
};


const checkPatchAbility = async (context: HookContext):Promise<HookContext> => {
    //If the params.provider is not specified then we can assume it is an external call
    // and we will therefore not check the permissions for it.
    if(context.params.authenticationInProgress || !context.params.provider ){
        return context;
    }

    if(context.params.user){
        const ability = defineAbilityFor(context.params.user as User);

        const entity = await context.app.service(context.path).get(context.id,{});
        entity.requestedChanges = context.data;

        ForbiddenError.from(ability).throwUnlessCan(context.method,subject(context.path,entity));

        return context;
    } else {
        throw Error('User has not been set in params.');
    }

};

const checkPatchBody = (context: HookContext):void => {
    if(Object.keys(context.data).length === 0 ){
        throw new BadRequest("Body of request was empty.");
    }
};


const purgeErrors = (context: HookContext):void => {
    if(context.error instanceof ForbiddenError) {
        context.error.message = `Not allowed to ${context.error.action} the ${context.error.subjectType}`;
        delete context.error.subject;
    }
};

const logErrors = (context: HookContext):void => {
    const { error, method, path } = context;
    const expectedErrors = ['ForbiddenError','NotFound','NotAuthenticated'];

    const message = [error.name, 'from app.hooks.ts:', error.message, 'during', method, path].join(' ');

    if(expectedErrors.includes(error.name)) {
        logger.warn(message);
    } else {
        logger.error(message);
    }
};

const syncToFirestore = async (context: HookContext):Promise<HookContext> => {
    const syncedCollections = ['poll', 'polling-event'];
    if(!syncedCollections.includes(context.path)) return context;
    const {result} = context;
    if(!result) return context;
    db.collection(context.path).doc(result._key).set(result);

    return context;
};

export default {
    before: {
        all: [initTracking, startAuthenticationAtTheStartOfRequest],
        find: [],
        get: [],
        create: [checkAbilityWithFullFieldAccess],
        update: [checkAbilityWithFullFieldAccess],
        patch: [checkPatchBody, checkPatchAbility],
        remove: [checkRemoveAbility]
    },

    after: {
        all: [endAuthenticationAtEndOfRequest, finalizeTracking],
        find: [checkFindAbility],
        get: [checkGetAbility],
        create: [ syncToFirestore ],
        update: [ syncToFirestore ],
        patch: [syncToFirestore, checkGetAbility],
        remove: []
    },

    error: {
        all: [trackErrors,purgeErrors,logErrors],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
