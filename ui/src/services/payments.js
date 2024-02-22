import axios from "axios";

const userServiceBaseUrl = "http://localhost:8080";

export const getPayments = async () => {
  const { data } = await axios.get(`${userServiceBaseUrl}/payments`);
  return data;
};

// this currently "pays" everyone who's requested amount is null
// /payments api logged one new payment with no payment amount or application uuid
export const createPayment = async ({ applicationUuid, requestedAmount }) => {
  console.log("app uuid", applicationUuid) // this is returning undefined
  console.log("requested amount", requestedAmount) // also undefined
  const { data } = await axios.post(`${userServiceBaseUrl}/payments`, {
    applicationUuid,
    paymentAmount: requestedAmount,
  });
  console.log(data)
  return data;
};
