(function () {

  // ── Source detection ──────────────────────────────────────────────────────
  function getSource() {
    var p = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');
    return p || 'website';
  }

  // ── Field error helpers ───────────────────────────────────────────────────
  function getErrorSpan(input) {
    var id = input.id + '_err';
    var span = document.getElementById(id);
    if (!span) {
      span = document.createElement('span');
      span.id = id;
      span.style.cssText = 'display:none;color:#ef4444;font-size:0.78rem;margin-top:0.3rem;display:block;';
      span.style.display = 'none';
      if (input.parentNode) input.parentNode.appendChild(span);
    }
    return span;
  }

  function setFieldError(input, msg) {
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.25)';
    var span = getErrorSpan(input);
    span.textContent = msg;
    span.style.display = 'block';
  }

  function clearFieldError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    var span = document.getElementById(input.id + '_err');
    if (span) span.style.display = 'none';
  }

  function validateName(input) {
    if (!input.value.trim()) {
      setFieldError(input, 'Введите ваше имя');
      return false;
    }
    clearFieldError(input);
    return true;
  }

  function validatePhone(input) {
    var digits = input.value.replace(/\D/g, '');
    if (digits.length !== 11) {
      setFieldError(input, 'Введите телефон полностью: +7 (XXX) XXX-XX-XX');
      return false;
    }
    clearFieldError(input);
    return true;
  }

  // ── Phone mask ─────────────────────────────────────────────────────────────
  function phoneMask(input) {
    var v = input.value.replace(/\D/g, '');
    if (!v) { input.value = ''; return; }
    if (v[0] === '8') v = '7' + v.slice(1);
    else if (v[0] !== '7') v = '7' + v;
    v = v.slice(0, 11);
    var r = '+' + v[0];
    if (v.length > 1) r += ' (' + v.slice(1, 4);
    if (v.length >= 4) r += ')';
    if (v.length > 4) r += ' ' + v.slice(4, 7);
    if (v.length > 7) r += '-' + v.slice(7, 9);
    if (v.length > 9) r += '-' + v.slice(9, 11);
    input.value = r;
    if (v.length === 11) clearFieldError(input);
  }

  function setupPhoneMask(input) {
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if ([9, 13, 27, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) return;
      if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) return;
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        var d = input.value.replace(/\D/g, '');
        if (d.length <= 1) { input.value = ''; return; }
        input.value = d.slice(0, -1);
        phoneMask(input);
        return;
      }
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        var d = input.value.replace(/\D/g, '');
        if (d.length >= 11) return;
        input.value = d + e.key;
        phoneMask(input);
        return;
      }
      e.preventDefault();
    });
    input.addEventListener('paste', function (e) {
      e.preventDefault();
      input.value = (e.clipboardData || window.clipboardData).getData('text');
      phoneMask(input);
    });
    input.addEventListener('focus', function () { if (!input.value) input.value = '+7 ('; });
    input.addEventListener('blur', function () {
      if (input.value.replace(/\D/g, '').length <= 1) { input.value = ''; return; }
      validatePhone(input);
    });
  }

  // ── Send icon ──────────────────────────────────────────────────────────────
  var SI = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  var SUBMIT_ERR = 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами напрямую.';

  // ── Form submit ────────────────────────────────────────────────────────────
  function doSubmit(ids) {
    var nameEl  = document.getElementById(ids.name);
    var phoneEl = document.getElementById(ids.phone);
    var errorEl = document.getElementById(ids.error);
    var btn     = document.getElementById(ids.btn);
    if (!nameEl || !phoneEl || !btn) return;
    if (errorEl) errorEl.classList.remove('active');

    var nameOk  = validateName(nameEl);
    var phoneOk = validatePhone(phoneEl);
    if (!nameOk || !phoneOk) return;

    btn.disabled = true;
    btn.innerHTML = '<span style="animation:pulse 1s infinite">Отправка...</span>';

    var source = getSource();
    var fd = new FormData();
    fd.append('access_key', 'b19e7dd9-9b38-4009-a408-10fe3764d836');
    fd.append('name', nameEl.value.trim());
    fd.append('phone', phoneEl.value.trim());
    fd.append('subject', 'Новая заявка с сайта HuntedLead (' + source + ')');
    fd.append('from_name', 'HuntedLead');

    var tgBody = JSON.stringify({ name: nameEl.value.trim(), phone: phoneEl.value.trim(), source: source });

    Promise.all([
      fetch('/api/send-lead.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: tgBody })
        .then(function (r) { return r.json(); }).catch(function () { return {}; }),
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function (r) { return r.json(); }).catch(function () { return {}; })
    ]).then(function (res) {
      var tg = res[0], w3 = res[1];
      if (tg.success || w3.success) {
        var formEl = document.getElementById(ids.form);
        if (formEl) formEl.style.display = 'none';
        var successEl = document.getElementById(ids.success);
        if (successEl) successEl.classList.add('active');
      } else {
        throw new Error(tg.error || w3.message || 'Server error');
      }
    }).catch(function (err) {
      console.error('Submit error:', err);
      if (errorEl) { errorEl.textContent = SUBMIT_ERR; errorEl.classList.add('active'); }
      btn.disabled = false;
      btn.innerHTML = SI + ' Оставить заявку';
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.submitForm = function () {
    doSubmit({ name: 'userName', phone: 'userPhone', form: 'leadForm', success: 'formSuccess', error: 'formError', btn: 'submitBtn' });
  };
  window.submitContactsForm = function () {
    doSubmit({ name: 'contactsName', phone: 'contactsPhone', form: 'contactsLeadForm', success: 'contactsFormSuccess', error: 'contactsFormError', btn: 'contactsSubmitBtn' });
  };
  window.openPrivacy = function (e) {
    e.preventDefault();
    var m = document.getElementById('privacyModal');
    if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
  };
  window.closePrivacy = function () {
    var m = document.getElementById('privacyModal');
    if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
  };

  // ── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    setupPhoneMask(document.getElementById('userPhone'));
    setupPhoneMask(document.getElementById('contactsPhone'));

    ['userName', 'contactsName'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', function () { validateName(el); });
      el.addEventListener('input', function () { if (el.value.trim()) clearFieldError(el); });
    });

    var modal = document.getElementById('privacyModal');
    if (modal) modal.addEventListener('click', function (e) { if (e.target === this) window.closePrivacy(); });
  });

})();