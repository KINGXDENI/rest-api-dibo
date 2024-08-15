export const parseUserAuthCookie = (cookieValue: string) => {
  const decodedValue = decodeURIComponent(cookieValue);
  const parts = decodedValue.split(":");
  const email = parts[1];
  const apiKey = parts[2];
  const name = parts[3]; // Ensure this matches your cookie structure

  return { email, apiKey, name };
};
