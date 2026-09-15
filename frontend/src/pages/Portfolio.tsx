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
import { getAnalysis } from "../services/analysisService";
import AIResearchReport from "../components/AIResearchReport";
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

  useEffect(() => {
    // fetchPortfolio is defined above so it can be reused elsewhere
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
  type AnalysisResult = {
    analysis: {
      recommendation: string;
      confidence_score: number;
      summary: string;
    };
  } | null;

  const [analysis, setAnalysis] =
    useState<AnalysisResult>(null);

  const [
    analysisLoading,
    setAnalysisLoading,
  ] = useState(false);

  const [
    selectedTicker,
    setSelectedTicker,
  ] = useState("");

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
const handleAnalyze = async (
  ticker: string
) => {
  try {
    setAnalysisLoading(true);

    const result =
      await getAnalysis(
        ticker
      );

    setAnalysis(result);

    setSelectedTicker(
      ticker
    );
  } catch (error) {
    console.error(error);
  } finally {
    setAnalysisLoading(false);
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

  // define fetchPortfolio here so other handlers can call it
  async function fetchPortfolio() {
    try {
      const data = await getPortfolio();
      setHoldings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
        onAnalyze={handleAnalyze}
      />
      <AIResearchReport
        analysis={analysis}
        loading={analysisLoading}
        ticker={selectedTicker}
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