// Basic interactivity: nav toggle, modal, form (client-side), smooth scroll
document.addEventListener('DOMContentLoaded', function () {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle && navToggle.addEventListener('click', () => {
    const show = navList.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', show ? 'true' : 'false');
  });

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        if (navList.classList.contains('show')) navList.classList.remove('show');
      }
    });
  });

  // modal open/close
  const modal = document.getElementById('modal');
  const openApply = document.getElementById('openApply');
  const applyBtn = document.getElementById('applyBtn');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');

  function openModal() { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.style.display = 'none'; document.body.style.overflow = ''; }

  openApply && openApply.addEventListener('click', openModal);
  applyBtn && applyBtn.addEventListener('click', openModal);
  modalClose && modalClose.addEventListener('click', closeModal);
  modalCancel && modalCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // simple form handling: store to localStorage (placeholder)
  const applyForm = document.getElementById('applyForm');
  applyForm && applyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
      name: this.name.value.trim(),
      email: this.email.value.trim(),
      community: this.community.value.trim(),
      role: this.role.value,
      message: this.message.value.trim(),
      ts: new Date().toISOString()
    };
    // save locally (for demo). Replace with POST to your server / Google Forms endpoint.
    const all = JSON.parse(localStorage.getItem('onsnc_applications') || '[]');
    all.push(data);
    localStorage.setItem('onsnc_applications', JSON.stringify(all));
    alert('धन्यवाद! आपका आवेदन सुरक्षित कर लिया गया है (demo)।');
    this.reset();
    closeModal();
    console.log('Saved application:', data);
  });

});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
});

// Simple form message simulation
const form = document.getElementById('join-form');
const msg = document.getElementById('form-msg');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    msg.textContent = "✅ Thank you! Your message has been recorded.";
    form.reset();
  });
}
