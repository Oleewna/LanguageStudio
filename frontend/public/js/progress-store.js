(function (window) {
  function encodePart(value) {
    return encodeURIComponent(String(value ?? ''));
  }

  function getUserWordsCollectionKey(courseId, wordId) {
    const safeCourse = String(courseId || '').trim() || 'it';
    const safeWord = String(wordId || '').trim();
    return `${safeCourse}:${safeWord}`;
  }

  class LocalStorageAdapter {
    constructor(userId = 'local') {
      this.userId = String(userId || 'local');
    }

    getKey(collection, id) {
      return `ls_${encodePart(this.userId)}_${encodePart(collection)}_${encodePart(id)}`;
    }

    get(collection, id) {
      if (typeof window.getJSON === 'function') {
        return window.getJSON(this.getKey(collection, id), null);
      }
      try {
        const raw = localStorage.getItem(this.getKey(collection, id));
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    set(collection, id, record) {
      const key = this.getKey(collection, id);
      if (typeof window.setJSON === 'function') {
        if (!window.setJSON(key, record)) {
          throw new Error('Could not save progress data.');
        }
      } else {
        localStorage.setItem(key, JSON.stringify(record));
      }
      return record;
    }

    update(collection, id, patch) {
      const current = this.get(collection, id) || {};
      return this.set(collection, id, { ...current, ...patch });
    }

    list(collection, filter) {
      if (typeof localStorage === 'undefined') return [];

      const prefix = `ls_${encodePart(this.userId)}_${encodePart(collection)}_`;
      const records = [];

      try {
        for (let index = 0; index < localStorage.length; index += 1) {
          const key = localStorage.key(index);
          if (!key || !key.startsWith(prefix)) continue;

          let record = null;
          if (typeof window.getJSON === 'function') {
            record = window.getJSON(key, null);
          } else {
            const raw = localStorage.getItem(key);
            record = raw ? JSON.parse(raw) : null;
          }
          if (record === null) continue;
          if (typeof filter === 'function' && !filter(record)) continue;
          if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
            const matches = Object.entries(filter).every(([field, value]) => record[field] === value);
            if (!matches) continue;
          }
          records.push(record);
        }
      } catch (error) {
        return [];
      }

      return records;
    }

    remove(collection, id) {
      if (typeof localStorage === 'undefined') return false;
      try {
        localStorage.removeItem(this.getKey(collection, id));
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  class ApiAdapter {
    constructor(userId, options = {}) {
      this.userId = String(userId || 'user');
      this.baseUrl = options.baseUrl || '/api/progress';
      this._cache = new Map();
      this._queue = [];
      this._isFlushing = false;
      this._retryTimeout = null;

      this._loadCacheFromStorage();
      this._loadQueueFromStorage();

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('online', () => {
          this.flushQueue();
        });
      }
    }

    getCacheKey(collection, id) {
      return `ls_apicache_${encodePart(this.userId)}_${encodePart(collection)}_${encodePart(id)}`;
    }

    getQueueKey() {
      return `ls_apiqueue_${encodePart(this.userId)}`;
    }

    _loadCacheFromStorage() {
      if (typeof localStorage === 'undefined') return;
      const prefix = `ls_apicache_${encodePart(this.userId)}_`;
      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              this._cache.set(key, JSON.parse(raw));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }

    _loadQueueFromStorage() {
      if (typeof localStorage === 'undefined') return;
      try {
        const raw = localStorage.getItem(this.getQueueKey());
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this._queue = parsed;
          }
        }
      } catch (e) {
        this._queue = [];
      }
    }

    _persistQueue() {
      if (typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(this.getQueueKey(), JSON.stringify(this._queue));
      } catch (e) {}
    }

    _readCache(collection, id) {
      const key = this.getCacheKey(collection, id);
      if (this._cache.has(key)) {
        return this._cache.get(key);
      }
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            this._cache.set(key, parsed);
            return parsed;
          }
        } catch (e) {}
      }
      return null;
    }

    _writeCache(collection, id, record) {
      const key = this.getCacheKey(collection, id);
      this._cache.set(key, record);
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(record));
        } catch (e) {}
      }
      return record;
    }

    _removeCache(collection, id) {
      const key = this.getCacheKey(collection, id);
      this._cache.delete(key);
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      }
      return true;
    }

    get(collection, id) {
      return this._readCache(collection, id);
    }

    set(collection, id, record) {
      const safeRecord = record && typeof record === 'object' ? { ...record } : record;
      this._writeCache(collection, id, safeRecord);

      // Enqueue to write-through offline queue
      this._queue.push({
        op: 'put',
        collection,
        id,
        record: safeRecord,
        timestamp: Date.now()
      });
      this._persistQueue();

      this.flushQueue();
      return safeRecord;
    }

    update(collection, id, patch) {
      const current = this.get(collection, id) || {};
      const updated = { ...current, ...patch };
      return this.set(collection, id, updated);
    }

    list(collection, filter) {
      const prefix = `ls_apicache_${encodePart(this.userId)}_${encodePart(collection)}_`;
      const records = [];

      for (const [key, record] of this._cache.entries()) {
        if (!key.startsWith(prefix) || record === null) continue;
        if (typeof filter === 'function' && !filter(record)) continue;
        if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
          const matches = Object.entries(filter).every(([field, value]) => record[field] === value);
          if (!matches) continue;
        }
        records.push(record);
      }

      return records;
    }

    remove(collection, id) {
      this._removeCache(collection, id);

      this._queue.push({
        op: 'delete',
        collection,
        id,
        timestamp: Date.now()
      });
      this._persistQueue();

      this.flushQueue();
      return true;
    }

    async flushQueue() {
      if (this._isFlushing || this._queue.length === 0) return;
      if (typeof fetch !== 'function') return;

      this._isFlushing = true;
      try {
        let csrfToken = null;
        if (typeof document !== 'undefined') {
          const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
          if (match) csrfToken = decodeURIComponent(match[1]);
        }

        while (this._queue.length > 0) {
          const item = this._queue[0];
          const url = `${this.baseUrl}/${encodeURIComponent(item.collection)}/${encodeURIComponent(item.id)}`;
          const headers = { 'Content-Type': 'application/json' };
          if (csrfToken) headers['x-csrf-token'] = csrfToken;

          let response;
          try {
            if (item.op === 'put') {
              response = await fetch(url, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(item.record)
              });
            } else if (item.op === 'delete') {
              response = await fetch(url, {
                method: 'DELETE',
                headers,
                credentials: 'include'
              });
            }
          } catch (networkError) {
            // Offline or network error: schedule retry and stop flushing
            this._scheduleRetry();
            break;
          }

          if (response && response.ok) {
            // Update cache with server response if PUT returned merged record
            if (item.op === 'put') {
              try {
                const saved = await response.json();
                if (saved && typeof saved === 'object') {
                  this._writeCache(item.collection, item.id, saved);
                }
              } catch (e) {}
            }
            this._queue.shift();
            this._persistQueue();
          } else if (response && response.status === 404 && item.op === 'delete') {
            this._queue.shift();
            this._persistQueue();
          } else if (response && (response.status >= 500 || response.status === 429)) {
            // Server error or rate-limited: schedule retry
            this._scheduleRetry();
            break;
          } else {
            // Client error (400, 401, etc.): drop problematic item or pause
            if (response && response.status === 401) {
              // Not authenticated, stop flushing until logged in
              break;
            }
            this._queue.shift();
            this._persistQueue();
          }
        }
      } finally {
        this._isFlushing = false;
      }
    }

    _scheduleRetry() {
      if (this._retryTimeout) return;
      const schedule = typeof setTimeout === 'function' ? setTimeout : (fn) => fn();
      this._retryTimeout = schedule(() => {
        this._retryTimeout = null;
        this.flushQueue();
      }, 5000);
    }

    async hydrateFromServer() {
      if (typeof fetch !== 'function') return;
      try {
        const res = await fetch(this.baseUrl, { credentials: 'include', cache: 'no-store' });
        if (!res.ok) return;
        const snapshot = await res.json();
        const mergeFn = (window.__LSProgressConflict && window.__LSProgressConflict.mergeRecord) || ((a, b) => ({ ...a, ...b }));

        const collections = ['profile', 'daily', 'lessonProgress', 'wordStats', 'position', 'customWords'];
        collections.forEach((coll) => {
          const recordsMap = snapshot[coll] || {};
          Object.entries(recordsMap).forEach(([id, remoteRec]) => {
            if (!remoteRec || typeof remoteRec !== 'object') return;
            const current = this.get(coll, id);
            const merged = current ? mergeFn(current, remoteRec, coll) : remoteRec;
            this._writeCache(coll, id, merged);
          });
        });

        // Trigger queue flush after hydrating
        this.flushQueue();
      } catch (e) {
        // Hydration error (e.g. offline) - continue using local cache
      }
    }
  }

  window.getUserWordsCollectionKey = getUserWordsCollectionKey;
  window.__LSProgressAdapters = { LocalStorageAdapter, ApiAdapter };
})(typeof window !== 'undefined' ? window : globalThis);
