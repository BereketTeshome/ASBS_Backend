const pool = require("./db"); // make sure this points to your db config

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Connection error:", err);
  } else {
    console.log("✅ Connected to Supabase DB at:", res.rows[0].now);
  }
});
