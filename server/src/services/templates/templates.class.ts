import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { DbService, IOptions, } from "@bcc-its/feathers-arangodb";
import { Application } from '../../declarations';

interface Data {}

export class Templates extends DbService<Data> {
  app: Application;

  constructor (options: IOptions, app: Application) {
    super(options)
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async find (params?: Params): Promise<Data[] | Paginated<Data>> {
  //   return [];
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async get (id: Id, params?: Params): Promise<Data> {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async create (data: Data, params?: Params): Promise<Data> {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map(current => this.create(current, params)));
  //   }

  //   return data;
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data;
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
  //   return data;
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async remove (id: NullableId, params?: Params): Promise<Data> {
  //   return { id };
  // }
}
