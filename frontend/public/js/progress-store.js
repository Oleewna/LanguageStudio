(function (window) {
  function encodePart(value) {
    return encodeURIComponent(String(value ?? ''));
  }

  class LocalStorageAdapter {
    constructor(userId = 'local') {
      this.userId = String(userId || 'local');
    }

    getKey(collection, id) {
      return `ls_${encodePart(this.userId)}_${encodePart(collection)}_${encodePart(id)}`;
    }

    get(collection, id) {
      return window.getJSON(this.getKey(collection, id), null);
    }

    set(collection, id, record) {
      if (!window.setJSON(this.getKey(collection, id), record)) {
        throw new Error('Could not save progress data.');
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

          const record = window.getJSON(key, null);
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

  window.__LSProgressAdapters = { LocalStorageAdapter };
})(window);