import 'dotenv/config';
import app from './app.js';
import { syncAll } from './connect.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server is running on port ${PORT}`);
    await syncAll();
});