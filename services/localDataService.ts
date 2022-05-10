import { dirname, join } from 'path';
import { JSONFileSync, LowSync } from 'lowdb';
import { fileURLToPath } from 'url';
import { AnalyticsData } from '@/models/AnalyticsData';
import { IInputData } from './analyticsService';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface IData {
  count: number;
  analytics?: AnalyticsData;
  rawInputData?: IInputData[];
}
const file = join(__dirname, '.data.json');
const adapter = new JSONFileSync<IData>(file);
const db = new LowSync<IData>(adapter);

class LocalDataService {
  getCount() {
    db.read();

    if (!db.data) {
      db.data = { count: 0 };
      db.write();
    }

    return db.data.count;
  }

  setCount(count: number) {
    db.read();
    db.data!.count = Number(count);
    db.write();
  }

  getAnalytics() {
    db.read();

    return db.data?.analytics ?? null;
  }

  setAnalytics(data: AnalyticsData) {
    db.read();
    db.data!.analytics = data;
    db.write();
  }

  getRawInputData() {
    db.read();

    return db.data?.rawInputData ?? null;
  }

  setRawInputData(data: IInputData[]) {
    db.read();
    db.data!.rawInputData = data;
    db.write();
  }
}

export default new LocalDataService();
