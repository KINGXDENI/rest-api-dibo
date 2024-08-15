export const generateApiKey = (): string => {
  const randomString = Math.random().toString(36).substring(2, 18);
  return `dibo-${randomString}`;
};
