export const getFullName = () => localStorage.getItem('userName');
export const getUserRole = () => localStorage.getItem('userRole');
export const getToken = () => localStorage.getItem('token');
export const getUser = () => ({
  token: localStorage.getItem('token'),
  email: localStorage.getItem('userEmail'),
  name: localStorage.getItem('userName'),
  role: localStorage.getItem('userRole'),
});

export const setAuthData = (userData) => {
  localStorage.setItem('token', userData.token);
  localStorage.setItem('userEmail', userData.user.email);
  localStorage.setItem('userName', userData.user.name);
  localStorage.setItem('userRole', userData.user.role);
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => !!localStorage.getItem('token');
