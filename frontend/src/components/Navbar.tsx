import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth(); 

    const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/logout");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          StockPilot AI
        </Typography>

        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Home
          </Button>

          {!user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </>
          )}

          {user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/portfolio"
              >
                Portfolio
              </Button>

              <Button
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

