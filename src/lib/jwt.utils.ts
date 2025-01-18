export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e: unknown) {
    console.log(e);
    console.trace(e);
    return null;
  }
};

export const validateTime = (token: string) => {
  const decoded = parseJwt(token);
  const Time = Date.now();
  return decoded.exp * 1000 < Time;
};
