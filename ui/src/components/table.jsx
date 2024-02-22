import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables({ data }) {
  const classes = useStyles();

  const headers = data.reduce((output, entry) => {
    const result = output;
    Object.keys(entry).forEach((key) => {
      if (!result.includes(key)) result.push(key);
    });
    return result;
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((key) => {
              return (
                <StyledTableCell key={key}>
                  {
                    // Convert camelcased values to uppercased values to be used as
                    // dynamic headers
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })
                  }
                </StyledTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.name}>
              {headers.map((key) => {
                return (
                  <StyledTableCell key={`${row.name}-${key}`}>
                    {row[key]}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
