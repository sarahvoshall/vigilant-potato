import { render, waitFor, screen } from "@testing-library/react";
import App from "./App";
import { getUsers } from "./services/users";
import { getApplications } from "./services/applications";
import { getPayments } from "./services/payments";

jest.mock("./services/users");
jest.mock("./services/applications");
jest.mock("./services/payments");

afterEach(() => {
  jest.resetAllMocks();
});

test("table renders with headers", async () => {
  getUsers.mockResolvedValue({
    body: [
      {
        uuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        name: "Astrid Gillan",
        email: "agillan0@acquirethisname.com",
      },
    ],
  });
  getApplications.mockResolvedValue({
    body: [
      {
        uuid: "01b35179-134c-4bb1-af36-a9663c009fcd",
        userUuid: "4aaf4534-531d-4c98-b838-23460fb34e5b",
        requestedAmount: 44798,
      },
    ],
  });
  getPayments.mockResolvedValue({
    body: [
      {
        uuid: "8722073f-6520-44b7-a6ab-f04de644324d",
        applicationUuid: "01b35179-134c-4bb1-af36-a9663c009fcd",
        paymentMethod: "ACH",
        paymentAmount: 44798,
      },
    ],
  });

  render(<App />);
  await waitFor(() => screen.getByRole("table"));
  const uuidHeader = screen.getByText(/Uuid/g);
  expect(uuidHeader).toBeInTheDocument();
  const nameHeader = screen.getByText(/Name/g);
  expect(nameHeader).toBeInTheDocument();
  const emailHeader = screen.getByText(/Email/g);
  expect(emailHeader).toBeInTheDocument();
  const requestedAmountHeader = screen.getByText(/Requested Amount/g);
  expect(requestedAmountHeader).toBeInTheDocument();
  const paymentAmountHeader = screen.getByText(/Payment Amount/g);
  expect(paymentAmountHeader).toBeInTheDocument();
  const paymentMethodHeader = screen.getByText(/Payment Method/g);
  expect(paymentMethodHeader).toBeInTheDocument();
  const initiatePaymentHeader = screen.getByText(/Initiate Payment/g);
  expect(initiatePaymentHeader).toBeInTheDocument();
});

test("the pay button does not render for users without an application", async () => {
  getUsers.mockResolvedValue({
    body: [
      {
        uuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        name: "Astrid Gillan",
        email: "agillan0@acquirethisname.com",
      },
    ],
  });
  getApplications.mockResolvedValue({
    body: [],
  });
  getPayments.mockResolvedValue({
    body: [],
  });

  render(<App />);
  await waitFor(() => screen.getByRole("table"));

  const payButton = screen.queryByRole("button");
  expect(payButton).not.toBeInTheDocument();
});

test("the pay button does not render for users who have been paid", async () => {
  getUsers.mockResolvedValue({
    body: [
      {
        uuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        name: "Astrid Gillan",
        email: "agillan0@acquirethisname.com",
      },
    ],
  });
  getApplications.mockResolvedValue({
    body: [
      {
        uuid: "01b35179-134c-4bb1-af36-a9663c009fcd",
        userUuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        requestedAmount: 44798,
      },
    ],
  });
  getPayments.mockResolvedValue({
    body: [
      {
        uuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        applicationUuid: "01b35179-134c-4bb1-af36-a9663c009fcd",
        paymentMethod: "ACH",
        paymentAmount: 44798,
      },
    ],
  });

  render(<App />);
  await waitFor(() => screen.getByRole("table"));

  const payButton = screen.queryByRole("button");
  expect(payButton).not.toBeInTheDocument();
});

test("the pay button does render for eligible users", async () => {
  getUsers.mockResolvedValue({
    body: [
      {
        uuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        name: "Astrid Gillan",
        email: "agillan0@acquirethisname.com",
      },
    ],
  });
  getApplications.mockResolvedValue({
    body: [
      {
        uuid: "01b35179-134c-4bb1-af36-a9663c009fcd",
        userUuid: "a2ee3f67-2c01-4f9c-be0f-ff3b98474173",
        requestedAmount: 44798,
      },
    ],
  });
  getPayments.mockResolvedValue({
    body: [],
  });

  render(<App />);
  await waitFor(() => screen.getByRole("table"));

  const payButton = screen.getByRole("button");
  expect(payButton).toBeInTheDocument();
});
