import {
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";

type Props = {
  ticker1: string;
  ticker2: string;
  setTicker1: (ticker: string) => void;
  setTicker2: (ticker: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  ticker1,
  ticker2,
  setTicker1,
  setTicker2,
  onSearch,
}: Props) {
  const textFieldStyles = {
    flex: 1,
    minWidth: 250,

    "& .MuiInputLabel-root": {
      color: "#94A3B8",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#b990e4",
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: 3,

      "& fieldset": {
        borderColor: "#334155",
      },

      

      "&.Mui-focused fieldset": {
        borderColor: "#fff",
        borderWidth: "2px",
      },
    },

    "& input::selection": {
      backgroundColor: "#fff",
      color: "#fff",
    },
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 4,
        maxWidth: 950,
        mx: "auto",
        mb: 4,
        background:
          "linear-gradient(135deg, #061227 0%, #0D1D3B 100%)",
        border:
          "1px solid rgba(192,132,252,0.15)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          label="Stock 1"
          placeholder="AAPL"
          value={ticker1}
          onChange={(e) =>
            setTicker1(
              e.target.value.toUpperCase()
            )
          }
          sx={textFieldStyles}
        />

        <TextField
          fullWidth
          label="Stock 2"
          placeholder="MSFT"
          value={ticker2}
          onChange={(e) =>
            setTicker2(
              e.target.value.toUpperCase()
            )
          }
          sx={textFieldStyles}
        />

        <Button
          variant="contained"
          size="large"
          onClick={onSearch}
          sx={{
            height: 56,
            px: 5,
            borderRadius: 3,
            fontWeight: 700,
            minWidth: 140,

            background:
              "linear-gradient(135deg, #8B5CF6, #6D28D9)",

            boxShadow:
              "0 4px 20px rgba(139,92,246,0.35)",

            "&:hover": {
              background:
                "linear-gradient(135deg, #A855F7, #7C3AED)",

              boxShadow:
                "0 6px 25px rgba(168,85,247,0.45)",
            },
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
}