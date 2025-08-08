import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout Components
import Header from "@/components/organisms/Header";

// Page Components
import Login from "@/components/pages/Login";
import Dashboard from "@/components/pages/Dashboard";
import SectionQuestions from "@/components/pages/SectionQuestions";
import ParticipantDetail from "@/components/pages/ParticipantDetail";
import ParticipantProfile from "@/components/pages/ParticipantProfile";
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };


  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
<Route 
            path="/" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          
          <Route path="/*" element={
            <div className="min-h-screen bg-gray-50">
              <Header 
currentUser={currentUser} 
                onLogout={handleLogout}
              />
              
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Routes>
                  <Route 
                    path="/dashboard" 
                    element={<Dashboard currentUser={currentUser} />} 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      currentUser?.role === "participant" ? (
                        <ParticipantProfile currentUser={currentUser} />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      currentUser?.role === "admin" ? (
                        <Dashboard currentUser={currentUser} />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/sections/:sectionId" 
                    element={
                      currentUser?.role === "participant" ? (
                        <SectionQuestions currentUser={currentUser} />
                      ) : (
                        <Navigate to="/admin" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/admin/participant/:participantId" 
                    element={
                      currentUser?.role === "admin" ? (
                        <ParticipantDetail />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    } 
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;