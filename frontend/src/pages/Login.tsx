import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/authService";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
  const { setUser } = useAuth();
  const handleLogin = async () => {
    setError("");
    setSuccess("");


    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Login failed"
        );
      }

      localStorage.setItem(
        "token",
        data.access_token
        );

        const currentUser =
        await getCurrentUser();

        setUser(currentUser);

        setSuccess(
        "Login successful!"
        );

        setTimeout(() => {
        navigate("/");
        }, 1000);

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
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Login to your StockPilot AI account
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
          onClick={handleLogin}
        >
          Login
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
            Don't have an account?{" "}
            <Link to="/signup"
            style={{
                color: "#438dd2",
                textDecoration: "none",
            }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}