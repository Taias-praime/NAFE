import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordNew from "./pages/auth/ResetPasswordNew";
import Dashboard from "./pages/Dashboard";
import ChiefOfArmyStaff from "./pages/ChiefOfArmyStaff";
import AdminLayout from "./AdminLayout";
import Events from "./pages/Events";
import Departments from "./pages/Departments";
import Users from "./pages/Users";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/reset',
        children: [
            {
                path: '',
                element: <ResetPassword />
            },
            {
                path: 'new',
                element: <ResetPasswordNew />
            }
        ]
    },
    {
        path: '/',
        element: 
            <AdminLayout> 
                <Outlet /> 
            </AdminLayout>,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'chief-of-army-staff',
                element: <ChiefOfArmyStaff />
            },
            {
                path: 'events',
                element: <Events />
            },
            {
                path: 'departments',
                element: <Departments />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'announcements',
                element: <Announcements />
            },
            {
                path: 'settings',
                element: <Settings />
            },
        ]
    }

]);

export default router;