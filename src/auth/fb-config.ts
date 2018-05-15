export interface FbConfig {
  appId: string
  appSecret: string
}
export const fbConfig = {
  appId: process.env.FACEBOOK_APP_ID || '',
  appSecret: process.env.FACEBOOK_APP_SECRET || ''
}
