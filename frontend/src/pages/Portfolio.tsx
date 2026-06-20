import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Button,
  Box,
} from "@mui/material";
import type { PortfolioHolding } from "../types/portfolio";

import PortfolioTable from "../components/PortfolioTable";
import HoldingDialog from "../components/HoldingDialog";
import {
  getPortfolio,
  deleteHolding,
} from "../services/portfolioService";

export default function Portfolio() {
  const [holdings, setHoldings] = useState<
    PortfolioHolding[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    selectedHolding,
    setSelectedHolding,
  ] = useState<
    PortfolioHolding | null
  >(null);

  const fetchPortfolio =
    async () => {
      try {
        const data =
          await getPortfolio();

        setHoldings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAdd = () => {
    setSelectedHolding(null);

    setDialogOpen(true);
  };

  const handleEdit = (
    holding: PortfolioHolding
  ) => {
    setSelectedHolding(holding);

    setDialogOpen(true);
  };

  const handleDelete = async (
  id: number
) => {
  try {
    await deleteHolding(id);

    setHoldings((prev) =>
      prev.filter(
        (holding) =>
          holding.id !== id
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  const handleCloseDialog =
    () => {
      setDialogOpen(false);

      setSelectedHolding(null);
    };

  const handleSaveSuccess =
    async () => {
      await fetchPortfolio();

      handleCloseDialog();
    };

  if (loading) {
    return (
      <Typography variant="h5">
        Loading...
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          Portfolio
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
        >
          Add Holding
        </Button>
      </Box>

      <PortfolioTable
        holdings={holdings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <HoldingDialog
        open={dialogOpen}
        holding={
          selectedHolding
        }
        onClose={
          handleCloseDialog
        }
        onSuccess={
          handleSaveSuccess
        }
      />
    </Container>
  );
}