import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import CruiseCostPage from './pages/CruiseCostPage'
import DrinkPackagePage from './pages/DrinkPackagePage'
import HomePage from './pages/HomePage'
import PackingPage from './pages/PackingPage'
import PlannerPage from './pages/PlannerPage'
import ToolsPage from './pages/ToolsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/drink-package" element={<DrinkPackagePage />} />
        <Route path="/tools/cruise-cost" element={<CruiseCostPage />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
