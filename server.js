const express = require("express")
const axios = require("axios")
const dotenv = require("dotenv")
dotenv.config()

const app = express()
app.use(express.json())

app.post("/tv-webhook", async (req, res) => {
  const { ticker, tf, event } = req.body
  const message = `${ticker} hit the ${tf} ${event}`

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message
    })
    console.log("✅ Sent to Telegram:", message)
    res.sendStatus(200)
  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message)
    res.sendStatus(500)
  }
})

// ✅ Use Render's required port
const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at http://localhost:${PORT}`)
})
