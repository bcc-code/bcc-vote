import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import feathers from '@feathersjs/feathers';


export class ExternalService<T> implements ServiceMethods<T> {
    client: feathers.Application;
    serviceName: string;

    constructor (client: feathers.Application, serviceName: string) {
        this.client = client;
        this.serviceName = serviceName;
    }

    get(id: Id, params?: Params):Promise<T> {
        return this.client.service(this.serviceName).get(id, {query: params?.query});
    }
    find(params?: Params):Promise<T[] | Paginated<T>> {
        return this.client.service(this.serviceName).find({query: params?.query});
    }
    create(data: T, params: Params):Promise<T> {
        return this.client.service(this.serviceName).create(data, params);
    }
    patch(id: Id, data: T, params: Params):Promise<T> {
        return this.client.service(this.serviceName).patch(id, data, params);
    }
    update(id: Id, data: T, params: Params):Promise<T> {
        return this.client.service(this.serviceName).update(id, data, params);
    }
    remove(id: Id, params: Params):Promise<T> {
        return this.client.service(this.serviceName).remove(id, params);
    }
}
