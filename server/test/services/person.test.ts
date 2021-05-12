import assert from 'assert';
import app from '../../src/app';

describe('\'person\' service', () => {
  it('registered the service', () => {
    const service = app.service('person');

    assert.ok(service, 'Registered the service');
  });
});
