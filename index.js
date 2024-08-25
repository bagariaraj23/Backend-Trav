import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

app.get('/api/getClientId', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (clientId) {
        res.json({ clientId });
    } else {
        res.status(500).json({ error: 'Client ID not found' });
    }
})

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export { prisma };
