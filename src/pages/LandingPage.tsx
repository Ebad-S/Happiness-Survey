import React, { useEffect, useState } from 'react';
import { getRankings } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Paper, 
  Container, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Flag from 'react-world-flags';  
import { getCountryCode } from '../utils/countryUtils';
import '../styles/LandingPage.css';

interface RankingData {
  rank: number;
  country: string;
  score: string;
  year: number;
}

const LandingPage: React.FC = () => {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedFactor, setSelectedFactor] = useState<string>('');

  const [filteredRankings, setFilteredRankings] = useState<RankingData[]>([]);
  const [visibleRankings, setVisibleRankings] = useState<RankingData[]>([]);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchData = async () => {
      try {
        const rankingsData = await getRankings();
        setRankings(rankingsData);
        setFilteredRankings(rankingsData); // Set initial filtered rankings to all rankings
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // setError('Please Login to view this page');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleRankings(filteredRankings.slice(0, displayCount));
  }, [filteredRankings, displayCount]);

  const getTopAndBottomRankings = (rankings: RankingData[]) => {
    const sortedRankings = [...rankings].sort((a, b) => a.rank - b.rank);
    const topFive = sortedRankings.slice(0, 5);
    const bottomFive = sortedRankings.slice(-5);
    return [...topFive, ...bottomFive];
  };

  const columnDefs: ColDef<RankingData>[] = [
    { field: 'rank', headerName: 'Rank', width: 80 },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: { value: string }) => {
        const countryCode = getCountryCode(params.value);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {countryCode && (
              <Flag
                code={countryCode}
                height="16"
                style={{ marginRight: '8px', width: '24px', objectFit: 'cover' }}
              />
            )}
            {params.value}
          </div>
        );
      }
    },
    { field: 'score', headerName: 'Score', width: 100 },
    { field: 'year', headerName: 'Year', width: 80 }
  ];

  const handleCountryChange = (event: SelectChangeEvent) => {
    setSelectedCountry(event.target.value as string);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value as string);
  };

  const handleFactorChange = (event: SelectChangeEvent) => {
    setSelectedFactor(event.target.value as string);
  };

  const applyFilters = () => {
    let filtered = rankings;
    
    if (selectedCountry) {
      filtered = filtered.filter(ranking => ranking.country === selectedCountry);
    }
    
    if (selectedYear) {
      filtered = filtered.filter(ranking => ranking.year === parseInt(selectedYear));
    }
    
    // Note: For the factor, I might need to adjust this based on how the data is structured
    if (selectedFactor) {
      // TODO: This is a placeholder. I might need to implement the actual filtering logic
      // based on the data structure and how factors are represented
      console.log(`Filtering by factor: ${selectedFactor}`);
    }
    
    setFilteredRankings(filtered);
  };

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };

  const uniqueYears = Array.from(new Set(rankings.map(ranking => ranking.year))).sort();

  return (
    <Container maxWidth="md" className="landing-page-container">
      <Box className="landing-page-header" sx={{ marginBottom: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          className="landing-page-title"
          sx={{
            fontWeight: 700,
            color: '#2c3e50',
            marginBottom: 3,
          }}
        >
          Unlock Happiness Data and Trends
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          paragraph 
          sx={{
            fontSize: '1.1rem',
            color: '#34495e',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {isLoggedIn ? (
            <>
              Great to see you again, <strong>{username || 'User'}</strong>! You now have access to detailed charts and in-depth data tables.
              Explore our additional features to gain valuable insights into happiness trends and comparisons over the years.
            </> 
          ) : (
            <>
              For a more comprehensive experience, including access to detailed charts and in-depth data tables, please 
              <Link 
                to="/login" 
                style={{ 
                  margin: '0 8px',
                  textDecoration: 'none',
                }}
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    padding: '6px 16px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  Log In
                </Button>
              </Link>
              to your account. Our additional features will provide you with valuable insights into happiness trends and comparisons over the years.
            </>
          )}
        </Typography>
      </Box>
      
      {isLoggedIn ? (
        <>
          <Grid container spacing={3} className="card-container">
            <Grid item xs={12} md={6} className="card-grid-item">
              <Card className="info-card">
                <CardContent className="info-card-content">
                  <Box>
                    <Typography variant="h5" component="h2" className="info-card-title">
                      Analyze Happiness Data
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="info-card-description">
                      Explore detailed happiness factors and rankings across different years.
                    </Typography>
                  </Box>
                  <CardActions className="info-card-action">
                    <Link to="/analysis" style={{ textDecoration: 'none' }}>
                      <Button className="card-button">
                        Analysis
                      </Button>
                    </Link>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} className="card-grid-item">
              <Card className="info-card">
                <CardContent className="info-card-content">
                  <Box>
                    <Typography variant="h5" component="h2" className="info-card-title">
                      Visualize Happiness Trends
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="info-card-description">
                      View interactive charts and graphs of happiness data over time.
                    </Typography>
                  </Box>
                  <CardActions className="info-card-action">
                    <Link to="/charts" style={{ textDecoration: 'none' }}>
                      <Button className="card-button">
                        Charts
                      </Button>
                    </Link>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box className="filter-container">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="country-select-label">Country</InputLabel>
                  <Select
                    labelId="country-select-label"
                    id="country-select"
                    value={selectedCountry}
                    label="Country"
                    onChange={handleCountryChange}
                  >
                    <MenuItem value="">All Countries</MenuItem>
                    {Array.from(new Set(rankings.map(ranking => ranking.country))).sort().map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={selectedYear}
                    label="Year"
                    onChange={handleYearChange}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {uniqueYears.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="factor-select-label">Factor</InputLabel>
                  <Select
                    labelId="factor-select-label"
                    id="factor-select"
                    value={selectedFactor}
                    label="Factor"
                    onChange={handleFactorChange}
                  >
                    <MenuItem value="">All Factors</MenuItem>
                    <MenuItem value="gdp">GDP per capita</MenuItem>
                    <MenuItem value="social_support">Social support</MenuItem>
                    <MenuItem value="life_expectancy">Healthy life expectancy</MenuItem>
                    <MenuItem value="freedom">Freedom to make life choices</MenuItem>
                    <MenuItem value="generosity">Generosity</MenuItem>
                    <MenuItem value="corruption">Perceptions of corruption</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={applyFilters}
                  fullWidth
                  className="apply-filters-button"
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {visibleRankings.length > 0 && (
            <TableContainer component={Paper} className="rankings-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Year</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRankings.map((ranking) => (
                    <TableRow key={`${ranking.country}-${ranking.year}`}>
                      <TableCell>{ranking.rank}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Flag
                            code={getCountryCode(ranking.country)}
                            height="16"
                            style={{ marginRight: '8px', width: '24px', objectFit: 'cover' }}
                          />
                          {ranking.country}
                        </div>
                      </TableCell>
                      <TableCell>{ranking.score}</TableCell>
                      <TableCell>{ranking.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {visibleRankings.length < filteredRankings.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={loadMore}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 24px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ padding: 3, marginTop: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Top 5 and Bottom 5 Countries by Happiness Ranking over the Years
          </Typography>
          <Box sx={{ height: 450, width: '100%', overflow: 'hidden' }}>
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={getTopAndBottomRankings(rankings)}
                domLayout='normal'
                headerHeight={40}
                rowHeight={40}
              />
            </div>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default LandingPage;