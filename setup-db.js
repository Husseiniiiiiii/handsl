const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    console.log('Testing user query...');
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);
    
    console.log('Testing article query...');
    const articleCount = await prisma.article.count();
    console.log(`Articles in database: ${articleCount}`);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
