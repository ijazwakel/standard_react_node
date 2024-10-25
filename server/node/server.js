import express from "express";
import "dotenv/config";
import cors from 'cors'
import { PayfastPayment } from "./controller/payfast.controller.js";
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import bodyParser from "body-parser";
import { getPaymentDetails, StripePayment } from "./controller/stripe.controller.js";
const app = express();
app.use(bodyParser.json());
app.use(cors())

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8080 } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new OrdersController(client);

// Create an order to start the transaction
const createOrder = async (amount, currency) => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.CAPTURE,
      purchaseUnits: [
        {
          amount: {
            currencyCode: currency, // Use the passed currency
            value: amount.toFixed(2), // Use the passed amount
          },
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCreate(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

// Capture payment for the created order
const captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

// API endpoint to create an order
app.post("/api/orders", async (req, res) => {
  try {
    // Get the amount and currency from the request body
    const { amount, currency } = req.body; // Expecting { amount: <amount>, currency: <currency> }
    const { jsonResponse, httpStatusCode } = await createOrder(amount, currency);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// API endpoint to capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});
app.get('/get-payment-details/:sessionId', getPaymentDetails)
app.post('/stripe', StripePayment)
app.post('/api/pay', PayfastPayment)


app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});
