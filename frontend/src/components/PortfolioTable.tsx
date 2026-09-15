import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { PortfolioHolding } from "../types/portfolio";

type Props = {
  holdings: PortfolioHolding[];

  onEdit: (
    holding: PortfolioHolding
  ) => void;

  onDelete: (
    id: number
  ) => void;

  onAnalyze: (
    ticker: string
  ) => void;
};

export default function PortfolioTable({
  holdings,
  onEdit,
  onDelete,
  onAnalyze,
}: Props) {
  if (holdings.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography>
          No holdings found.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Ticker</strong>
            </TableCell>

            <TableCell>
              <strong>Company</strong>
            </TableCell>

            <TableCell>
              <strong>Quantity</strong>
            </TableCell>

            <TableCell>
              <strong>Avg Price</strong>
            </TableCell>

            <TableCell>
              <strong>
                Purchase Date
              </strong>
            </TableCell>

            <TableCell align="center">
              <strong>
                Actions
              </strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {holdings.map(
            (holding) => (
              <TableRow
                key={holding.id}
              >
                <TableCell>
                  {holding.ticker}
                </TableCell>

                <TableCell>
                  {
                    holding.company_name
                  }
                </TableCell>

                <TableCell>
                  {holding.quantity}
                </TableCell>

                <TableCell>
                  $
                  {
                    holding.average_price
                  }
                </TableCell>

                <TableCell>
                  {
                    holding.purchase_date
                  }
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    sx={{
                      mr: 1,
                      color:
                        "#60A5FA",
                    }}
                    onClick={() =>
                      onEdit(
                        holding
                      )
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      onDelete(
                        holding.id
                      )
                    }
                  >
                    Delete
                  </Button>

                  <Button
                    size="small"
                    color="success"
                    onClick={() =>
                      onAnalyze(
                        holding.ticker
                      )
                    }
                  >
                    Analyze
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}