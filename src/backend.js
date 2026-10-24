const API = "/api/saved-work";

export async function syncSavedWork(record, title = "Farm record") {
  try {
    const response = await fetch(API, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "current-farm-record", module: record.module || "profile", title, payload: record }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function loadSavedWork() {
  try {
    const response = await fetch(API, { credentials: "include" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.items?.[0]?.payload || null;
  } catch {
    return null;
  }
}
