import assert from 'assert';
import app from '../../src/app';

describe('\'poll-result\' service', () => {
  it('registered the service', () => {
    const service = app.service('poll-result');

    assert.ok(service, 'Registered the service');
  });
});
