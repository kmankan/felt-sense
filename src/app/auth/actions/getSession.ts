export const getSessionInformation = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`);
  const session = await response.json();
  return session;
}