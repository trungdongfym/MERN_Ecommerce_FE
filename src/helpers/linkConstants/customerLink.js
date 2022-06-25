export const registerLink = '/user/register';

const userinfo = 'userinfo';
const userAccount = 'account';
const profile = 'profile';
const password = 'password';

export const profileLink = '/'+[userinfo,userAccount,profile].join('/');
export const passwordLink = '/'+[userinfo,userAccount,password].join('/');