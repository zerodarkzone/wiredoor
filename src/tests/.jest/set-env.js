process.env = Object.assign(
  process.env,
  {
    DB_DATABASE: ':memory:',
    ADMIN_EMAIL: 'admin',
    ADMIN_PASSWORD: 'admin',
    PRIVATE_SECRET: 'super_secret',
    TCP_SERVICES_PORT_RANGE: '15000-15005'
  }
)