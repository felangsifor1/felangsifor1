import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Notebook from "./pages/Notebook.jsx";
import 'antd/dist/reset.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notebook" element={<Notebook />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;