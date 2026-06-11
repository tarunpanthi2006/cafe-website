// Mock Supabase Client for LuxeCafe Frontend
// Provides realistic fake data with network delay simulation

const MOCK_USER = {
  id: "demo-user-123",
  name: "Rahul Sharma",
  email: "demo@luxecafe.com",
};

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const supabase = {
  auth: {
    getUser: async () => {
      await delay(200);
      return { data: { user: MOCK_USER }, error: null };
    },
    getSession: async () => {
      await delay(200);
      return { data: { session: { user: MOCK_USER } }, error: null };
    },
    onAuthStateChange: (callback) => {
      callback('SIGNED_IN', { user: MOCK_USER });
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => {
      await delay(800);
      return { data: { user: MOCK_USER }, error: null };
    },
    signUp: async () => {
      await delay(800);
      return { data: { user: MOCK_USER }, error: null };
    },
    signOut: async () => {
      await delay(300);
      return { error: null };
    }
  }
};
