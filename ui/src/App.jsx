import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/table.jsx";
import { Container, Button, TablePagination } from "@material-ui/core";
import formatCurrency from "./utils/formatCurrency";

import { getUsers } from "./services/users.js";
import { createPayment } from "./services/payments.js";

const App = () => {
  /**
   * Hydrate data for the table and set state for users, applications, and payments
   */
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [pageState, setPageState] = useState({ offset: 0, limit: 10, page: 0 });

  useEffect(() => {
    async function fetchData() {
      const data = await getUsers(pageState.offset, pageState.limit);

      setUsers(data.users);
      setApplications(data.applications);
      setPayments(data.payments);
      setDataLoaded(true);
    }
    fetchData();
  }, [pageState]);

  const initiatePayment = async ({ applicationUuid, requestedAmount }) => {
    const { body } = await createPayment({
      applicationUuid,
      requestedAmount,
    });
    setPayments([...payments, body]);
  };

  let tableData = [];
  if (dataLoaded) {
    console.log(users);
    tableData = users.map(({ uuid, name, email }) => {
      const { requestedAmount, uuid: applicationUuid } =
        applications.find((application) => application.userUuid === uuid) || {};
      const { paymentAmount, paymentMethod } =
        payments.find(
          (payment) => payment.applicationUuid === applicationUuid
        ) || {};

      // Format table data to be passed into the table component, pay button tacked
      // onto the end to allow payments to be issued for each row
      return {
        uuid,
        name,
        email,
        requestedAmount: formatCurrency(requestedAmount),
        paymentAmount: formatCurrency(paymentAmount),
        paymentMethod,
        initiatePayment:
          requestedAmount && !paymentAmount ? (
            <Button
              onClick={() =>
                initiatePayment({
                  applicationUuid,
                  requestedAmount,
                })
              }
              variant="contained"
            >
              Pay
            </Button>
          ) : null,
      };
    });
  }

  const handleChangePage = (e, page) => {
    if (page > pageState.page) {
      setPageState({
        ...pageState,
        offset: pageState.offset + pageState.limit,
        page: pageState.page + 1,
      });
    } else {
      setPageState({
        ...pageState,
        offset: pageState.offset - pageState.limit,
        page: pageState.page - 1,
      });
    }
  };

  const handleChangeRowsPerPage = (e) => {
    setPageState({ ...pageState, limit: e.target.value });
  };

  return (
    <div className="App">
      <Container>
        {dataLoaded && <Table data={tableData} />}{" "}
        <TablePagination
          component="div"
          count={-1}
          page={pageState.page}
          onPageChange={handleChangePage}
          rowsPerPage={pageState.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
    </div>
  );
};

export default App;
