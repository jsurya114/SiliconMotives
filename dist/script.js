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

const processSteps = [...document.querySelectorAll('.process-step')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const progressNumber = document.querySelector('.approach-current-number');
const progressTitle = document.querySelector('.progress-current-title');
const progressFill = document.querySelector('.progress-fill');
const setCurrentStep = (step) => {
  const index = processSteps.indexOf(step);
  if (index < 0) return;
  processSteps.forEach((item) => item.classList.toggle('is-current', item === step));
  if (progressNumber) progressNumber.textContent = step.dataset.step;
  if (progressTitle) progressTitle.textContent = step.querySelector('h3').textContent;
  if (progressFill) progressFill.style.width = `${((index + 1) / processSteps.length) * 100}%`;
};
if (processSteps.length) {
  if (!motionPreference.matches) document.documentElement.classList.add('has-process-motion');
  setCurrentStep(processSteps[0]);
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -58% 0px' });
    const progressObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setCurrentStep(current.target);
    }, { threshold: 0.15, rootMargin: '-35% 0px -45% 0px' });
    processSteps.forEach((step) => {
      progressObserver.observe(step);
      if (!motionPreference.matches) revealObserver.observe(step);
      else step.classList.add('is-visible');
    });
  } else {
    processSteps.forEach((step, index) => setTimeout(() => step.classList.add('is-visible'), index * 140));
  }
}
