interface RequestInfo {
  method: string;
  endpoint: string;
  handler: (response: object) => void,
  onError: (msg: unknown) => void,
  body?: object;
  token?: string,
}

// Helper function to make an HTTP request with a json payload to our server
export default async function request(info: RequestInfo) {
  let payload: RequestInit = {
    method: info.method,
    body: JSON.stringify(info.body),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  };

  if (info.token !== undefined) {
    payload.headers["authorization"] = `Bearer ${info.token}`;
  }

  const host = process.env.EXPO_PUBLIC_HOST;
  const url = `http://${host}:8080${info.endpoint}`;
  try {
    const response = await fetch(url, payload);
    const json = await response.json();
    info.handler(json);
  } catch (error) {
    info.onError(error);
  }
}
