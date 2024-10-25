

import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'


const placeOrder = async (event) => {
    const url = "http://localhost:8080"
    const location = useLocation();
    const navigate = useNavigate('/')
    const { amount, currency, email } = location.state || {};
    let orderData = {
        currency: currency,
        amount: amount
    }
    let response = await axios.post(url + "/stripe", orderData)
    if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url)
    } else {
        alert("Error")
    }
}


