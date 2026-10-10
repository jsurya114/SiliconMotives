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

// Native scrolling drives a compact stack; no scroll interception or animation library.
const journey = document.querySelector('.journey-section');
const journeyStages = [...document.querySelectorAll('.journey-stage')];
const journeyMarkers = [...document.querySelectorAll('.journey-marker')];
const journeyTabs = [...document.querySelectorAll('.journey-tab')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (journey && journeyStages.length) {
  let pending = false;
  let active = -1;
  const updateJourney = () => {
    pending = false;
    const stickyTop = parseFloat(getComputedStyle(journeyStages[0]).top) || 0;
    const rects = journeyMarkers.map(marker => marker.getBoundingClientRect());
    const heights = journeyStages.map(stage => stage.offsetHeight);
    let current = 0;
    rects.forEach((rect, index) => { if (rect.top <= stickyTop + 80) current = index; });
    journeyStages.forEach((stage, index) => {
      const nextTop = rects[index + 1]?.top;
      const overlap = nextTop == null ? 0 : Math.max(0, Math.min(1, (stickyTop + heights[index] - nextTop) / heights[index]));
      const progress = Math.max(0, Math.min(1, (stickyTop + heights[index] - rects[index].top) / heights[index]));
      stage.style.setProperty('--stack-scale', motionPreference.matches ? 1 : (1 - overlap * 0.035).toFixed(4));
      stage.style.setProperty('--stack-shade', motionPreference.matches ? 0 : (overlap * 0.12).toFixed(4));
      journeyTabs[index].style.setProperty('--stage-progress', progress.toFixed(4));
    });
    if (current !== active) {
      active = current;
      journeyStages.forEach((stage, index) => {
        stage.classList.toggle('is-current', index === current);
        journeyTabs[index].classList.toggle('is-complete', index < current);
        if (index === current) journeyTabs[index].setAttribute('aria-current', 'step');
        else journeyTabs[index].removeAttribute('aria-current');
      });
    }
  };
  const scheduleJourney = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateJourney); }
  };
  const configureMotion = () => {
    journey.classList.toggle('has-journey-stack', !motionPreference.matches);
    scheduleJourney();
  };
  journeyTabs.forEach((tab, index) => tab.addEventListener('click', event => {
    event.preventDefault();
    const stickyTop = parseFloat(getComputedStyle(journeyStages[index]).top) || 160;
    const top = window.scrollY + journeyMarkers[index].getBoundingClientRect().top - stickyTop;
    window.scrollTo({ top, behavior: motionPreference.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', tab.getAttribute('href'));
  }));
  configureMotion();
  motionPreference.addEventListener('change', configureMotion);
  window.addEventListener('scroll', scheduleJourney, { passive: true });
  window.addEventListener('resize', scheduleJourney);
  window.addEventListener('pageshow', scheduleJourney);
  document.fonts.ready.then(scheduleJourney);
}
