import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    console.log('Updating confidence column to real type...');
    await sql`ALTER TABLE mood ALTER COLUMN confidence TYPE real`;
    
    console.log('Updating timestamp column to timestamp type...');
    await sql`ALTER TABLE mood ALTER COLUMN timestamp TYPE timestamp USING to_timestamp(timestamp)`;
    
    console.log('Setting default for timestamp column...');
    await sql`ALTER TABLE mood ALTER COLUMN timestamp SET DEFAULT now()`;
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
