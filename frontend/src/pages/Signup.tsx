import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            username: name,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Signup failed"
        );
      }

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Join StockPilot AI and
          start analyzing stocks
        </Typography>

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          onClick={handleSignup}
        >
          Create Account
        </Button>

        <Box
          sx={{
            mt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
          >
            Already have an account?{" "}
            <Link to="/login"
            style={{
                color: "#438dd2",
                textDecoration: "none",
            }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}