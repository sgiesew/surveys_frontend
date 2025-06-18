const ROLE_KEY = "Surveys_ROLE";

export const getRole = () => localStorage.getItem(ROLE_KEY);
export const setRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const removeRole = () => localStorage.removeItem(ROLE_KEY);
export const hasRole = () => !!getRole();
