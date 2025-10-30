export const isLoggedIn = () => !!localStorage.getItem("adminToken");

export const saveLogin = () => localStorage.setItem("adminToken", "true");

export const logout = () => localStorage.removeItem("adminToken");
