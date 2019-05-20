import Dexie from 'dexie';

/**
 * Indexeddb wrapper that gives us access to various tables
 */
class ApplicationDatabase extends Dexie {
  constructor() {
    super('simulus.db');
    this.version(1).stores({
      scenarios: 'id',
    });
  }
}

const database = new ApplicationDatabase();
database.open();

/**
 * The application's singleton database instance
 */
export default database;
