//Matche with The password have contain at least one uppercase and one special character
export const regexPassword = /^(?=.*[A-Z]+.*)(?=.*(\W|\d)+.*).{6,30}$/;
export const regexNoSpace =/^\S+$/;
export const regexPhone = /((^(\+84|84|0|0084|\(\+84\)){1})(3|5|7|8|9))+([0-9]{8})$/;