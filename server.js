const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Configure database connection (you'll need to replace this with your actual configuration)
const { Pool } = require('pg');
require('dotenv').config()

const client = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
  try {
    // Validate and process form data
    const { name, age, mobile, batch, month } = req.body;

    if (age < 18 || age > 65) {
       return res.status(400).json({ message: 'Age must be between 18 and 65.' });
    }
  
      // Validate mobile number
    if (!/^[0-9]{10}$/.test(mobile)) {
       return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number.' });
    }
    // Save participant data to the database
    const result = await client.query(
        'INSERT INTO participants (name, age, mobile, batch_id, month) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (mobile) DO UPDATE SET name = EXCLUDED.name, age = EXCLUDED.age, batch_id = EXCLUDED.batch_id, month= EXCLUDED.month RETURNING participant_id',[name, age, mobile, batch,month]
    );
    const participantId = result.rows[0].participant_id;

    // Insert payment information
    const paymentResult = await client.query(
        'INSERT INTO payments (participant_id) VALUES ($1) RETURNING payment_id',
        [participantId]
      );
      const paymentId = paymentResult.rows[0].payment_id;
    // Mock payment function
    // You can implement your actual payment logic here
    const paymentStatus = await completePayment(participantId);

    // Return response based on payment result
    if (paymentResult) {
      res.status(200).json({ message: 'Enrollment successful' });
    } else {
      res.status(500).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

// function to simulate payment
async function completePayment(participantId) {
  //simulating a successful payment
  return true;
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
