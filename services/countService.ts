import { join, dirname } from 'path';
import { LowSync, JSONFileSync } from 'lowdb';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface IData {
  count: number;
}
const file = join(__dirname, '.data.json');
const adapter = new JSONFileSync<IData>(file);
const db = new LowSync<IData>(adapter);

class CountService {
  getCount() {
    db.read();

    if (!db.data) {
      db.data = { count: 1 };
      db.write();
    }

    return db.data.count;
  }

  setCount(count: number) {
    db.read();
    db.data!.count = Number(count);
    db.write();
  }
}

export default new CountService();
