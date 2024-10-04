import axios from 'axios';

const API_BASE_URL = 'https://d2h6rsg43otiqk.cloudfront.net/prod';
const API_KEY = 'EzensCqxyl63t09mVG6jr2AXriDQeimS95s4CdpV';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

const MIN_YEAR = 2015;
const MAX_YEAR = 2020;

export const register = async (username: string, email: string, password: string): Promise<void> => {
  try {
    const response = await api.post('/user/register', { username, email, password });
    console.log('POST /user/register response code:', response.status);
    if (response.status === 201) {
      console.log('User successfully created');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('POST /user/register error response code:', error.response.status);
      if (error.response.status === 409) {
        throw new Error('User already exists');
      } else if (error.response.status === 400) {
        throw new Error(`Bad request: ${error.response.data.message}`);
      } else {
        throw new Error(`Registration failed: ${error.response.data.message || error.message}`);
      }
    }
    throw error;
  }
};

export const login = async (username: string, email: string, password: string): Promise<string> => {
  try {
    const response = await api.post('/user/login', { username, email, password });
    console.log('POST /user/login response code:', response.status);
    console.log('JWT Token:', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        if (error.response.status >= 500) {
          throw new Error('Server error', { cause: error.response });
        } else {
          throw new Error(error.response.data.message || 'Login failed', { cause: error.response });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server', { cause: error.request });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up request', { cause: error });
      }
    }
    throw new Error('An unexpected error occurred during login', { cause: error });
  }
};

export const getRankings = async () => {
  try {
    const storedRankings = localStorage.getItem('rankings');
    if (storedRankings) {
      const parsedRankings = JSON.parse(storedRankings);
      const storageTime = parsedRankings.timestamp;
      if (Date.now() - storageTime < 3600000) {
        return parsedRankings.data;
      }
    }
    const response = await api.get('/rankings');
    console.log('GET /rankings response code:', response.status);
    localStorage.setItem('rankings', JSON.stringify({ data: response.data, timestamp: Date.now() }));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(`Bad request: ${error.response.data.message}`);
      }
    }
    console.error('Error fetching rankings:', error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const storedCountries = localStorage.getItem('countries');
    if (storedCountries) {
      const parsedCountries = JSON.parse(storedCountries);
      const storageTime = parsedCountries.timestamp;
      if (Date.now() - storageTime < 86400000) {
        return parsedCountries.data;
      }
    }
    const response = await api.get('/countries');
    console.log('GET /countries response code:', response.status);
    localStorage.setItem('countries', JSON.stringify({ data: response.data, timestamp: Date.now() }));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(`Bad request: ${error.response.data.message}`);
      }
    }
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const getFactors = async (year: number) => {
  if (year < MIN_YEAR || year > MAX_YEAR) {
    console.error(`Invalid year: ${year}. Year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
    throw new Error(`Invalid year: ${year}. Year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('No token found. Please log in.');
  }
  try {
    console.log(`Attempting to fetch factors for year ${year}`);
    console.log(`Using token: ${token.substring(0, 10)}...`);
    const response = await api.get(`/factors/${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`GET /factors/${year} response code:`, response.status);
    console.log(`GET /factors/${year} response data:`, response.data);
    localStorage.setItem(`factors_${year}`, JSON.stringify({ data: response.data, timestamp: Date.now() }));
    return response.data;
  } catch (error) {
    console.error(`Error fetching factors for year ${year}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        if (error.response.status === 401) {
          console.error('Unauthorized: Token may be invalid or expired');
          throw new Error('Invalid token. Please log in again.');
        } else if (error.response.status === 429) {
          console.error('API rate limit exceeded');
          throw new Error('API limit exceeded. Please try again later.');
        } else if (error.response.status >= 500) {
          console.error('Server error');
          throw new Error('Server error. Please try again later.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up request. Please try again.');
      }
    }
    throw new Error('An unexpected error occurred while fetching factors');
  }
};

export default api;