import express, { application } from "express";
import UserModel from "./models/user.js";
import ApplicationModel from "./models/application.js";
import PaymentModel from "./models/payment.js";

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();

// Instantiate mocked "models" so that data can be persisted for the life of the server
const User = new UserModel();
const Application = new ApplicationModel();
const Payment = new PaymentModel();

// router.get('/users', (req, res) => {
//   const body = User.getAll();
//   res.json({ body });
// });

router.get("/users", (req, res) => {
  const userDataSlice = User.getSlice(
    Number(req.query.offset),
    Number(req.query.limit)
  );

  const applicationDataSlice = userDataSlice.map(
    (user) => Application.getByUserId(user.uuid) || {}
  );

  const paymentDataSlice = applicationDataSlice.map(
    (application) => Payment.getByApplicationId(application.uuid) || {}
  );

  const data = {
    users: userDataSlice,
    applications: applicationDataSlice,
    payments: paymentDataSlice,
  };

  res.json(data);
});

router.get("/applications", (req, res) => {
  const body = Application.getAll();
  res.json({ body });
});

router.get("/payments", (req, res) => {
  const body = Payment.getAll();
  res.json({ body });
});

router.post("/payments", (req, res) => {
  const body = Payment.create(req.body);
  res.json({ body });
});

export default router;
