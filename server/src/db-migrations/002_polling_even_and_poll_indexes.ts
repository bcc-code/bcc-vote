import { Database } from "arangojs";
import type { PersistentIndex } from 'arangojs/indexes';
import {logger} from '../logger';

const up = async (db: Database): Promise<boolean> => {
    try {

        const pollingEventCollection = db.collection('polling_event');
        const typeIndex: PersistentIndex = {
            fields: ['type'],
            id: '1',
            sparse: false,
            type: 'persistent',
            unique: false,
            name: 'typeIndex'
        };
        await pollingEventCollection.ensureIndex(typeIndex);

        const lastChangedIndex: PersistentIndex = {
            fields: ['lastChanged'],
            id: '2',
            sparse: false,
            type: 'persistent',
            unique: false,
            name: 'lastChangedIndex'
        };
        await pollingEventCollection.ensureIndex(lastChangedIndex);

        const statusIndex: PersistentIndex = {
            fields: ['status'],
            id: '3',
            sparse: false,
            type: 'persistent',
            unique: false,
            name: 'statusIndex'
        };
        await pollingEventCollection.ensureIndex(statusIndex);

        const pollCollection = db.collection('poll');
        const pollingEventIdIndex: PersistentIndex = {
            fields: ['pollingEventId'],
            id: '1',
            sparse: false,
            type: 'persistent',
            unique: false,
            name: 'pollingEventIdIndex'
        };
        await pollCollection.ensureIndex(pollingEventIdIndex);

        const activeStatusIndex: PersistentIndex = {
            fields: ['activeStatus'],
            id: '2',
            sparse: false,
            type: 'persistent',
            unique: false,
            name: 'activeStatusIndex'
        };
        await pollCollection.ensureIndex(activeStatusIndex);

        return true;
    } catch (error) {
        logger.error('There was an error with running migration 002: ', error);
        return true;
    }

};

const down = async (db: Database):Promise<boolean> => {
    try {

        return true;
    } catch (error) {
        logger.error('There was an error with downgrading migration 002: ', error);
        return false;
    }

};

export {
    up,
    down,
};
