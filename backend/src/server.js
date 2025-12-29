import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./seed.js";

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

startServer();