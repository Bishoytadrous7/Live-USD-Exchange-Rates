import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Currency App</h2>
      <nav>
        <ul>
          <li><Link to="/">🏠 Dashboard</Link></li>
          <li><Link to="/info">📘 Learn More</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
