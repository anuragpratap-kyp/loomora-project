const API_BASE = "https://loomora-weav.onrender.com";

export async function apiGet(path){
  try {
    const res = await fetch(API_BASE + path);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch(err){
      console.error("Invalid JSON:", text);
      return { message:"Invalid JSON response" };
    }
  } catch(err){
    console.error("Fetch error:", err);
    return { message:"Request failed" };
  }
}

export async function apiAuthed(method, path, body){
  const u = user();
  if(!u) return { message:"Not logged in" };
  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+u.token
      },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch(err){ console.error("Invalid JSON:", text); return { message:"Invalid JSON response" }; }
  } catch(err){
    console.error("Fetch error:", err);
    return { message:"Request failed" };
  }
}
