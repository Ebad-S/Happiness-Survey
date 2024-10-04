import React, { useState, useEffect } from 'react';
import { getRankings, getFactors } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, RadialBarChart, RadialBar, Label
} from 'recharts';
import { Typography, Container, Grid, Paper } from '@mui/material';

interface RankingData {
  country: string;
  rank: number;
  score: number;
  year: number;
}

interface FactorData {
  rank: number;
  country: string;
  score: number;
  economy: number;
  family: number;
  health: number;
  freedom: number;
  generosity: number;
  trust: number;
}

interface FactorOverTime {
  year: number;
  score: number;
}

const COLORS = {
  economy: '#83a6ed',
  family: '#8dd1e1',
  health: '#82ca9d',
  freedom: '#a4de6c',
  generosity: '#d0ed57',
  trust: '#ffc658'
};

// Add this custom dot component
const CustomizedDot = (props: any) => {
  const { cx, cy, value } = props;
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">
      <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
    </svg>
  );
};

const ChartsPage: React.FC = () => {
  // State for storing ranking and factor data
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [factorData, setFactorData] = useState<FactorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define colors for the lines
  const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ad1457', '#00bcd4'];

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rankings and factors data
        const rankings = await getRankings();
        setRankingData(rankings);

        const latestYear = Math.max(...rankings.map((r: RankingData) => r.year));
        const factors = await getFactors(latestYear);
        setFactorData(factors);
      } catch (err) {
        setError('Please Login to view this page');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading or error states if necessary
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Get top 10 countries based on the latest year's rankings
  const top10Countries = rankingData
    .filter(item => item.year === Math.max(...rankingData.map(r => r.year)))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);

  // Organize factors data over time for each country
  const factorsOverTime = rankingData.reduce((acc: any, curr) => {
    if (!acc[curr.country]) {
      acc[curr.country] = [];
    }
    acc[curr.country].push({ year: curr.year, score: curr.score });
    return acc;
  }, {});

  // Function to get top 3 and bottom 3 countries based on latest scores
  const getTopAndBottomCountries = (): [string, FactorOverTime[]][] => {
    const sortedCountries = Object.entries(factorsOverTime).sort((a, b) => {
      const aData = a[1] as FactorOverTime[];
      const bData = b[1] as FactorOverTime[];
      const aScore = aData[aData.length - 1].score;
      const bScore = bData[bData.length - 1].score;
      return bScore - aScore;
    });
    return [...sortedCountries.slice(0, 3), ...sortedCountries.slice(-3)] as [string, FactorOverTime[]][];
  };

  // Get top 3 and bottom 3 countries based on rank
  const sortedFactorData = [...factorData].sort((a, b) => a.rank - b.rank);
  const top3Countries = sortedFactorData.slice(0, 3);
  const bottom3Countries = sortedFactorData.slice(-3);
  const topAndBottomCountries = [...top3Countries, ...bottom3Countries];

  // Calculate min and max scores for color scaling
  const minScore = Math.min(...factorData.map(d => d.score));
  const maxScore = Math.max(...factorData.map(d => d.score));

  // Function to map score to a color
  const getColor = (score: number) => {
    const ratio = (score - minScore) / (maxScore - minScore);
    const hue = (1 - ratio) * 240; // From blue (240) to red (0)
    return `hsl(${hue}, 100%, 50%)`;
  };

  // Add 'fill' property to each data point based on score
  const factorDataWithColor = factorData.map(d => ({
    ...d,
    fill: getColor(d.score),
  }));

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper style={{ padding: '10px', backgroundColor: '#fff', opacity: 0.9 }}>
          <Typography variant="subtitle2">{data.country}</Typography>
          <Typography variant="body2">Economy: {data.economy}</Typography>
          <Typography variant="body2">Health: {data.health}</Typography>
          <Typography variant="body2">Score: {data.score}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Happiness Charts
      </Typography>
      <Typography variant="body1" paragraph>
        The following charts provide insights into global happiness data. You'll find visualizations of factor contributions for top countries, the happiest nations worldwide, distribution of happiness factors, and trends over time. These charts offer a comprehensive view of how various elements contribute to overall happiness across different countries and years.
      </Typography>

      <Grid container spacing={4}>
        
        {/* Radial Bar Charts: Factor Contribution per Country (Top 3 and Bottom 3) */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Factor Contribution per Country (Top 3 and Bottom 3)
            </Typography>
            <Grid container spacing={2}>
              {topAndBottomCountries.map((country, index) => (
                <Grid item xs={12} md={6} lg={4} key={country.country}>
                  <Typography variant="subtitle1">
                    {index < 3
                      ? `Top ${index + 1}: ${country.country}`
                      : `Bottom ${index - 2}: ${country.country}`}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="80%"
                      barSize={20}
                      data={Object.entries(COLORS).map(([key, color]) => ({
                        name: key,
                        value: country[key as keyof FactorData],
                        fill: color,
                      }))}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ fill: '#666', position: 'insideStart' }}
                        background
                        dataKey="value"
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        wrapperStyle={{
                          top: '50%',
                          right: 0,
                          transform: 'translate(0, -50%)',
                        }}
                      />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Bar Chart: Top 10 Happiest Countries */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Top 10 Happiest Countries</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={top10Countries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Scatter Chart: Happiness Factors Distribution */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Happiness Factors Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="economy" name="Economy" />
                <YAxis dataKey="health" name="Health">
                  <Label
                    value="Health"
                    position="insideLeft"
                    angle={-90}
                    offset={0}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <ZAxis dataKey="score" range={[minScore, maxScore]} name="Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Legend />
                <Scatter
                  name="Countries"
                  data={factorDataWithColor}
                  // Default dot size
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart: Happiness Score Trends */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Happiness Score Trends (Top 3 and Bottom 3)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                >
                  <Label
                    value="Year"
                    position="insideBottom"
                    offset={-10}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Happiness Score"
                    angle={-90}
                    position="insideLeft"
                    offset={-5}
                  />
                </YAxis>
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (typeof value === 'number') {
                      return [value.toFixed(2), name];
                    } else {
                      return [value, name];
                    }
                  }}
                  labelFormatter={(label: any) => `Year: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                {getTopAndBottomCountries().map(([country, data], index) => (
                  <Line
                    type="monotone"
                    dataKey="score"
                    data={data}
                    name={country}
                    key={country}
                    stroke={lineColors[index]}
                    strokeWidth={2}
                    strokeDasharray={index < 3 ? '0' : '5 5'}
                    dot={<CustomizedDot />}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        
      </Grid>
    </Container>
  );
};

export default ChartsPage;