
/**
 * 
 * @param {*} ref 
 * @param {*} top position of scroll 
 */
const scrollToAny = (ref, top) => {
   window.scrollTo({
      top: typeof top === 'number' ? 0 : ref.current.offsetTop,
      behavior: 'smooth'
   });
};

export {
   scrollToAny
}