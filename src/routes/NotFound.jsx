import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <h2>404 - Page Not Found</h2>
      <p>There's nothing here!</p>
      <Link to="/">← Back to Home</Link>
    </main>
  )
}

export default NotFound
