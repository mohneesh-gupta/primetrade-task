const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User.model');
const Product = require('../models/Product.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log('Admin user created: admin@example.com / Admin@123');

    // Create regular user
    const userPassword = await bcrypt.hash('User@123', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'User@123',
      role: 'user'
    });
    console.log('Test user created: user@example.com / User@123');

    // Create sample products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 149.99,
        category: 'Electronics',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        createdBy: admin._id
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable t-shirt made from 100% organic cotton.',
        price: 29.99,
        category: 'Clothing',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        createdBy: admin._id
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'A deep dive into the beautiful features of JavaScript by Douglas Crockford.',
        price: 24.99,
        category: 'Books',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        createdBy: admin._id
      },
      {
        name: 'Smart Home Hub',
        description: 'Control all your smart devices from one central hub with voice support.',
        price: 89.99,
        category: 'Home',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
        createdBy: admin._id
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Extra thick yoga mat with non-slip surface for comfortable workouts.',
        price: 45.99,
        category: 'Sports',
        stock: 0,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with Cherry MX switches for gaming and typing.',
        price: 129.99,
        category: 'Electronics',
        stock: 1,
        imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    console.log(`${products.length} products created`);

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
