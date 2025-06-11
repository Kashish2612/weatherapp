import React from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from "@mui/material";
import {
  Cloud,
  LocationCity,
  Thermostat,
  Air,
  Water,
  Compress,
  WbSunny,
  NightsStay,
  ArrowUpward,
  Search
} from "@mui/icons-material";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

function WeatherApp() {
  const [city, setCity] = React.useState("");
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchWeather = async (e) => {
    e?.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setError(null);
    setLoading(true);
    
   try {
      const apiKey = "5f114b623b2c42d49c3102625230807";
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`
      );
      setData(response.data);
      updateBackground(response.data.current.condition.text);
    } catch (err) {
      setError("Failed to fetch weather data. Please try another location.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
          padding: isMobile ? 2 : 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Container maxWidth="sm" sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.dark",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              Weather Forecast <Cloud sx={{ fontSize: 40 }} />
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Get real-time weather information
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={fetchWeather}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 4,
              width: "100%"
            }}
          >
            <TextField
              label="Enter city name"
              variant="outlined"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)"
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                borderRadius: "50px",
                padding: isMobile ? "12px" : "12px 24px",
                minWidth: isMobile ? "100%" : "auto"
              }}
              startIcon={<Search />}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Box>

          {loading && !data ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px"
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : data ? (
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                overflow: "hidden"
              }}
            >
              <CardContent sx={{ p: isMobile ? 2 : 4 }}>
                {/* Location and Date */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1
                    }}
                  >
                    <LocationCity color="primary" />
                    {data.location.name}, {data.location.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(data.location.localtime)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Main Weather Info */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{ fontWeight: "bold", mr: 1 }}
                        >
                          {data.current.temp_c}°
                        </Typography>
                        <Box>
                          <Typography variant="subtitle1">
                            {data.current.condition.text}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Feels like {data.current.feelslike_c}°
                          </Typography>
                        </Box>
                      </Box>
                      <img
                        src={`https:${data.current.condition.icon}`}
                        alt="Weather icon"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                      {/* Weather Details */}
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<Thermostat />}
                          title="Temperature"
                          value={`${data.current.temp_c}°C`}
                          color="#f44336"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<Air />}
                          title="Wind"
                          value={`${data.current.wind_kph} km/h`}
                          color="#2196f3"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<Water />}
                          title="Humidity"
                          value={`${data.current.humidity}%`}
                          color="#00bcd4"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<Compress />}
                          title="Pressure"
                          value={`${data.current.pressure_mb} mb`}
                          color="#9c27b0"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<WbSunny />}
                          title="UV Index"
                          value={data.current.uv}
                          color="#ff9800"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <WeatherDetail
                          icon={<ArrowUpward />}
                          title="Wind Direction"
                          value={data.current.wind_dir}
                          color="#4caf50"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: 4
              }}
            >
              <Typography variant="h6" gutterBottom>
                Welcome to Weather Forecast
              </Typography>
              <Typography>
                Enter a city name to get current weather information
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

// Reusable Weather Detail Component
function WeatherDetail({ icon, title, value, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(0, 0, 0, 0.02)",
        height: "100%"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1
        }}
      >
        {React.cloneElement(icon, { sx: { color } })}
        <Typography variant="subtitle2" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

export default WeatherApp;
