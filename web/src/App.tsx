import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from '@/router'
import '@/locale'
import './App.css'
import MainHeader from '@/components/MainHeader'

const App = () => {
  return (
    <div className="App">
      <header>
        <MainHeader />
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </main>
      <footer className="text-center">
        <span className="text-gray-500 text-sm">Copyright (c) CRP Team</span>
      </footer>
    </div>
  )
}

export default App
