import { prisma } from './lib/prisma';
import { AuthService } from './modules/Auth/auth.service';
import { Role } from '../generated/prisma/client';

async function runTests() {
  console.log('--- Starting Auth Service Tests ---');

  const testEmail = 'testadmin@example.com';

  try {
    // 1. Cleanup old test data if exists
    console.log('Cleaning up existing test user...');
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    // 2. Register user
    console.log('Testing User Registration...');
    const registeredUser = await AuthService.registerUser({
      name: 'Test Admin User',
      email: testEmail,
      password: 'password123',
      role: Role.ADMIN,
    });
    console.log('✅ Registration success:', registeredUser);

    // 3. Login user (incorrect password)
    console.log('Testing Login with incorrect password...');
    try {
      await AuthService.loginUser({
        email: testEmail,
        password: 'wrongpassword',
      });
      console.log('❌ Error: Login succeeded with incorrect password');
    } catch (err: any) {
      console.log('✅ Login correctly failed:', err.message);
    }

    // 4. Login user (correct password)
    console.log('Testing Login with correct password...');
    const loginResult = await AuthService.loginUser({
      email: testEmail,
      password: 'password123',
    });
    console.log('✅ Login success! Received tokens:');
    console.log('- Access Token:', loginResult.accessToken ? 'Present' : 'Missing');
    console.log('- Refresh Token:', loginResult.refreshToken ? 'Present' : 'Missing');
    console.log('- User:', loginResult.user);

    // 5. Refresh token
    console.log('Testing Token Refresh...');
    const refreshResult = await AuthService.refreshToken(loginResult.refreshToken);
    console.log('✅ Token Refresh success! Received new Access Token:', refreshResult.accessToken ? 'Present' : 'Missing');

    // 6. Cleanup after test
    console.log('Cleaning up test user...');
    await prisma.user.delete({
      where: { id: registeredUser.id },
    });
    console.log('✅ Cleanup complete!');

    console.log('--- All Tests Completed Successfully ---');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
