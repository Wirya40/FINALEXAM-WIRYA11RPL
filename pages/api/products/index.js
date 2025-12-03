// pages/api/products/index.js
export default async function handler(req, res) {
  const API_URL = "https://course.summitglobal.id/products";

  try {
    if (req.method === "GET") {
      const response = await fetch(API_URL);
      const json = await response.json();

      // Transform API response to match frontend expectation
      const products = json.body?.data || [];
      return res.status(200).json({ data: products });
    }

    if (req.method === "POST") {
      const body = req.body;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await response.json();
      return res.status(200).json(json);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ data: [] });
  }
}
