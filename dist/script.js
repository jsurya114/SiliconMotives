const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 1051px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();

const briefDialog = document.querySelector('#brief-dialog');
document.querySelector('#open-brief').addEventListener('click', () => {
  briefDialog.showModal();
  document.body.classList.add('dialog-open');
});
document.querySelector('.close-dialog').addEventListener('click', () => briefDialog.close());
briefDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
briefDialog.addEventListener('click', (event) => {
  const rect = briefDialog.getBoundingClientRect();
  if (event.target === briefDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) briefDialog.close();
});
document.querySelector('#brief-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const brief = `SILICON MOTIVES — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nProject details\n${data.get('project')}\n\nThis brief was prepared locally. It has not been sent to Silicon Motives.\n`;
  const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'silicon-motives-project-brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#brief-status').textContent = 'Your download is ready. Keep the brief to share with our team; nothing has been sent.';
});

// Reveal each step once, leaving the layout and native scrolling unchanged.
const workSteps = [...document.querySelectorAll('.work-step')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const workObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${index * 80}ms`);
      entry.target.classList.remove('is-waiting');
      entry.target.classList.add('is-shown');
      workObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -32px 0px' });
  workSteps.forEach(step => {
    step.classList.add('is-waiting');
    workObserver.observe(step);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    workObserver.disconnect();
    workSteps.forEach(step => step.classList.remove('is-waiting', 'is-shown'));
  });
}
