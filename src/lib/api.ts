const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const isJSON = contentType && contentType.includes("application/json");
  const data = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const submitLoanApplication = async (payload: Record<string, unknown>) => {
  // Try local or Vercel server endpoint first
  try {
    const response = await fetch(`${API_BASE_URL}/api/submit-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return handleResponse(response);
    }
  } catch (err) {
    console.warn("Primary submit endpoint failed, trying fallback...", err);
  }

  // Fallback to FormSubmit
  const fallbackResponse = await fetch("https://formsubmit.co/ajax/universal@lendingtreefunds.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(fallbackResponse);
};
