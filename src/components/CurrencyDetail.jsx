import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react"

const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY

function CurrencyDetail() {
  const { symbol } = useParams()
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
const res = await fetch(
  `https://api.currencylayer.com/live?access_key=${API_KEY}`
)
        const json = await res.json()

        console.log("API response:", json)

        if (!json.success) throw new Error("Failed to load data")

        const currencyValue = json.quotes[`USD${symbol}`]
        if (!currencyValue) throw new Error("Currency not found")

        setValue(currencyValue)
      } catch (err) {
        console.error(err)
        setError("Failed to load details.")
      }
    }

    fetchData()
  }, [symbol])

  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (!value) return <p>Loading...</p>

   return (
    <div className="detail-page">
      <h2>Details for {symbol}</h2>
      <p><strong>Exchange Rate:</strong> 1 USD = {value} {symbol}</p>
      <p>This is the current exchange rate from USD to {symbol}. Rates are updated live via CurrencyLayer.</p>
      <Link to="/" style={{ color: "blue" }}>← Back to Dashboard</Link>

    </div>
  )
}

export default CurrencyDetail
