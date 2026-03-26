export async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(
      `Invalid JSON response: ${text.slice(0, 100)}`
    );
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}