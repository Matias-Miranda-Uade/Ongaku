import { useContext, createContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createFavorite, deleteFavorite, getFavorites } from '../services/api';
export const FavoritesContext = createContext(null);
export const FavoritesProvider = ({
  children
}) => {
  const {
    user,
    isAdmin
  } = useContext(AuthContext);
  const [error, setError] = useState('');
  const busy = useRef(new Set());
  const currentUserId = useRef(user?.id);
  currentUserId.current = user?.id;
  const [favorites, setFavorites] = useState([]); //{id, name, artist, price, stock}
  useEffect(() => {
    let active = true;
    setFavorites([]);
    setError('');
    if (user && !isAdmin) getFavorites().then(data => {
      if (active) setFavorites(data);
    }).catch(requestError => {
      if (active) setError(requestError.message);
    });
    return () => {
      active = false;
    };
  }, [user?.id, isAdmin]);
  const isFavorite = id => favorites.some(product => product.id === id);
  const removeFavorite = id => {
    const requestUserId = user?.id;
    if (busy.current.has(id)) return Promise.resolve();
    busy.current.add(id);
    setError('');
    return Promise.resolve().then(() => {
      const favorite = favorites.find(product => product.id === id);
      if (user && favorite) {
        return Promise.resolve(deleteFavorite(favorite.favoriteId)).then(() => {
          if (currentUserId.current !== requestUserId) return;
          setFavorites(current => current.filter(product => product.id !== id));
        });
      } else {
        if (currentUserId.current !== requestUserId) return;
        setFavorites(current => current.filter(product => product.id !== id));
      }
    }).catch(requestError => {
      setError(requestError.message);
    }).finally(() => {
      busy.current.delete(id);
    });
  };

  // Si ya era favorito lo quita, si no lo agrega
  const toggleFavorite = product => {
    if (isAdmin) {
      setError('Los favoritos están disponibles para compradores.');
      return Promise.resolve();
    }
    if (isFavorite(product.id)) {
      return removeFavorite(product.id).then(() => {});
    } else {
      if (busy.current.has(product.id)) return Promise.resolve();
      busy.current.add(product.id);
      setError('');
      return Promise.resolve().then(() => {
        const requestUserId = user?.id;
        return (user ? Promise.resolve(createFavorite(product.id)) : Promise.resolve(null)).then(saved => {
          if (currentUserId.current !== requestUserId) return;
          setFavorites(current => [...current, {
            ...product,
            favoriteId: saved?.id
          }]);
        });
      }).catch(requestError => {
        setError(requestError.message);
      }).finally(() => {
        busy.current.delete(product.id);
      });
    }
  };
  return <FavoritesContext.Provider value={{
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite
  }}>
            {error && <p className="storage-notice" role="alert">{error}</p>}
            {children}
        </FavoritesContext.Provider>;
};
