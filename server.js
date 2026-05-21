import 'dotenv/config';
import app from './app.js';
import { syncAll } from './connect.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await syncAll();
});