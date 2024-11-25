const storeInSession = (key, value) => {
  // to store the key and value in session
  return sessionStorage.setItem(key, value);
};

const lookInSession = (key) => {
  // to retrieve any data from the session
  return sessionStorage.getItem(key);
};

const removeFromSession = (key) => {
  // to remove the data from session
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  // to clear all the sessions
  sessionStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
