import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/database/schema';

const [, , email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.error('Usage: pnpm run reset-password -- <email> <newPassword>');
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (!user) {
    console.error(`User not found: ${email}`);
    await client.end();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const [updatedUser] = await db
    .update(schema.users)
    .set({ password: passwordHash })
    .where(eq(schema.users.id, user.id))
    .returning();

  if (!updatedUser) {
    console.error(`Failed to update password for ${email}`);
    await client.end();
    process.exit(1);
  }

  console.log(`Password updated successfully for ${email}`);
  await client.end();
}

main().catch(async (error) => {
  console.error('Password reset failed:', error);
  await client.end();
  process.exit(1);
});
