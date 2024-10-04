# Happiness Report App

## Overview

The Happiness Report App is a React-based web application designed to allow users to view and analyze happiness survey data from a `REST API`. The application provides a user-friendly interface to explore happiness rankings, factors, and countries.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more details and screenshots, please refer to the [report](./report.pdf).

## Features

- **Data Visualization**: Utilizes charts and tables to display happiness data.
- **User Authentication**: Allows users to log in and access personalized features.
- **Responsive Design**: Ensures optimal viewing experience on both desktop and mobile devices.

# Installation

After cloning this repository, run the following commands in the terminal:

1. Install dependencies:

```bash
   cd happiness-survey
   npm install$$  $$
```

2. Start the development server:

```bash
   npm start
```

- [Server url](https://d2h6rsg43otiqk.cloudfront.net/prod)
- [API key](EzensCqxyl63t09mVG6jr2AXriDQeimS95s4CdpV).
- API Endpoints are:
  1. `GET /rankings` (needs API Key Auth)
  2. `GET /countries` (needs API Key Auth)
  3. `POST /user/register` (needs API Key Auth)
  4. `POST /user/login` (needs API Key Auth)
  5. `GET /factors/{year}` (needs bearer Auth - JWT tokens)
  
# Functions Documentation

1. Authentication Functions:

```typescript
const handleLogin = async (username: string, password: string) => {
  // Handles user login
  // Makes API call to authenticate user
  // Updates local storage and state with user info
}

const handleLogout = () => {
  // Handles user logout
  // Clears user info from local storage and state
  // Navigates user to login page
}
```

2. API Service Functions:

```typescript
export const getFactors = async (year: number) => {
  // Fetches happiness factors data for a specific year
  // Returns: Promise<FactorData[]>
}

export const getRankings = async () => {
  // Fetches happiness rankings data
  // Returns: Promise<RankingData[]>
}

export const getCountries = async () => {
  // Fetches list of countries
  // Returns: Promise<string[]>
}
```

3. Data Handling Functions:

```typescript
const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // Updates filter state based on user input
  // Used in Analysis and Charts pages
}

const applyFilters = () => {
  // Applies selected filters to the data
  // Updates the displayed data in tables or charts
}
```

4. UI Component Functions:

```typescript
const handleMenuToggle = () => {
  // Toggles the floating menu open/closed state
}

const handleSubmit = (e: React.FormEvent) => {
  // Handles form submission in the Contact page
  // Prevents default form submission
  // Logs form data (in this implementation)
}
```

5. Utility Functions:

```typescript
export const getCountryCode = (countryName: string) => {
  // Converts country name to country code for flag display
  // Returns: string (country code)
}
```

6. React Hooks:

```typescript
   useEffect(() => {
  // Used in various components to perform side effects
  // Examples: fetching data, checking authentication status
}, [dependencies]);

useState<Type>(initialValue) => {
  // Used to manage component state
  // Examples: form inputs, filter selections, data storage
}

useMemo(() => {
  // Used to memoize expensive computations
  // Example: in AnalysisPage for column definitions
}, [dependencies]);
```

7. Routing Functions:

```typescript
const navigate = useNavigate();
// Used to programmatically navigate between routes
// Example: navigate('/login') after logout
```

# Copyright

- Author: Ebad Salehi
- Copyright 2024 - All rights reserved
