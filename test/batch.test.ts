import test from 'ava'
import { FirestoreSimple } from '../src/index'
import { createRandomCollectionName, deleteCollection, initFirestore } from './util'

const firestore = initFirestore()
const collectionPath = createRandomCollectionName()
const dao = new FirestoreSimple(firestore, collectionPath, { mapping: {
  bookTitle: 'book_title',
}})

// Delete all documents. (= delete collection)
test.after.always(async (_t) => {
  await deleteCollection(firestore, collectionPath)
})

test('bulkSet', async (t) => {
  const docs = [
    { id: 'test1', bookTitle: 'aaa' },
    { id: 'test2', bookTitle: 'bbb' },
    { id: 'test3', bookTitle: 'ccc' },
  ]
  await dao.bulkSet(docs)

  const actualDocs = await dao.fetchCollection()
  t.deepEqual(actualDocs, docs, 'success set multi docs')
})

test('bulkDelete', async (t) => {
  const docs = [
    { id: 'test1', bookTitle: 'aaa' },
    { id: 'test2', bookTitle: 'bbb' },
    { id: 'test3', bookTitle: 'ccc' },
  ]
  await dao.set(docs[0])
  await dao.set(docs[1])
  await dao.set(docs[2])

  const docIds = docs.map((doc) => doc.id)
  await dao.bulkDelete(docIds)

  const actualDocs = await dao.fetchCollection()
  t.deepEqual(actualDocs, [], 'success delete multi docs')
})
