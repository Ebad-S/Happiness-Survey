import React, { useState, useEffect, useMemo } from 'react';
import { getFactors, getRankings } from '../services/api';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import styled from 'styled-components';
import Flag from 'react-world-flags';
import { getCountryCode } from '../utils/countryUtils'; 

// Define the structure of our factor data
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
  year: number;
}

// Styled component for the analysis page
const StyledAnalysisPage = styled.div`
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;

  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .grid-container {
    height: 103vh; 
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .ag-theme-alpine {
    --ag-header-height: 50px;
    --ag-header-foreground-color: #ffffff;
    --ag-header-background-color: #3498db;
    --ag-odd-row-background-color: #f8f9fa;
    --ag-row-hover-color: #e8f4f8;
    --ag-selected-row-background-color: #bde0f3;
  }

  .loading, .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 1.5rem;
    color: #34495e;
  }
`;

// Component to render country flags alongside country names
const FlagRenderer: React.FC<{ value: string }> = ({ value }) => {
  const countryCode = getCountryCode(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Flag code={countryCode} height="16" style={{ marginRight: '8px' }} />
      {value}
    </div>
  );
};

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<FactorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rankings = await getRankings();
        const yearsSet = new Set(rankings.map((r: any) => r.year));
        const years: number[] = Array.from(yearsSet).map(Number);
        let allData: FactorData[] = [];

        // Fetch factors for each year
        for (const year of years) {
          const factorsData = await getFactors(year);
          if (factorsData) {
            const combinedData = factorsData.map((f: any) => ({
              ...f,
              year,
            }));
            allData = [...allData, ...combinedData];
          }
        }

        setData(allData);
      } catch (err) {
        setError('Please Login to view this page');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define column specifications for the grid
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'Year', field: 'year', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Rank', field: 'rank', filter: 'agNumberColumnFilter', sortable: true },
    { 
      headerName: 'Country', 
      field: 'country', 
      filter: 'agTextColumnFilter', 
      sortable: true,
      cellRenderer: FlagRenderer
    },
    { headerName: 'Score', field: 'score', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Economy', field: 'economy', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Family', field: 'family', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Health', field: 'health', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Freedom', field: 'freedom', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Generosity', field: 'generosity', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Trust', field: 'trust', filter: 'agNumberColumnFilter', sortable: true },
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  // Callback when grid is ready
  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  // Show loading or error states if necessary
  if (loading) return <StyledAnalysisPage><div className="loading">Loading...</div></StyledAnalysisPage>;
  if (error) return <StyledAnalysisPage><div className="error">{error}</div></StyledAnalysisPage>;

  // Render the analysis grid
  return (
    <StyledAnalysisPage>
      <h1>Happiness Factors Analysis</h1>
      <p className="filter-instruction">
        Use the filtering capabilities of the table to analyze specific countries, years, or factors. Click on column headers to sort, or use the filter icons to narrow down the data based on your criteria.
      </p>
      <div className="grid-container">
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          cacheBlockSize={100}
          animateRows={true}
          onGridReady={onGridReady}
          enableCellChangeFlash={true}
          rowBuffer={0}
          suppressScrollOnNewData={true}
        />
      </div>
    </StyledAnalysisPage>
  );
};

export default AnalysisPage;