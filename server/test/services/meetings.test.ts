import assert from 'assert';
import app from '../../src/app';

describe('\'meetings\' service', () => {
  it('registered the service', () => {
    const service = app.service('meetings');

    assert.ok(service, 'Registered the service');
  });
});
