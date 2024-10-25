
const merchantId = 10035659; // Provided by PayFast
const securedKey = '6tnuqifq6x8v1'; // Provided by PayFast
export const PayfastPayment = async (req, res) => {
    const { studentId, amount } = req.body;

    try {
        // You can store and fetch student data from your database to check amount.
        const todaysDate = new Date().toISOString().split('T')[0];

        // You can use this data to send it to the PayFast sandbox for testing
        const paymentUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=${merchantId}&merchant_key=${securedKey}&amount=${amount}&item_name=Student_Fees_${studentId}&return_url=http://localhost:3000/payment/success&cancel_url=http://your-site.com/payment/cancel&notify_url=http://your-backend.com/payment/notify`;

        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}