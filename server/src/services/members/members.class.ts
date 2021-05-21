import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

const axios = require('axios');
axios.defaults.headers.common['x-access-token'] = process.env.BCC_API_KEY;
const baseUrl = 'https://members.bcc.no/';
const personUrl = baseUrl+'person';
const affiliationUrl = baseUrl+'affiliation';
const personroleUrl = baseUrl+'personrole';

interface Data {}

interface ServiceOptions {}

interface Role {
  id: String,
  name: String,
}

export class Members implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  getRoles (person: any) {
    const roles: Role[] = [];
    if(person.roles)
      person.related.roles.forEach((role: any) => {
        if(role.name != "Member")
          roles.push({id: role._id, name: role.enumName});
      })
    return roles;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    // const churchId = 55;
    console.log(params?.query);

    const role = params?.query?.role;
    const churchID = params?.query?.churchID;

    if(!role && !churchID){
      throw Error("You must specify role or scope meeting to local");
    }

    if(!role){
      const url = affiliationUrl+'?%24limit=0&_to='+encodeURIComponent(churchID);
      const res = await axios.get(url);
      return res.data;
    }
    if(!churchID){
      const url = personroleUrl+'?%24limit=0&_to='+encodeURIComponent(role);
      const res = await axios.get(url);
      return res.data;
    }

    const url = personroleUrl+'?%24limit=1000&_to='+encodeURIComponent(role);
    const res = await axios.get(url);

    let amt = 0;
    let people: any[] = [];
    
    res.data.data.forEach(async (roleData: any) => {
      const fromId = roleData._from.split('/')[1];
      people.push(axios.get(personUrl+'/'+fromId))
    })

    const values = await Promise.all(people)

    values.forEach((person: any) => {
      if(person.data.church.org._id === churchID)
        amt ++;
    })
    // console.log(role);
    // if(role){
    //   url += '%24limit=2&_to='+encodeURIComponent(role);
    // }

    // const res = await axios.get(url);
    // console.log(res.data);

    return {
      total: amt,
      limit: 0,
      skip: 0,
      data: []
    };
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
    // console.log(data);
    return {
      _id: '',
      name: data.displayName,
      church: data.church.org.name,
      churchID: data.church.org._id,
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
