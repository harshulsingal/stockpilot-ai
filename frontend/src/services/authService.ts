export const getCurrentUser =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        "http://127.0.0.1:8000/auth/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch user"
      );
    }

    return response.json();
  };