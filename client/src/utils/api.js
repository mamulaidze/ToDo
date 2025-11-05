const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function post(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function get(path) {
  const res = await fetch(API_BASE + path, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
