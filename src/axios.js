import axios from 'axios';

// Determine the backend URL based on the current environment
const getBackendURL = () => {
  const hostname = window.location.hostname;
  const isDevelopment = import.meta.env.DEV || hostname === 'localhost';
  
  // Local development
  if (isDevelopment) {
    return 'http://localhost:8000';
  }
  
  // Vercel deployment (your-app-name.vercel.app)
  if (hostname.includes('vercel.app')) {
    // You'll need to replace this with your actual backend URL
    // This could be Railway, Heroku, or any other platform hosting your Laravel backend
    return 'https://your-backend-url.railway.app'; // Replace with actual backend URL
  }
  
  // evoka.info domain
  if (hostname === 'evoka.info' || hostname.includes('evoka.info')) {
    return 'https://evoka.info/public';
  }
  
  // Default fallback
  return 'https://evoka.info/public';
};

const axiosClient = axios.create({
  baseURL: getBackendURL(),
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
axiosClient.interceptors.request.use(
  (config) => {
    // Log which backend URL is being used
    console.log('🌐 Backend URL:', getBackendURL());
    console.log('📡 Making API call to:', config.url);
    
    // If in development and no backend is running, use mock data
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
    if (isDevelopment && config.url?.includes('api/')) {
      console.log('🚀 Development mode: Mocking API call to', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for local testing
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If in development and API call fails, provide mock responses
    // Commented out since backend is now running
    // if (isDevelopment && error.code === 'ERR_NETWORK') {
    //   console.log('🔧 Development mode: API not available, using mock data');
    //   return handleMockResponse(error.config);
    // }
    return Promise.reject(error);
  }
);

// Mock response handler for local testing
const handleMockResponse = (config) => {
  const { url, method, data } = config;
  
  // Mock login response
  if (url.includes('api/login') && method === 'post') {
    const loginData = JSON.parse(data);
    if (loginData.username === 'testuser' && loginData.password === 'testpass') {
      return Promise.resolve({
        data: {
          token: 'mock-jwt-token-for-testing',
          message: 'Login successful (Mock)',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            name: 'Test User'
          }
        },
        status: 200
      });
    } else {
      return Promise.reject({
        response: {
          data: { message: 'Invalid credentials' },
          status: 401
        }
      });
    }
  }
  
  // Mock user info response
  if (url.includes('api/user') && method === 'get') {
    return Promise.resolve({
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      },
      status: 200
    });
  }
  
  // Mock event participation response
  if (url.includes('api/events/') && url.includes('/participate') && method === 'post') {
    const requestData = JSON.parse(data);
    const participants = requestData.participants || [];
    
    console.log('🔍 Payment API Data Being Sent:', {
      participants: participants,
      total_tickets: requestData.total_tickets,
      total_amount: requestData.total_amount,
      currency: requestData.currency,
      event_id: requestData.event_id,
      event_title: requestData.event_title,
      user_id: requestData.user_id,
      payment_method: requestData.payment_method
    });
    
    return Promise.resolve({
      data: {
        message: `Successfully booked ${participants.length} ticket(s) for: ${participants.map(p => p.name).join(', ')}`,
        success: true,
        redirect: requestData.total_amount > 0 ? 'https://paypal.com/checkout' : null // Mock PayPal redirect for paid events
      },
      status: 200
    });
  }
  
  // Mock event data response
  if (url.includes('api/events/') && method === 'get' && !url.includes('/participate') && !url.includes('/chat') && !url.includes('/my-ratings')) {
    const eventId = url.split('/').pop();
    return Promise.resolve({
      data: {
        event: {
          id: eventId,
          title: 'Test Event',
          description: 'This is a test event for local development',
          start_date: '2025-09-15',
          start_time: '18:00:00',
          end_date: '2025-09-15',
          end_time: '22:00:00',
          address: 'Test Location, Test City',
          price: 25.00,
          is_free: false,
          max_participants: 100,
          user_name: 'Test Organizer'
        },
        comments: [],
        participation: []
      },
      status: 200
    });
  }
  
  // Mock event ratings response
  if (url.includes('api/events/') && url.includes('/my-ratings') && method === 'get') {
    return Promise.resolve({
      data: {
        ratings: []
      },
      status: 200
    });
  }
  
  // Mock event chat response
  if (url.includes('api/events/') && url.includes('/chat') && method === 'get') {
    return Promise.resolve({
      data: {
        messages: []
      },
      status: 200
    });
  }
  
  // Mock subscription response
  if (url.includes('api/subscription') && method === 'get') {
    return Promise.resolve({
      data: {
        data: {
          plan: 'free',
          status: 'active'
        }
      },
      status: 200
    });
  }
  
  // Mock my-participation response
  if (url.includes('api/my-participation') && method === 'get') {
    return Promise.resolve({
      data: {
        data: []
      },
      status: 200
    });
  }
  
  // Default mock response
  return Promise.resolve({
    data: { message: 'Mock response for development' },
    status: 200
  });
};

export default axiosClient;
