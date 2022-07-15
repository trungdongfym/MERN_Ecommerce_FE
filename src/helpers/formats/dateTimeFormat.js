
function dateTimeFormat(dateTime){
   const timeTmp = new Date(dateTime);
   const hours = parseInt(timeTmp.getHours()) > 10 ? timeTmp.getHours(): '0'+timeTmp.getHours();
   const minutes = parseInt(timeTmp.getMinutes()) > 10 ? timeTmp.getMinutes(): '0'+timeTmp.getMinutes();
   const seconds = parseInt(timeTmp.getSeconds()) > 10 ? timeTmp.getSeconds(): '0'+timeTmp.getSeconds();
   const date = parseInt(timeTmp.getDate()) > 10 ? timeTmp.getDate(): '0'+timeTmp.getDate();
   const month = parseInt(timeTmp.getMonth()) > 10 ? timeTmp.getMonth(): '0'+timeTmp.getMonth();
   const year = parseInt(timeTmp.getFullYear()) > 10 ? timeTmp.getFullYear(): '0'+timeTmp.getFullYear();

   const dateString = [date, month, year].join('/') + " " + [hours, minutes, seconds].join(':');
   return dateString;
}

export {
   dateTimeFormat
}