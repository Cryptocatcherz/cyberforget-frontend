import React from 'react';
import { useAuth } from "../hooks/useAuthUtils";
import HourlyScansTest from '../components/HourlyScansTest';
import HourlyScansComponent from '../components/HourlyScansComponent';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import Sidebar from '../components/Sidebar';
import './Dashboard.css'; // Reuse dashboard styles

const HourlyScansTestPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        minHeight: '100vh'
      }}>
        <h2>Please log in to test hourly scans</h2>
        <p>You need to be authenticated to use the scanning features.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <MobileNavbar />
      
      <div className="dashboard-page">
        <Sidebar />
        
        <div className="content-wrapper">
          <div className="dashboard-main">
            <div className="dashboard-content">
              <div style={{ 
                marginBottom: '30px',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <h1 style={{ 
                  color: '#00ff88', 
                  marginBottom: '10px',
                  fontSize: '2rem'
                }}>
                  🚀 Hourly Scans Testing
                </h1>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  fontSize: '1.1rem'
                }}>
                  Test and configure your automated hourly scanning system
                </p>
                <div style={{ 
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <strong>Current User:</strong> {user.firstName} {user.lastName} ({user.email})
                  <br />
                  <strong>User ID:</strong> {user.id}
                </div>
              </div>

              {/* Test Component */}
              <HourlyScansTest />

              {/* Production Component */}
              <div style={{ marginTop: '30px' }}>
                <div style={{ 
                  marginBottom: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white'
                }}>
                  <h2 style={{ 
                    color: '#00ff88', 
                    marginBottom: '8px',
                    fontSize: '1.5rem'
                  }}>
                    🎨 Production Component Preview
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0
                  }}>
                    This is how the hourly scans will look in the production dashboard
                  </p>
                </div>
                
                <HourlyScansComponent />
              </div>

              {/* Instructions */}
              <div style={{
                marginTop: '30px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
              }}>
                <h3 style={{ 
                  color: '#60a5fa',
                  marginBottom: '16px',
                  fontSize: '1.3rem'
                }}>
                  📋 Testing Checklist
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ color: '#34d399', marginBottom: '8px' }}>✅ Connection Test</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <li>Socket shows "Connected" status</li>
                      <li>User ID is displayed correctly</li>
                      <li>Browser console shows connection logs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#34d399', marginBottom: '8px' }}>🔄 Functionality Test</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <li>"Request Status" returns data</li>
                      <li>"Start Hourly Scan" initiates scanning</li>
                      <li>Progress bar updates in real-time</li>
                      <li>"Stop Scan" halts the process</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#34d399', marginBottom: '8px' }}>📊 Real-time Updates</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <li>Event logs show socket messages</li>
                      <li>Current site updates during scan</li>
                      <li>Metrics update automatically</li>
                      <li>Status changes reflect correctly</li>
                    </ul>
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <strong style={{ color: '#f59e0b' }}>⚠️ Troubleshooting:</strong>
                  <br />
                  • If socket shows "Disconnected", check that your backend server is running on localhost:5002
                  <br />
                  • If buttons are disabled, verify your authentication token is valid
                  <br />
                  • Check browser console (F12) for detailed error messages
                  <br />
                  • Ensure your user ID matches what the backend expects
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourlyScansTestPage; 