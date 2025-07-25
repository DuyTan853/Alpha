import React from "react";
import { Routes, Route } from "react-router-dom";

import ChatBot from "./pages/bot/ChatBot";
import About from "./pages/About";
import NotFound404 from "./pages/NotFound404";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
export default function App() {
  const routes = [
    { path: "/", element: <ChatBot /> },
    { path: "/about", element: <About /> },
    { path: "*", element: <NotFound404 /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ];

  return (
    <section className="min-h-screen bg-gray-100 text-gray-900">
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </section>
  );
}
