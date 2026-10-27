const TOKEN_STORAGE_KEY = 'ongaku-access-token';
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? '';
export const getAccessToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY);
export const setAccessToken = token => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};
export const clearAccessToken = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};
const readData = payload => payload && Object.hasOwn(payload, 'data') ? payload.data : payload;
export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.fieldErrors = {};
    const field = /Campo invalido '([^']+)':\s*(.+)/i.exec(message);
    if (field) this.fieldErrors[field[1]] = field[2];
    errors.forEach(entry => {
      const match = /^([\w.]+):\s*(.+)$/.exec(entry);
      if (match) this.fieldErrors[match[1]] = match[2];
    });
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isConflict() {
    return this.status === 409;
  }
  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
}
export const request = (url, options = {}) => {
  const token = getAccessToken();
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? {
        'Content-Type': 'application/json'
      } : {}),
      ...(token ? {
        Authorization: `Bearer ${token}`
      } : {}),
      ...options.headers
    }
  }).catch(() => {
    throw new ApiError('No se pudo conectar con el servidor. Verificá que el backend esté disponible.');
  }).then(response => {
    const body = response.status === 204 ? Promise.resolve(null) : response.json().catch(() => null);
    return body.then(payload => {
      if (!response.ok) {
        const errors = payload && Array.isArray(payload.errors) ? payload.errors : [];
        const details = errors.length ? ` ${errors.join(' ')}` : '';
        const fallback = response.status >= 500 ? 'El servidor no pudo procesar la solicitud. Verificá que el backend esté iniciado y volvé a intentar.' : `Error HTTP ${response.status}`;
        const message = payload && payload.message ? payload.message : fallback;
        throw new ApiError(`${message}${details}`, response.status, errors);
      }
      if (response.status !== 204 && payload === null) {
        throw new ApiError('El servidor devolvió una respuesta inválida. Verificá la dirección de la API.', 502);
      }
      return readData(payload);
    });
  });
};
export const jsonRequest = (method, body) => ({
  method,
  ...(body === undefined ? {} : {
    body: JSON.stringify(body)
  })
});
const normalizeCartItem = item => ({
  ...item,
  id: item.vinylId,
  price: item.finalPrice ?? item.unitPrice,
  artist: item.artistName
});
export const normalizeCart = cart => ({
  ...cart,
  items: (cart?.items ?? []).map(normalizeCartItem)
});
export const normalizeOrder = (order, payments = []) => ({
  ...order,
  status: order.orderStatus?.name ?? order.status ?? 'PENDIENTE',
  payment: payments.find(payment => String(payment.orderId) === String(order.id)) ?? order.payment ?? null,
  items: (order.items ?? []).map(item => ({
    ...item,
    unitPrice: item.finalPrice ?? item.unitPrice,
    review: item.review ?? null
  }))
});
export const login = ({
  email,
  password
}) => {
  return request('/api/v1/auth/authenticate', jsonRequest('POST', {
    email,
    password
  })).then(response => {
    const token = response?.['access token'] ?? response?.accessToken;
    if (!token) throw new Error('El servidor no devolvió un token de acceso válido.');
    setAccessToken(token);
    return getProfile().catch(error => {
      clearAccessToken();
      throw error;
    });
  });
};
export const register = ({
  firstName,
  lastName,
  email,
  password
}) => {
  return request('/api/v1/auth/register', jsonRequest('POST', {
    firstName,
    lastName,
    email,
    password
  })).then(response => {
    const token = response?.['access token'] ?? response?.accessToken;
    if (!token) throw new Error('El servidor no devolvió un token de acceso válido.');
    setAccessToken(token);
    return getProfile().catch(error => {
      clearAccessToken();
      throw error;
    });
  });
};
export const logout = () => {
  return request('/api/v1/auth/logout', jsonRequest('POST')).then(() => {}).finally(() => {
    clearAccessToken();
  });
};
export const getProfile = () => {
  return request('/users/me');
};
export const updateProfile = profile => {
  return request('/users/me', jsonRequest('PATCH', profile));
};
export const changePassword = ({
  currentPassword,
  newPassword
}) => {
  return request('/users/me/password', jsonRequest('PATCH', {
    currentPassword,
    newPassword
  }));
};
export const getCart = () => {
  return request('/carts').then(_result4 => {
    return normalizeCart(_result4);
  });
};
export const addCartItem = (vinylId, quantity = 1) => {
  return request('/carts/items', jsonRequest('POST', {
    vinylId,
    quantity
  })).then(_result5 => {
    return normalizeCart(_result5);
  });
};
export const updateCartItem = (vinylId, quantity) => {
  return request(`/carts/items/${vinylId}`, jsonRequest('PATCH', {
    quantity
  })).then(_result6 => {
    return normalizeCart(_result6);
  });
};
export const removeCartItem = vinylId => {
  return request(`/carts/items/${vinylId}`, jsonRequest('DELETE')).then(_result7 => {
    return normalizeCart(_result7);
  });
};
export const clearServerCart = () => {
  return request('/carts/items', jsonRequest('DELETE')).then(_result8 => {
    return normalizeCart(_result8);
  });
};
export const getOrders = () => {
  return Promise.all([request('/orders'), getPayments()]).then(([orders, payments]) => {
    return Array.isArray(orders) ? orders.map(order => normalizeOrder(order, payments)) : [];
  });
};
export const getOrder = orderId => {
  return Promise.all([request(`/orders/${orderId}`), getPayments()]).then(([order, payments]) => {
    return normalizeOrder(order, payments);
  });
};
export const getPayments = () => {
  return request('/payments').then(data => {
    return Array.isArray(data) ? data : [];
  });
};
export const createPayment = ({
  orderId,
  amount,
  method = 'SIMULADO',
  savedCardId,
  addressId
}) => request('/payments', jsonRequest('POST', {
  orderId,
  amount,
  method,
  ...(savedCardId == null ? {} : {
    savedCardId
  }),
  ...(addressId == null ? {} : {
    addressId
  })
}));
export const createOrder = () => {
  return request('/orders', jsonRequest('POST')).then(_result9 => {
    return normalizeOrder(_result9);
  });
};
export const getSavedCards = () => request('/users/me/cards');
export const saveCard = (card, id) => request(id == null ? '/users/me/cards' : `/users/me/cards/${id}`, jsonRequest(id == null ? 'POST' : 'PATCH', card));
export const deleteCard = id => request(`/users/me/cards/${id}`, jsonRequest('DELETE'));
export const getAddresses = () => request('/users/me/addresses');
export const saveAddress = (address, id) => request(id == null ? '/users/me/addresses' : `/users/me/addresses/${id}`, jsonRequest(id == null ? 'POST' : 'PATCH', address));
export const deleteAddress = id => request(`/users/me/addresses/${id}`, jsonRequest('DELETE'));
export const getFavorites = () => {
  return Promise.all([request('/favorites'), getVinyls()]).then(([favorites, vinyls]) => {
    return favorites.flatMap(favorite => {
      const vinyl = vinyls.find(item => String(item.id) === String(favorite.vinylId));
      return vinyl ? [{
        ...vinyl,
        favoriteId: favorite.id,
        artist: vinyl.artistName,
        price: vinyl.finalPrice ?? vinyl.price
      }] : [];
    });
  });
};
export const createFavorite = vinylId => request('/favorites', jsonRequest('POST', {
  vinylId
}));
export const deleteFavorite = id => request(`/favorites/${id}`, jsonRequest('DELETE'));
export const cancelOrder = orderId => {
  return request(`/orders/${orderId}/status`, jsonRequest('PATCH', {
    status: 'CANCELADA'
  })).then(_result0 => {
    return normalizeOrder(_result0);
  });
};
export const getMyReviews = () => {
  return request('/reviews/me').then(reviews => {
    return Array.isArray(reviews) ? reviews : [];
  });
};
export const createReview = ({
  vinylId,
  score,
  comment
}) => {
  return request('/reviews', jsonRequest('POST', {
    vinylId,
    score,
    comment
  }));
};
export const getVinyls = () => {
  return Promise.all([request('/vinyls'), getVinylLookups()]).then(([data, lookups]) => {
    return (Array.isArray(data) ? data : []).map(vinyl => normalizeVinyl(vinyl, lookups));
  });
};
export const getVinylById = id => {
  return Promise.all([request(`/vinyls/${encodeURIComponent(id)}`), getVinylLookups()]).then(([vinyl, lookups]) => {
    return normalizeVinyl(vinyl, lookups);
  });
};
const getVinylLookups = () => {
  return Promise.all([request('/artists'), request('/genres'), request('/categories')]).then(([artists, genres, categories]) => {
    const index = items => Object.fromEntries((Array.isArray(items) ? items : []).map(item => [item.id, item]));
    return {
      artists: index(artists),
      genres: index(genres),
      categories: index(categories)
    };
  });
};
const normalizeVinyl = (vinyl, lookups) => ({
  ...vinyl,
  artistName: lookups.artists[vinyl.artistId]?.name ?? vinyl.artistName,
  genreName: lookups.genres[vinyl.genreId]?.name ?? vinyl.genreName,
  genreNames: (vinyl.genreIds?.length ? vinyl.genreIds : vinyl.genreId ? [vinyl.genreId] : []).map(id => lookups.genres[id]?.name).filter(Boolean),
  categoryDescription: lookups.categories[vinyl.categoryId]?.description ?? vinyl.categoryDescription
});
export const getReviews = vinylId => {
  const query = vinylId == null ? '' : `?vinylId=${encodeURIComponent(vinylId)}`;
  return request(`/reviews${query}`).then(data => {
    return Array.isArray(data) ? data : [];
  });
};
export const getReviewsByVinyl = vinylId => {
  return request(`/reviews/vinyl/${encodeURIComponent(vinylId)}`).then(data => {
    return {
      reviews: data?.reviews ?? [],
      averageScore: data?.averageScore ?? 0,
      totalReviews: data?.totalReviews ?? 0
    };
  });
};
export const updateReview = (reviewId, {
  score,
  comment
}) => request(`/reviews/${encodeURIComponent(reviewId)}`, jsonRequest('PATCH', {
  score,
  comment
}));
export const getReviewEligibility = vinylId => request(`/reviews/vinyl/${encodeURIComponent(vinylId)}/eligibility`);
export const deleteReview = reviewId => request(`/reviews/${encodeURIComponent(reviewId)}`, jsonRequest('DELETE'));
export const getAudioPreview = audioPreviewId => {
  if (!audioPreviewId) return Promise.resolve(null);
  return request(`/audio-previews/${encodeURIComponent(audioPreviewId)}`);
};
