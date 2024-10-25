import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckPaymentPage from './pages/CheckPaymentPage';
import PaymentPage from './pages/payment.page';
import PaypalPayment from './components/PaypalPayment';
import StripeVerification from './components/StripeVerification';
import PayfastSuccess from './components/PayfastSuccess';
import LoginForm from './pages/login.page';
import { ProtectedRoute, AuthRoute } from './components/ProtectedRoute'; // Import ProtectedRoute and AuthRoute
import ProfilePage from './pages/profile.page';
import ClassesSchedule from './pages/classes_schedule';
import PaymentDetails from './pages/payment_details';
import InvoiceDetailsPage from './pages/invoice_details';
import StudentPaymentDetails from './components/FetchStudentPayment';
import AddStudentPage from './pages/add_student.page';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/stdclasses" element={<ProtectedRoute><ClassesSchedule /></ProtectedRoute>} />
        <Route path="/payment_details" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
        <Route path="/current_payment_details" element={<ProtectedRoute><StudentPaymentDetails /></ProtectedRoute>} />
        <Route path="/invoice_details" element={<ProtectedRoute><InvoiceDetailsPage /></ProtectedRoute>} />
        <Route path="/add_student" element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>} />
        {/* Payment route */}
        {/* <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} /> */}
        <Route path="/paypal-payment" element={<ProtectedRoute><PaypalPayment /></ProtectedRoute>} />
        <Route path="/CheckPaymentPage" element={<ProtectedRoute><CheckPaymentPage /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PayfastSuccess /></ProtectedRoute>} />
        <Route path="/login" element={<AuthRoute><LoginForm /></AuthRoute>} /> {/* Use AuthRoute here */}
        <Route path="/verify" element={<ProtectedRoute><StripeVerification /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
