import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase.ts";

// Define interfaces for each collection type
interface Archery {
  id: string;
  username: string;
  score: number;
}

interface Boxing {
  id: string;
  username: string;
  score: number;
}

interface Diving {
  id: string;
  username: string;
  score: number;
}

interface Javelin {
  id: string;
  username: string;
  score: number;
}

interface Jump {
  id: string;
  username: string;
  time: number;
}

interface Running {
  id: string;
  username: string;
  time: number;
}

interface Swimming {
  id: string;
  username: string;
  time: number;
}

type Collection =
  | "archery"
  | "boxing"
  | "diving"
  | "javelin"
  | "jump"
  | "running"
  | "swimming";

type TimeBasedCollection = "jump" | "running" | "swimming";
type ScoreBasedCollection = "archery" | "boxing" | "diving" | "javelin";

type CollectionDataMap = {
  archery: Archery;
  boxing: Boxing;
  diving: Diving;
  javelin: Javelin;
  jump: Jump;
  running: Running;
  swimming: Swimming;
};

const isTimeBasedCollection = (
  collectionName: Collection,
): collectionName is TimeBasedCollection => {
  return ["jump", "running", "swimming"].includes(collectionName);
};

const isScoreBasedCollection = (
  collectionName: Collection,
): collectionName is ScoreBasedCollection => {
  return ["archery", "boxing", "diving", "javelin"].includes(collectionName);
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
