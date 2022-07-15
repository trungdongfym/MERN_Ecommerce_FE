

function priceFormat(price){
   let strPrice = price.toString();
   const arrPrice = [];
   for(let i = strPrice.length; i >= 0; i -= 3){
      const pos = i - 3 >= 0 ? i - 3 : 0;
      const len =  i - 3 >= 0 ? 3 : strPrice.length % 3;
      const tmp = strPrice.substr(pos,len);
      if(tmp !== '')
         arrPrice.unshift(tmp);
   }
   return arrPrice.join('.');
}

function parsePriceFormat(strPrice){
   const arrSplit = strPrice.split('.');
   return arrSplit.join('');
}

export {
   priceFormat,
   parsePriceFormat
}