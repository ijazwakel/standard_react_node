import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const StripePayment = async (req, res) => {
    const frontend_url = "http://localhost:3000"; // Update with your frontend URL
    try {
        // Prepare the line item for the payment
        const line_items = [
            {
                price_data: {
                    currency: req.body.currency, // Accept currency from request
                    product_data: {
                        name: "Student Fee", // Name of the product or service
                    },
                    unit_amount: req.body.amount * 100, // Stripe requires the amount in cents
                },
                quantity: 1, // Since it's a fixed payment, we can set the quantity to 1
            },
        ];

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Allow card payments
            line_items: line_items, // Set the line items created above
            mode: "payment", // Single payment mode
            success_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}&success=true`, // Success URL after payment
            cancel_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}&success=false`, // Cancel URL if the payment fails
        });

        // Send the session URL to the frontend for redirection
        res.json({ success: true, session_url: session.url, session: session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getPaymentDetails = async (req, res) => {
    const { sessionId } = req.params;

    try {
        // Retrieve the Stripe Checkout session using the session ID
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if the session was found
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Send the session details back to the client
        res.json(session);
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

