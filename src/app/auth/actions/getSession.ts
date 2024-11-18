export const getSessionInformation = async () => {
  const response = await fetch('/api/auth');
  const session = await response.json();
  return session;
}