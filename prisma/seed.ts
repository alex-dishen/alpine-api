/* eslint-disable no-console */
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { JobStageCategory, type DB } from '../src/db/types/db.types';

const companies = [
  'Google',
  'Microsoft',
  'Apple',
  'Amazon',
  'Meta',
  'Netflix',
  'Stripe',
  'Airbnb',
  'Uber',
  'Lyft',
  'Spotify',
  'Twitter',
  'LinkedIn',
  'Slack',
  'Zoom',
  'Dropbox',
  'Salesforce',
  'Adobe',
  'Oracle',
  'IBM',
  'Intel',
  'Nvidia',
  'AMD',
  'Qualcomm',
  'Cisco',
  'VMware',
  'Palantir',
  'Snowflake',
  'Databricks',
  'Figma',
  'Notion',
  'Airtable',
  'Asana',
  'Monday',
  'Atlassian',
  'GitHub',
  'GitLab',
  'Vercel',
  'Supabase',
  'PlanetScale',
  'Railway',
  'Render',
  'Fly.io',
  'Cloudflare',
];

const positions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Platform Engineer',
  'Data Engineer',
  'ML Engineer',
  'AI Engineer',
  'Security Engineer',
  'Mobile Developer',
  'iOS Developer',
  'Android Developer',
  'Engineering Manager',
  'Tech Lead',
  'Principal Engineer',
  'Product Manager',
  'Technical Product Manager',
  'Solutions Architect',
];

async function seed() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/alpine',
      }),
    }),
  });

  try {
    // Get first user
    const user = await db.selectFrom('users').selectAll().executeTakeFirst();

    if (!user) {
      console.error('No user found. Please sign up first.');
      process.exit(1);
    }

    // Get first stage for the user
    let stage = await db.selectFrom('job_stages').selectAll().where('user_id', '=', user.id).executeTakeFirst();

    // Create default stage if none exists
    if (!stage) {
      const stageId = uuidv4();
      await db
        .insertInto('job_stages')
        .values({
          id: stageId,
          user_id: user.id,
          name: 'Applied',
          color: '#3B82F6',
          category: JobStageCategory.INITIAL,
          position: 0,
        })
        .execute();

      stage = await db.selectFrom('job_stages').selectAll().where('id', '=', stageId).executeTakeFirst();
    }

    if (!stage) {
      console.error('Failed to get or create stage');
      process.exit(1);
    }

    console.log(`Seeding jobs for user: ${user.email}`);
    console.log(`Using stage: ${stage.name}`);

    // Generate 150 jobs
    const jobs = [];
    for (let i = 0; i < 150; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const daysAgo = Math.floor(Math.random() * 90);
      const appliedAt = new Date();
      appliedAt.setDate(appliedAt.getDate() - daysAgo);

      jobs.push({
        id: uuidv4(),
        user_id: user.id,
        stage_id: stage.id,
        company_name: company,
        job_title: position,
        applied_at: appliedAt,
        is_archived: false,
      });
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      await db.insertInto('job_applications').values(batch).execute();
      console.log(`Inserted ${Math.min(i + batchSize, jobs.length)}/${jobs.length} jobs`);
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
