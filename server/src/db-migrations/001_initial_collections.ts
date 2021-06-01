import { Database } from "arangojs";
import type { DocumentCollection, EdgeCollection} from "arangojs/collection";
import type { PersistentIndex } from 'arangojs/indexes'
import type { ArangoSearchView, ArangoSearchViewPropertiesOptions,ArangoSearchViewLink } from "arangojs/view";

const up  = async (db: Database) : Promise<Boolean> => {
  try {
    // Create collections
    if(!await db.collection('polling_event').exists()) await db.collection('polling_event').create()
      if(!await db.collection('poll').exists()) await db.collection('poll').create()
      if(!await db.collection('user').exists()) await db.collection('user').create()
      if(!await db.collection('TESTING_SCENARIOS').exists()) await db.collection('TESTING_SCENARIOS').create()


      // Create edges
      if(!await db.collection('answer').exists()) await db.createEdgeCollection('answer')
      if(!await db.collection('participant').exists()) await db.createEdgeCollection('participant')


      return true
  } catch (error) {
      console.log('There was an error with running migration 001: ',error)
      return true;
  }

};

const down = async (db: Database) => {
  try {
     // Not needed since it is before production

    return true
  } catch (error) {
      console.log('There was an error with downgrading migration 001: ',error)
      return false;
  }

};

export {
  up,
  down,
}
