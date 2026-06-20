import type { PortfolioHolding } from "../types/portfolio";

const API_URL = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export async function getPortfolio(): Promise<
  PortfolioHolding[]
> {
  const response = await fetch(
    `${API_URL}/portfolio`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch portfolio"
    );
  }

  return response.json();
}

export async function createHolding(
  data: {
    ticker: string;
    quantity: number;
    average_price: number;
    purchase_date: string;
  }
): Promise<PortfolioHolding> {
  const response = await fetch(
    `${API_URL}/portfolio`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create holding"
    );
  }

  return response.json();
}

export async function updateHolding(
  id: number,
  data: {
    ticker: string;
    quantity: number;
    average_price: number;
    purchase_date: string;
  }
): Promise<PortfolioHolding> {
  const response = await fetch(
    `${API_URL}/portfolio/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update holding"
    );
  }

  return response.json();
}

export async function deleteHolding(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/portfolio/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete holding"
    );
  }
}

export async function getHolding(
  id: number
): Promise<PortfolioHolding> {
  const response = await fetch(
    `${API_URL}/portfolio/${id}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch holding"
    );
  }

  return response.json();
}