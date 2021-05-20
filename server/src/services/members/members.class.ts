import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

const axios = require('axios');
axios.defaults.headers.common['x-access-token'] = process.env.BCC_API_KEY;
const personUrl = 'https://members.bcc.no/person';

interface Data {}

interface ServiceOptions {}

export class Members implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  getRoles (person: any) {
    const roles: String[] = []
    if(person.roles)
      person.roles.forEach((role: any) => {
        if(role.name != "Member")
          roles.push(role.name);
      })
    return roles;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    console.log(params?.query);
    const churchId = 55;
    const res = await axios.get(personUrl+'?age=18'); 
    console.log(res);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    if(!id)
      throw Error('You must specify the ID');
    const res = await axios.get(personUrl+'?personID='+id);
    // console.log(res.data);
    if(res.data.total !== 1)
      throw Error('Person not found');
    const data = res.data.data[0];
    console.log(data);
    return {
      _id: '',
      name: data.displayName,
      church: data.church.org.name,
      churchID: data.churchID,
      age: data.age,
      personID: data.personID,
      administrator: data.administrator,
      roles: this.getRoles(data),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
