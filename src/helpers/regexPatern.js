//Matche with The password have contain at least one uppercase and one special character
export const regexPassword = /^(?=.*[A-Z]+.*)(?=.*(\W|\d)+.*).{6,30}$/;
export const regexNoSpace =/^\S+$/;