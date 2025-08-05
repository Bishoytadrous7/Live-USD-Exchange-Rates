import { useEffect, useState } from "react"
import './App.css'
import { Link } from "react-router-dom"
import Sidebar from "./components/Sidebar"

import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,PieChart, Pie, Cell, Legend} from "recharts";


const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY

function Dashboard() {
  const [rates, setRates] = useState({})
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [valueFilter, setValueFilter] = useState("all")
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(3)
  const [showCharts, setShowCharts] = useState(true)

  const searchItems = (searchValue, filter = valueFilter, min = minValue, max = maxValue) => {
    setSearchInput(searchValue)

    let filteredData = Object.entries(rates).filter(([key]) =>
      key.toLowerCase().includes(searchValue.toLowerCase())
    )

    if (filter === "high") {
      filteredData = filteredData.filter(([_, val]) => val > 1.5)
    } else if (filter === "medium") {
      filteredData = filteredData.filter(([_, val]) => val > 1.0 && val <= 1.5)
    } else if (filter === "low") {
      filteredData = filteredData.filter(([_, val]) => val <= 1.0)
    }

    filteredData = filteredData.filter(([_, val]) =>
      val >= min && val <= max
    )

    setFilteredResults(filteredData)
  }

  const handleFilterChange = (e) => {
    const newFilter = e.target.value
    setValueFilter(newFilter)
    searchItems(searchInput, newFilter)
  }

  const handleMinSlider = (e) => {
    const val = parseFloat(e.target.value)
    setMinValue(val)
    searchItems(searchInput, valueFilter, val, maxValue)
  }

  const handleMaxSlider = (e) => {
    const val = parseFloat(e.target.value)
    setMaxValue(val)
    searchItems(searchInput, valueFilter, minValue, val)
  }

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.currencylayer.com/live?access_key=${API_KEY}`
        )

        const data = await response.json()
        if (!data.success) throw new Error("API call failed")

        setRates(data.quotes)
        setFilteredResults(Object.entries(data.quotes))
      } catch (err) {
        console.error(err)
        setError("Failed to load currency data")
      }
    }

    fetchRates()
  }, [])

  const values = Object.values(rates)
  const total = values.length
  const highest = Math.max(...values)
  const average = (values.reduce((a, b) => a + b, 0) / total).toFixed(2)
// Top 10 highest rates
const top10 = Object.entries(rates)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([pair, rate]) => ({ name: pair.slice(3), rate }));

// Value category breakdown
let high = 0, medium = 0, low = 0;
Object.values(rates).forEach(rate => {
  if (rate > 1.5) high++;
  else if (rate > 1.0) medium++;
  else low++;
});
const categoryData = [
  { name: "High (>1.5)", value: high },
  { name: "Medium (1.0-1.5)", value: medium },
  { name: "Low (≤1.0)", value: low },
];
const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

  return (
  <div className="layout">
    <Sidebar />
    <div className="main-content">
      <h1>Live USD Exchange Rates</h1>

      <div className="stats">
        <div className="stat">
          <h3>Total currencies</h3>
          <p>{total}</p>
        </div>
        <div className="stat">
          <h3>Highest rate</h3>
          <p>{highest}</p>
        </div>
        <div className="stat">
          <h3>Average rate</h3>
          <p>{average}</p>
        </div>
      </div>
      <button onClick={() => setShowCharts(prev => !prev)}>
  {showCharts ? "Hide Charts" : "Show Charts"}
</button>
{showCharts && (
  <div className="charts-container">
    <div className="bar-chart">
      <h2>Top 10 Exchange Rates</h2>
      <BarChart width={500} height={250} data={top10}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rate" fill="#8884d8" />
      </BarChart>
    </div>

    <div className="pie-chart">
      <h2>Rate Category Distribution</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
          dataKey="value"
        >
          {categoryData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  </div>
)}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      <input
        type="text"
        placeholder="Search currency code..."
        onChange={(e) => searchItems(e.target.value)}
        value={searchInput}
      />

      <label>Filter by rate category:</label>
      <select value={valueFilter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="high">High (&gt; 1.5)</option>
        <option value="medium">Medium (1.0 - 1.5)</option>
        <option value="low">Low (&le; 1.0)</option>
      </select>

      <div>
        <label>Min Rate: {minValue}</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={minValue}
          onChange={handleMinSlider}
        />

        <label>Max Rate: {maxValue}</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={maxValue}
          onChange={handleMaxSlider}
        />
      </div>

      <ul>
        {filteredResults.map(([pair, value]) => {
          const symbol = pair.slice(3)
          return (
            <li key={pair}>
              <Link to={`/currencyDetails/${symbol}`}>
                {symbol}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  </div>
)
}


export default Dashboard
