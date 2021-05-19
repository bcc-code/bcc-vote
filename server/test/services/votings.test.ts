import assert from 'assert';
import app from '../../src/app';

describe('\'votings\' service', () => {
  it('registered the service', () => {
    const service = app.service('votings');

    assert.ok(service, 'Registered the service');
  });
});
