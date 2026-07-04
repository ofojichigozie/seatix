import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';

const ADMIN_NAME = 'Seatix Admin';
const ADMIN_EMAIL = 'admin@seatix.dev';
const ADMIN_PASSWORD = 'Admin@Pass123';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL));

  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    await client.end();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await db.insert(schema.users).values({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: 'admin',
    isActive: true,
  });

  console.log(`Admin seeded successfully: ${ADMIN_EMAIL}`);
  await client.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
