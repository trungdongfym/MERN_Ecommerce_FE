export const registerLink = '/user/register';

export const userinfo = 'userinfo';
export const userAccount = 'account';
export const profile = 'profile';
export const password = 'password';
export const shopLink = '/shop';
export const productsLink = '/products';
export const cartLink = '/cart';
export const orderLink = '/order';
export const listOrder = 'orders';

export const profileLink = '/' + [userinfo, userAccount, profile].join('/');
export const passwordLink = '/' + [userinfo, userAccount, password].join('/');
export const profileAdminLink = '/admin/' + [userinfo, userAccount, profile].join('/');
export const passwordAdminLink = '/admin/' + [userinfo, userAccount, password].join('/');
export const detailOrderLink = '/' + [userinfo, listOrder].join('/');
