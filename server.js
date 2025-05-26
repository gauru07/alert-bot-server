// server.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();


const app = express();
app.use(express.json());

app.post("/tv-webhook", async (req, res) => {
  const { script, ticker, tf, zone, price } = req.body;

  // validate required fields
  if (!ticker || !tf || !zone || !price) {
    console.error("❌ Missing one or more required fields:", req.body);
    return res
      .status(400)
      .send("Missing one or more required fields: ticker, tf, zone, price");
  }

  // build the human-friendly message
  const text = `${script}: ${ticker} hit the ${tf} ${zone} zone at ${price}`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text
      }
    );
    console.log("✅ Sent to Telegram:", text);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Telegram Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
