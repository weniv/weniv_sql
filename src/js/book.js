// Cheatsheet, Tutorial 등 교안 관련 코드

// 최상단으로 이동
const content = document.querySelector('.tutorial-content');
const topBtn = document.querySelector('.top-btn');

topBtn?.addEventListener('click', () => {
  console.log(1111, content.scrollTop);
  content.scrollTo({ top: 0, behavior: 'smooth' });
});
