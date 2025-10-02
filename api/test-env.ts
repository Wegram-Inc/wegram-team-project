// Test endpoint to check environment variables
export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for database-related environment variables
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
    };

    // Get all environment variables that contain DATABASE or POSTGRES
    const allDbVars = Object.keys(process.env)
      .filter(key => key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON'))
      .reduce((obj: any, key) => {
        obj[key] = 'SET';
        return obj;
      }, {});

    return res.status(200).json({
      message: 'Environment variables check',
      commonVars: envVars,
      allDatabaseVars: allDbVars,
      totalEnvVars: Object.keys(process.env).length
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
