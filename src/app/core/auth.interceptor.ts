import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // If the request already carries its own Authorization header (e.g. employee portal),
  // let it through untouched so we don't overwrite it with the business token.
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  // Support both the new and legacy token key
  const token = localStorage.getItem('accounteezy_token') || localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
