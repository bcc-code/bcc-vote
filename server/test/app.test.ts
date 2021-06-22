import 'mocha';
import { assert } from 'chai';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import app from '../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string => url.format({
    hostname: app.get('host') || '127.0.0.1',
    protocol: 'http',
    port,
    pathname
});

describe('Feathers application server tests', () => {
    let server: Server;

    before(function(done) {
        server = app.listen(port);
        server.once('listening', () => done());
    });

    after(function(done) {
        server.close(done);
    });

    it('starts and shows the index page', async () => {
        try {
            const res = await axios.get(getUrl('does/not/exist'));
            assert.fail("This method should not pass since the page does not exist");
        } catch (error) {
            assert.equal(error.response.status,404);
        }
    });



});
