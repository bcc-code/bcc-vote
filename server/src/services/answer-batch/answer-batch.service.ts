import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AnswerBatch } from './answer-batch.class';

declare module '../../declarations' {
  interface ServiceTypes {
    'answer-batch': AnswerBatch & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    app.use('/answer-batch', new AnswerBatch(app));
}
