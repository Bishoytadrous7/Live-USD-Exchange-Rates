import Dashboard from './Dashboard'
import DetailView from './routes/DetailView'
import { Link } from "react-router-dom";
import Info from "./routes/Info"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/currencyDetails/:symbol" element={<DetailView />} />
        <Route path="/info" element={<Info />} />
        <Route
          path="*"
          element={
            <main>
              <p>Page not found</p>
              <Link to="/" style={{ color: "blue" }}>← Back to Dashboard</Link>
            </main>
          }
        />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
