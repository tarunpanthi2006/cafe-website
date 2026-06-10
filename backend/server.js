require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key_placeholder';

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory Database for the Demo
const menuItems = [
  {
    id: 'p1',
    category: 'Pizza',
    name: 'Margherita Suprema',
    description: 'Classic delight with 100% real mozzarella cheese, fresh tomatoes, and basil on a hand-tossed crust.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    category: 'Pizza',
    name: 'Pepperoni Feast',
    description: 'Loaded with premium pepperoni, gooey cheese, and our signature rich tomato sauce.',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    category: 'Pizza',
    name: 'Truffle Mushroom',
    description: 'Earthy mushrooms, truffle oil, roasted garlic, and a blend of savory artisan cheeses.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b1',
    category: 'Burger',
    name: 'Classic Cheeseburger',
    description: 'Juicy 100% Angus beef patty, cheddar cheese, crisp lettuce, tomato, and our secret sauce.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    category: 'Burger',
    name: 'Spicy Inferno Burger',
    description: 'Double beef patty, pepper jack cheese, jalapeños, and blazing habanero aioli.',
    price: 1549,
    image: 'https://images.unsplash.com/photo-1594212848116-b8dbf932f94d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    category: 'Burger',
    name: 'Crispy Chicken Ranch',
    description: 'Golden fried chicken breast, smoked bacon, buttermilk ranch, and crisp pickles on a brioche bun.',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c1',
    category: 'Cake',
    name: 'Velvet Dream Cake',
    description: 'Rich red velvet layers filled and frosted with smooth Madagascar vanilla cream cheese.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c2',
    category: 'Cake',
    name: 'Dark Chocolate Truffle',
    description: 'Decadent dark chocolate ganache over a moist fudge cake. A chocolate lover’s fantasy.',
    price: 849,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c3',
    category: 'Cake',
    name: 'Classic Cheesecake',
    description: 'New York style vanilla cheesecake on a buttery graham cracker crust with a strawberry glaze.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's1',
    category: 'Shake',
    name: 'Oreo Overload',
    description: 'Thick vanilla bean ice cream blended with chunks of Oreo cookies, topped with whipped cream.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's2',
    category: 'Shake',
    name: 'Strawberry Bliss',
    description: 'Fresh strawberries and premium strawberry ice cream, finished with a fresh berry compote.',
    price: 649,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's3',
    category: 'Shake',
    name: 'Double Fudge Brownie',
    description: 'Rich chocolate ice cream with fudge brownie pieces, chocolate syrup drizzle, and a cherry on top.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=800'
  }
];

const orders = [];

// API Endpoints

// Get all menu items
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Khalti Initiate Order
app.post('/api/payments/khalti/initiate', async (req, res) => {
  try {
    const { amount, purchase_order_id, purchase_order_name, customer_info } = req.body;
    
    const payload = {
      return_url: "http://localhost:5173/", // URL to redirect back to
      website_url: "http://localhost:5173",
      amount: Math.round(amount * 100), // Khalti expects amount in paisa
      purchase_order_id: purchase_order_id || `ord_${Date.now()}`,
      purchase_order_name: purchase_order_name || "LuxeCafe Order",
      customer_info: customer_info || {
        name: "Customer",
        email: "customer@example.com",
        phone: "9800000000"
      }
    };

    const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', payload, {
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error initiating Khalti payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate Khalti payment' });
  }
});

// Khalti Verify Payment
app.post('/api/payments/khalti/verify', async (req, res) => {
  try {
    const { pidx } = req.body;
    
    const response = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', { pidx }, {
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'Completed') {
      res.json({ message: "Payment verified successfully", success: true, data: response.data });
    } else {
      res.status(400).json({ error: "Payment not completed", status: response.data.status });
    }
  } catch (error) {
    console.error('Error verifying Khalti payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Submit a new order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, tableOrAddress, phone, items, totalAmount, paymentId } = req.body;
    
    if (!customerName || !tableOrAddress || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields or empty cart.' });
    }

    // Smart ETA Calculation
    // Base 10 mins + (5 mins * Number of active "Preparing" orders)
    const preparingOrdersCount = orders.filter(o => o.status === 'Preparing').length;
    const etaMinutes = 10 + (preparingOrdersCount * 5);

    const newOrder = {
      id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      customerName,
      tableOrAddress,
      phone,
      items,
      totalAmount,
      paymentId: paymentId || null,
      etaMinutes,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    io.emit('newOrder', newOrder); // Broadcast new order to staff dashboard
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error processing the order.' });
  }
});

// Get all orders (for admin panel)
app.get('/api/orders', (req, res) => {
  // Sort orders by newest first
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedOrders);
});

// Fetch orders for a specific customer by phone
app.get('/api/orders/customer/:phone', (req, res) => {
  const customerOrders = orders.filter(o => o.phone === req.params.phone);
  const sortedOrders = [...customerOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedOrders);
});

// Update order status (Bonus feature for admin)
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (status) {
    order.status = status;
    io.emit('orderUpdated', order); // Broadcast update to customers
  }
  
  res.json({ message: 'Order updated successfully', order });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

server.listen(PORT, () => {
  console.log(`Backend server running perfectly on port ${PORT}`);
});
