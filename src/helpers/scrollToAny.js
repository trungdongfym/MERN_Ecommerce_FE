
const scrollToAny = (ref) => {
   window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth'
   });
};

export {
   scrollToAny
}