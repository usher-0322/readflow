const DB = 'readflow-db', STORE = 'state', KEY = 'app'
export function loadState() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const tx = req.result.transaction(STORE, 'readonly')
      const get = tx.objectStore(STORE).get(KEY)
      get.onsuccess = () => resolve(get.result || null)
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
