api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);