const API_BASE = import.meta.env.VITE_API_URL + "/api"; 
// now API_BASE = https://todo-jwwi.onrender.com/api

export async function post(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ allows cookies on mobile + refresh
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function get(path) {
  const res = await fetch(API_BASE + path, {
    method: "GET",
    credentials: "include", // ✅ required
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
