import { firestore } from '../firebase/firebase'; // Import firestore from your Firebase config

export const addPostToFirestore = async (postText, displayName, userId, score, browserInfo) => {
  const timestamp = Timestamp.fromDate(new Date());

  const docRef = firestore.collection('posts').doc();
  await docRef.set({
    postText,
    displayName,
    userId,
    score,
    browserInfo,
    createdAt: timestamp,
  });
};