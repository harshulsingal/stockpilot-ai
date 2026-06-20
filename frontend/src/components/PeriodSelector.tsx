import {
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";

type Props = {
  onPeriodChange: (
    period: string
  ) => void;

  selectedPeriod: string;
};

export default function PeriodSelector({
  onPeriodChange,
  selectedPeriod,
}: Props) {
  const periods = [
    "5d",
    "1mo",
    "3mo",
    "6mo",
    "1y",
    "5y",
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToggleButtonGroup
        value={selectedPeriod}
        exclusive
        onChange={(_, value) => {
          if (value) {
            onPeriodChange(value);
          }
        }}
      >
        {periods.map((period) => (
          <ToggleButton
            key={period}
            value={period}
            sx={{
              px: 3,
              fontWeight: 600,
            }}
          >
            {period}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
}