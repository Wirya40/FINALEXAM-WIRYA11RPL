// pages/api/products/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  const pid = Array.isArray(id) ? id[0] : id;

  if (req.method === "PUT") {
    try {
      // Forward the PUT request to the remote API
      const response = await fetch(`https://course.summitglobal.id/products?id=${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update product" });
    }
  }

  if (req.method === "GET") {
    try {
      const response = await fetch(`https://course.summitglobal.id/products?id=${pid}`);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
