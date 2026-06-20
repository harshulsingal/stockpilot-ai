import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import {
  createHolding,
  updateHolding,
  deleteHolding,
} from "../services/portfolioService";

import type { PortfolioHolding } from "../types/portfolio";


type Props = {
  open: boolean;
  holding: PortfolioHolding | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function HoldingDialog({
  open,
  holding,
  onClose,
  onSuccess,
}: Props) {
  const [ticker, setTicker] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [averagePrice, setAveragePrice] =
    useState("");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (holding) {
      setTicker(holding.ticker);

      setQuantity(
        holding.quantity.toString()
      );

      setAveragePrice(
        holding.average_price.toString()
      );

      setPurchaseDate(
        holding.purchase_date
      );
    } else {
      setTicker("");
      setQuantity("");
      setAveragePrice("");
      setPurchaseDate("");
    }
  }, [holding, open]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ticker: ticker.toUpperCase(),
        quantity: Number(quantity),
        average_price:
          Number(averagePrice),
        purchase_date: purchaseDate,
      };

      if (holding) {
        await updateHolding(
          holding.id,
          payload
        );
      } else {
        await createHolding(
          payload
        );
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {holding
          ? "Edit Holding"
          : "Add Holding"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{ mt: 1 }}
        >
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) =>
              setTicker(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Average Price"
            type="number"
            value={averagePrice}
            onChange={(e) =>
              setAveragePrice(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Purchase Date"
            type="date"
            value={purchaseDate}
            onChange={(e) =>
              setPurchaseDate(
                e.target.value
              )
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {holding
            ? "Update"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}