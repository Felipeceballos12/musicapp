import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schema, schema } from './schema';

const MUSICAPP_STORAGE = 'MUSICAPP_STORAGE';

export async function write(value: Schema) {
  schema.parse(value);
  await AsyncStorage.setItem(MUSICAPP_STORAGE, JSON.stringify(value));
}

export async function read(): Promise<Schema | undefined> {
  const rawData = await AsyncStorage.getItem(MUSICAPP_STORAGE);
  const objData = rawData ? JSON.parse(rawData) : undefined;

  if (schema.safeParse(objData).success) {
    return objData;
  }
}

export async function clear() {
  try {
    await AsyncStorage.removeItem(MUSICAPP_STORAGE);
  } catch (e: any) {
    console.info(`persisted store: failed to clear`, {
      error: e.toString(),
    });
  }
}
