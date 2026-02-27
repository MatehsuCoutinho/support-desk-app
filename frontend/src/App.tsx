import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./layouts/AppLayout";
import TicketsList from "./pages/TicketsList";
import CreateTicket from "./pages/CreateTicket";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketsList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
      </Route>
    </Routes>
  );
}

export default App;