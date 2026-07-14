// =====================================================
// Principal Services — shared site behaviour
// =====================================================

// Keep --header-h in sync with the real header height (logo size, wrapping,
// font-size changes on small phones, etc. all affect this)
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const setH = () => document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  setH();
  window.addEventListener('resize', setH);
  window.addEventListener('orientationchange', setH);
  if (window.ResizeObserver) new ResizeObserver(setH).observe(header);
})();

// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('is-open'))
  );
})();

// Highlight the current page in the nav
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach((a) => {
    if (a.dataset.page === path) a.classList.add('is-active');
  });
})();

// Footer year
(function () {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// FAQ accordion
(function () {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('is-open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });
})();

// -----------------------------------------------------
// Contact form — EmailJS
// -----------------------------------------------------
// To activate real email delivery:
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service + Template, then replace the
//      three placeholders below with your own IDs/keys.
//   3. Uncomment the emailjs.init(...) line and the
//      <script src="...emailjs.../browser.js"> tag in
//      contact.html (already included, just fill in keys).
// Until then the form validates and shows a friendly
// confirmation message locally, without sending anything.
// -----------------------------------------------------
(function () {
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach((f) => {
      if (!f.value.trim()) valid = false;
    });
    if (!valid) {
      status.textContent = 'Please fill in your name, phone number, and message.';
      status.classList.add('err');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const finish = (ok, msg) => {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
      status.textContent = msg;
      status.className = 'form-status ' + (ok ? 'ok' : 'err');
      if (ok) form.reset();
    };

    if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form).then(
        () => finish(true, "Thanks — your message is on its way. We'll call you back shortly."),
        () => finish(false, 'Something went wrong sending your message. Please call or WhatsApp us instead.')
      );
    } else {
      // Local fallback until EmailJS keys are added
      setTimeout(() => {
        finish(true, "Thanks — your enquiry has been noted. Call/WhatsApp us at +974 5032 9977 for the fastest response while email delivery is being connected.");
      }, 600);
    }
  });
})();
