import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase.ts";

// Define interfaces for each collection type
export interface Archery {
  id: string;
  username: string;
  score: number;
}

export interface Boxing {
  id: string;
  username: string;
  score: number;
}

export interface Diving {
  id: string;
  username: string;
  score: number;
}

export interface Javelin {
  id: string;
  username: string;
  score: number;
}

export interface Jump {
  id: string;
  username: string;
  time: number;
}

export interface Running {
  id: string;
  username: string;
  time: number;
}

export interface Swimming {
  id: string;
  username: string;
  time: number;
}

export interface Tennis {
  id: string;
  username: string;
  score: number;
}

export type Collection =
  | "archery"
  | "boxing"
  | "diving"
  | "javelin"
  | "jump"
  | "running"
  | "swimming"
  | "tennis";

export type TimeBasedCollection = "jump" | "running" | "swimming";
export type ScoreBasedCollection =
  | "archery"
  | "boxing"
  | "diving"
  | "javelin"
  | "tennis";

export type CollectionDataMap = {
  archery: Archery;
  boxing: Boxing;
  diving: Diving;
  javelin: Javelin;
  jump: Jump;
  running: Running;
  swimming: Swimming;
  tennis: Tennis;
};

export function isArchery(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Archery {
  return (result as Archery).score !== undefined;
}

export function isBoxing(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Boxing {
  return (result as Boxing).score !== undefined;
}

export function isDiving(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Diving {
  return (result as Diving).score !== undefined;
}

export function isJavelin(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Javelin {
  return (result as Javelin).score !== undefined;
}

export function isJump(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Jump {
  return (result as Jump).time !== undefined;
}

export function isRunning(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Running {
  return (result as Running).time !== undefined;
}

export function isSwimming(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Swimming {
  return (result as Swimming).time !== undefined;
}

export function isTennis(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Tennis {
  return (result as Tennis).score !== undefined;
}

export const isTimeBasedCollection = (
  collectionName: Collection,
): collectionName is TimeBasedCollection => {
  return ["jump", "running", "swimming"].includes(collectionName);
};

export const isScoreBasedCollection = (
  collectionName: Collection,
): collectionName is ScoreBasedCollection => {
  return ["archery", "boxing", "diving", "javelin", "tennis"].includes(
    collectionName,
  );
};

export const fetchResults = async <T extends Collection>(
  collectionName: T,
): Promise<CollectionDataMap[T][]> => {
  const results = await getDocs(collection(db, collectionName));
  return results.docs.map(
    (doc) =>
      ({ ...doc.data(), id: doc.id }) as CollectionDataMap[T] & { id: string },
  );
};

const insertNewRecord = async <T extends Collection>(
  collectionName: T,
  newRecord: number,
  username: string,
): Promise<void> => {
  const newDoc = isTimeBasedCollection(collectionName)
    ? { username, time: newRecord }
    : { username, score: newRecord };

  await addDoc(collection(db, collectionName), newDoc);
};

const removeWorstRecord = async <T extends Collection>(
  collectionName: T,
  worstRecordId: string,
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, worstRecordId));
};

export const handleNewRecord = async <T extends Collection>(
  collectionName: T,
  newRecord: number,
  username: string,
): Promise<void> => {
  const results = await fetchResults(collectionName);

  if (results.length < 10) {
    // Insert new record if there are fewer than 10 records
    return await insertNewRecord(collectionName, newRecord, username);
  }

  if (isTimeBasedCollection(collectionName)) {
    const worstCurrentRecord = results.reduce((max, record) =>
      (max as Jump | Running | Swimming).time >
      (record as Jump | Running | Swimming).time
        ? max
        : record,
    ) as Jump | Running | Swimming;

    if (newRecord < worstCurrentRecord.time) {
      await insertNewRecord(collectionName, newRecord, username);
      return await removeWorstRecord(collectionName, worstCurrentRecord.id);
    }
  } else if (isScoreBasedCollection(collectionName)) {
    const worstCurrentRecord = results.reduce((min, record) =>
      (min as Archery | Boxing | Diving | Javelin).score <
      (record as Archery | Boxing | Diving | Javelin).score
        ? min
        : record,
    ) as Archery | Boxing | Diving | Javelin;

    if (newRecord > worstCurrentRecord.score) {
      await removeWorstRecord(collectionName, worstCurrentRecord.id);
      return await insertNewRecord(collectionName, newRecord, username);
    }
  } else {
    throw new Error("Invalid collection name");
  }
};
