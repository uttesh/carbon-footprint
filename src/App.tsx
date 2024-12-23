import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  Chip,
  ThemeProvider,
  createTheme
} from "@mui/material";

type Inputs = {
  transportation: number;
  electricity: number;
  gas: number;
  lpg: number;
  png: number;
  diet: "low" | "average" | "high";
  waste: number;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32"
    },
    secondary: {
      main: "#c62828"
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 600
    },
    subtitle1: {
      fontWeight: 500
    }
  }
});

const CarbonCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    transportation: 0,
    electricity: 0,
    gas: 0,
    lpg: 0,
    png: 0,
    diet: "average",
    waste: 0
  });

  const [footprint, setFootprint] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const emissionFactors = {
    transportation: 0.21,
    electricity: 0.5,
    gas: 2.31,
    lpg: 2.98,
    png: 1.93,
    diet: {
      low: 1.5,
      average: 3.0,
      high: 5.0
    },
    waste: 0.25
  };

  const thresholds = {
    low: 5000,
    medium: 10000
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: name === "diet" ? value : parseFloat(value)
    });
  };

  const calculateFootprint = () => {
    const transportationEmissions =
      inputs.transportation * emissionFactors.transportation;
    const electricityEmissions =
      inputs.electricity * emissionFactors.electricity;
    const gasEmissions = inputs.gas ? inputs.gas * emissionFactors.gas : 0;
    const lpgEmissions = inputs.lpg ? inputs.lpg * emissionFactors.lpg : 0;
    const pngEmissions = inputs.png ? inputs.png * emissionFactors.png : 0;
    const dietEmissions = emissionFactors.diet[inputs.diet] * 365;
    const wasteEmissions = inputs.waste * emissionFactors.waste * 52;

    const totalFootprint =
      transportationEmissions +
      electricityEmissions +
      gasEmissions +
      lpgEmissions +
      pngEmissions +
      dietEmissions +
      wasteEmissions;

    const roundedFootprint = parseFloat(totalFootprint.toFixed(2));

    let category = "";
    if (roundedFootprint <= thresholds.low) {
      category = "Low";
    } else if (roundedFootprint <= thresholds.medium) {
      category = "Medium";
    } else {
      category = "High";
    }

    setFootprint(roundedFootprint);
    setCategory(category);
  };

  const resetCalculator = () => {
    setInputs({
      transportation: 0,
      electricity: 0,
      gas: 0,
      lpg: 0,
      png: 0,
      diet: "average",
      waste: 0
    });
    setFootprint(null);
    setCategory(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            Carbon Footprint Calculator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ my: 4 }}>
        {footprint === null ? (
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              border: "1px solid #ccc"
            }}
          >
            <Typography variant="h5" gutterBottom align="center">
              Calculate Your Carbon Footprint
            </Typography>

            <Box sx={{ mb: 3 }}>
              {[
                { label: "Transportation (km/week)", name: "transportation" },
                { label: "Electricity Usage (kWh/month)", name: "electricity" },
                // { label: "Gasoline Usage (liters/week)", name: "gas" },
                { label: "LPG Usage (kg/month)", name: "lpg" },
                { label: "PNG Usage (SCM/month)", name: "png" },
                { label: "Waste Generated (kg/week)", name: "waste" }
              ].map((field, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={field.label}
                  type="number"
                  name={field.name}
                  value={inputs[field.name as keyof Inputs]}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              ))}

              <TextField
                fullWidth
                select
                label="Dietary Habits"
                name="diet"
                value={inputs.diet}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <MenuItem value="low">Low-Impact (Vegetarian)</MenuItem>
                <MenuItem value="average">Average (Balanced Diet)</MenuItem>
                <MenuItem value="high">High-Impact (Meat Heavy)</MenuItem>
              </TextField>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={calculateFootprint}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Calculate Footprint
            </Button>
          </Box>
        ) : (
          <Card
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              border: "1px solid #ccc"
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Your Annual Carbon Footprint
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                {footprint} kg CO₂e
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
                Carbon Footprint Level:{" "}
                <Chip
                  label={category}
                  color={
                    category === "Low"
                      ? "success"
                      : category === "Medium"
                      ? "warning"
                      : "error"
                  }
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    px: 1.5,
                    py: 0.5
                  }}
                />
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetCalculator}
                sx={{ mt: 3 }}
              >
                Back to Calculator
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          mt: 4,
          textAlign: "center",
          boxShadow: 3
        }}
      >
        <Typography variant="body2">
          © 2024 Carbon Calculator | Designed for a Sustainable Future
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return <CarbonCalculator />;
};

export default App;
