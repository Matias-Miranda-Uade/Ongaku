import { useCallback, useEffect, useState } from 'react';
import ShowcaseHeader from '../../components/admin/showcase/ShowcaseHeader';
import ShowcaseFilters, { DEFAULT_SHOWCASE_FILTERS } from '../../components/admin/showcase/ShowcaseFilters';
import ShowcaseTable from '../../components/admin/showcase/ShowcaseTable';
import { indexById, normalizeText } from '../../components/admin/adminUtils';
import { getAdminVinyls, getCatalogLookups, setVinylEnabled } from '../../services/adminService';
const MODE_STORAGE_KEY = 'ongaku-admin-showcase-mode';
const readStoredMode = () => window.localStorage.getItem(MODE_STORAGE_KEY) === 'batch' ? 'batch' : 'instant';
const ShowcasePage = () => {
  const [lookups, setLookups] = useState({
    artists: [],
    genres: [],
    categories: []
  });
  const {
    genres
  } = lookups;
  const artistsById = indexById(lookups.artists);
  const genresById = indexById(lookups.genres);
  useEffect(() => {
    let active = true;
    getCatalogLookups().then(data => {
      if (active) setLookups(data);
    }).catch(error => {
      if (active) setError(error.message);
    });
    return () => {
      active = false;
    };
  }, []);
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('instant');
  useEffect(() => {
    Promise.resolve().then(readStoredMode).then(setMode).catch(() => setMode('instant'));
  }, []);
  const [filters, setFilters] = useState(DEFAULT_SHOWCASE_FILTERS);
  const [pending, setPending] = useState(() => new Map());
  const [selection, setSelection] = useState(() => new Set());
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [applying, setApplying] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    setError('');
    return getAdminVinyls().then(_result => {
      setVinyls(_result);
    }).catch(loadError => {
      setError(loadError.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    Promise.resolve()
      .then(() => window.localStorage.setItem(MODE_STORAGE_KEY, mode))
      .catch(() => {});
  }, [mode]);
  useEffect(() => {
    if (pending.size === 0) return undefined;
    const handler = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [pending]);
  const isEnabled = useCallback(vinyl => pending.has(vinyl.id) ? pending.get(vinyl.id) : Boolean(vinyl.enabled), [pending]);
  const isPending = useCallback(id => pending.has(id), [pending]);
  const rows = vinyls.map(vinyl => ({
    ...vinyl,
    artistName: artistsById[String(vinyl.artistId)]?.name ?? '',
    genreName: (vinyl.genreIds?.length ? vinyl.genreIds : [vinyl.genreId]).map(id => genresById[String(id)]?.name).filter(Boolean).join(' / ')
  }));
  function calculateVisibleRows() {
    const term = normalizeText(filters.search);
    return rows.filter(row => {
      const enabled = isEnabled(row);
      if (term && ![row.name, row.artistName].some(value => normalizeText(value).includes(term))) return false;
      if (filters.visibility === 'visible' && !enabled) return false;
      if (filters.visibility === 'hidden' && enabled) return false;
      if (filters.stock === 'in' && !(row.stock > 0)) return false;
      if (filters.stock === 'out' && row.stock > 0) return false;
      if (filters.genreId && !(row.genreIds?.length ? row.genreIds : [row.genreId]).map(String).includes(filters.genreId)) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, 'es', {
      sensitivity: 'base'
    }));
  }
  const visibleRows = calculateVisibleRows();
  const counts = rows.reduce((acc, row) => {
    const enabled = isEnabled(row);
    if (enabled) acc.published += 1;else acc.hidden += 1;
    if (enabled && !(row.stock > 0)) acc.soldOut.push(row.id);
    return acc;
  }, {
    published: 0,
    hidden: 0,
    soldOut: []
  });
  const markSaving = (ids, saving) => setSavingIds(current => {
    const next = new Set(current);
    ids.forEach(id => saving ? next.add(id) : next.delete(id));
    return next;
  });
  const persist = changes => {
    const ids = changes.map(([id]) => id);
    markSaving(ids, true);
    return Promise.allSettled(changes.map(([id, enabled]) => setVinylEnabled(id, enabled))).then(results => {
      markSaving(ids, false);
      const updated = new Map();
      const failed = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') updated.set(result.value.id, result.value);else failed.push({
          id: changes[index][0],
          message: result.reason?.message
        });
      });
      setVinyls(current => current.map(vinyl => updated.has(vinyl.id) ? {
        ...vinyl,
        ...updated.get(vinyl.id)
      } : vinyl));
      return {
        updatedIds: [...updated.keys()],
        failed
      };
    });
  };
  const describeResult = (updatedCount, failed) => {
    if (failed.length === 0) {
      setNotice(`${updatedCount} vinilo${updatedCount === 1 ? '' : 's'} actualizado${updatedCount === 1 ? '' : 's'} en la vitrina.`);
      setError('');
    } else {
      setNotice(updatedCount ? `${updatedCount} actualizados.` : '');
      setError(`${failed.length} cambio${failed.length === 1 ? '' : 's'} no se pudo aplicar: ${failed[0].message}`);
    }
  };
  const changeVisibility = (ids, enabled) => {
    setNotice('');
    const byId = new Map(vinyls.map(vinyl => [vinyl.id, vinyl]));
    if (mode === 'batch') {
      setPending(current => {
        const next = new Map(current);
        ids.forEach(id => {
          if (Boolean(byId.get(id)?.enabled) === enabled) next.delete(id);else next.set(id, enabled);
        });
        return next;
      });
      return Promise.resolve();
    }
    const changes = ids.filter(id => Boolean(byId.get(id)?.enabled) !== enabled).map(id => [id, enabled]);
    if (changes.length === 0) return Promise.resolve();
    return persist(changes).then(({
      updatedIds,
      failed
    }) => {
      if (changes.length > 1 || failed.length) describeResult(updatedIds.length, failed);
    });
  };
  const handleApply = () => {
    setApplying(true);
    return persist([...pending.entries()]).then(({
      updatedIds,
      failed
    }) => {
      setPending(current => {
        const next = new Map(current);
        updatedIds.forEach(id => next.delete(id));
        return next;
      });
      describeResult(updatedIds.length, failed);
      setApplying(false);
    });
  };
  const handleModeChange = nextMode => {
    setPending(new Map());
    setMode(nextMode);
  };
  const handleSelect = (id, checked) => setSelection(current => {
    const next = new Set(current);
    if (checked) next.add(id);else next.delete(id);
    return next;
  });
  const handleSelectAll = (ids, checked) => setSelection(current => {
    const next = new Set(current);
    ids.forEach(id => checked ? next.add(id) : next.delete(id));
    return next;
  });
  const handleBulk = enabled => {
    return changeVisibility([...selection], enabled).then(() => {
      setSelection(new Set());
    });
  };
  return <section className="admin-page" aria-labelledby="showcase-title">
      <ShowcaseHeader publishedCount={counts.published} hiddenCount={counts.hidden} soldOutPublished={counts.soldOut.length} mode={mode} onModeChange={handleModeChange} pendingCount={pending.size} applying={applying} loading={loading} onApply={handleApply} onDiscard={() => setPending(new Map())} onRefresh={load} onHideSoldOut={() => changeVisibility(counts.soldOut, false)} />

      {error && <div className="admin-alert" role="alert">
          <p>{error}</p>
          <button type="button" className="link-button" onClick={load}>Recargar</button>
        </div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <ShowcaseFilters filters={filters} onChange={setFilters} genres={genres} resultCount={visibleRows.length} />

      <ShowcaseTable rows={visibleRows} loading={loading} selection={selection} onSelect={handleSelect} onSelectAll={handleSelectAll} onClearSelection={() => setSelection(new Set())} onToggle={(vinyl, enabled) => changeVisibility([vinyl.id], enabled)} onBulk={handleBulk} isEnabled={isEnabled} isPending={isPending} savingIds={savingIds} busy={applying || savingIds.size > 0} />
    </section>;
};
export default ShowcasePage;
