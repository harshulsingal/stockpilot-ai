import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

type Props = {
  analysis: any;
  loading: boolean;
  ticker: string;
};

export default function AIResearchReport({
  analysis,
  loading,
  ticker,
}: Props) {
  if (loading) {
    return (
      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography>
          Generating AI Analysis...
        </Typography>
      </Paper>
    );
  }

  if (!analysis) {
    return null;
  }

  const report =
    analysis.analysis;

  const getRecommendationColor =
    (
      recommendation: string
    ) => {
      switch (
        recommendation?.toLowerCase()
      ) {
        case "buy":
          return "success";

        case "sell":
          return "error";

        default:
          return "warning";
      }
    };

  return (
    <Paper
      sx={{
        mt: 4,
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        AI Research Report (
        {ticker})
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
        }}
      >
        <Chip
          label={
            report.recommendation
          }
          color={getRecommendationColor(
            report.recommendation
          )}
        />

        <Typography>
          Confidence:
          {" "}
          {
            report.confidence_score
          }
          /10
        </Typography>
      </Box>

      <Typography
        variant="h6"
        gutterBottom
      >
        Summary
      </Typography>

      <Typography
        sx={{ mb: 3 }}
      >
        {report.summary}
      </Typography>

      <Divider
        sx={{ mb: 3 }}
      />

      <Typography
        variant="h6"
      >
        Bullish Factors
      </Typography>

      <List dense>
        {report.bullish_factors?.map(
          (
            factor: string,
            index: number
          ) => (
            <ListItem
              key={index}
            >
              <ListItemText
                primary={`• ${factor}`}
              />
            </ListItem>
          )
        )}
      </List>

      <Divider
        sx={{
          mt: 2,
          mb: 2,
        }}
      />

      <Typography
        variant="h6"
      >
        Bearish Factors
      </Typography>

      <List dense>
        {report.bearish_factors?.map(
          (
            factor: string,
            index: number
          ) => (
            <ListItem
              key={index}
            >
              <ListItemText
                primary={`• ${factor}`}
              />
            </ListItem>
          )
        )}
      </List>

      <Divider
        sx={{
          mt: 2,
          mb: 2,
        }}
      />

      <Typography
        variant="h6"
      >
        Opportunities
      </Typography>

      <List dense>
        {report.opportunities?.map(
          (
            item: string,
            index: number
          ) => (
            <ListItem
              key={index}
            >
              <ListItemText
                primary={`• ${item}`}
              />
            </ListItem>
          )
        )}
      </List>

      <Divider
        sx={{
          mt: 2,
          mb: 2,
        }}
      />

      <Typography
        variant="h6"
      >
        Risks
      </Typography>

      <List dense>
        {report.risks?.map(
          (
            risk: string,
            index: number
          ) => (
            <ListItem
              key={index}
            >
              <ListItemText
                primary={`• ${risk}`}
              />
            </ListItem>
          )
        )}
      </List>
    </Paper>
  );
}