const express = require("express")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
app.use(express.json())

app.post("/tv-webhook", async (req, res) => {
  const { ticker, tf, event } = req.body

  if (!ticker || !tf || !event) {
    console.error("❌ Missing one or more required fields: ticker, tf, event")
    return res.status(400).send("Missing fields")
  }

  // Format the message
  let message = ""
  if (event === "demand") {
    message = `${ticker} hit the ${tf} demand zone`
  } else if (event === "supply") {
    message = `${ticker} hit the ${tf} supply zone`
  } else {
    message = `${ticker} hit the ${tf} ${event} zone`
  }

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message
    })
    console.log("✅ Sent to Telegram:", message)
    res.status(200).send("OK")
  } catch (error) {
    console.error("❌ Telegram Error:", error.response?.data || error.message)
    res.sendStatus(500)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at http://localhost:${PORT}`)
})
