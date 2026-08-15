const DB = 'readflow-db', STORE = 'state', KEY = 'app'
const INITIAL_BOOK_IDS = new Set(['b1', 'b2', 'b3'])
const withoutInitialSamples = state => state ? {
  ...state,
  books: (state.books || []).filter(book => !INITIAL_BOOK_IDS.has(book.id)),
  sessions: (state.sessions || []).filter(session => !INITIAL_BOOK_IDS.has(session.bookId)),
  excerpts: (state.excerpts || []).filter(excerpt => !INITIAL_BOOK_IDS.has(excerpt.bookId))
} : null
export function loadState() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const tx = req.result.transaction(STORE, 'readonly')
      const get = tx.objectStore(STORE).get(KEY)
      get.onsuccess = () => resolve(withoutInitialSamples(get.result))
      get.onerror = () => reject(get.error)
    }
  })
}
export function saveState(state) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => { const tx = req.result.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(state, KEY); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error) }
    req.onerror = () => reject(req.error)
  })
}
