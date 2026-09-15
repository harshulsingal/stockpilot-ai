const API_URL =
  "http://localhost:8000";

export async function getAnalysis(
  ticker: string
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response = await fetch(
    `${API_URL}/analysis/${ticker}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch analysis"
    );
  }

  return response.json();
}