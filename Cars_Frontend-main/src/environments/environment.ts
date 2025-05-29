// environment.ts (для разработки)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (для продакшн-сборки)
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_BACKEND_SERVICE.onrender.com/api'
};

