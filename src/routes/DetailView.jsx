import CurrencyDetail from "../components/CurrencyDetail"
import Sidebar from "../components/Sidebar" 

function DetailView() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <CurrencyDetail />
      </div>
    </div>
  )
}

export default DetailView
