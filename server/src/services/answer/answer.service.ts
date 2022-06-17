import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Answer } from './answer.class';
import createModel from '../../models/answer.model';
import hooks from './answer.hooks';

declare module '../../declarations' {
    interface ServiceTypes {
        'answer': Answer & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const Model = createModel(app);

    app.use('/answer', new Answer(Model, app));

    const service = app.service('answer');
    service.hooks(hooks);
}
