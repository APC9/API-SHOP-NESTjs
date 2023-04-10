export const envConfiguration = ()=>({
  enviroment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  hostApi: process.env.HOST_API || 'http://localhost:3000/api',
})