/**
 * Rehab ZSC — Lógica de login
 * Envía credenciales al servidor para verificación en base de datos.
 */

(function () {
  'use strict';

  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const togglePassword = document.getElementById('togglePassword');

  const API_URL = '/api/auth/login';

  /* Mostrar / ocultar contraseña */
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.querySelector('.icon-show').hidden = isPassword;
    togglePassword.querySelector('.icon-hide').hidden = !isPassword;
    togglePassword.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.hidden = false;
  }

  function hideAlert() {
    alertBox.hidden = true;
    alertBox.textContent = '';
  }

  function clearFieldErrors() {
    usernameError.textContent = '';
    passwordError.textContent = '';
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
  }

  function setFieldError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
  }

  function validateForm() {
    clearFieldErrors();
    hideAlert();
    let valid = true;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      setFieldError(usernameInput, usernameError, 'El usuario es obligatorio.');
      valid = false;
    } else if (username.length < 3) {
      setFieldError(usernameInput, usernameError, 'El usuario debe tener al menos 3 caracteres.');
      valid = false;
    }

    if (!password) {
      setFieldError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      valid = false;
    } else if (password.length < 4) {
      setFieldError(passwordInput, passwordError, 'La contraseña debe tener al menos 4 caracteres.');
      valid = false;
    }

    return valid;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden = loading;
    btnSpinner.hidden = !loading;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const credentials = {
      username: usernameInput.value.trim(),
      password: passwordInput.value,
    };

    setLoading(true);
    hideAlert();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('Acceso concedido. Redirigiendo…', 'success');
        sessionStorage.setItem('rehabZsc_user', JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        showAlert(data.message || 'Usuario o contraseña incorrectos.', 'error');
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch {
      showAlert('No se pudo conectar con el servidor. Inténtelo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  }

  form.addEventListener('submit', handleSubmit);

  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      if (input === usernameInput) usernameError.textContent = '';
      if (input === passwordInput) passwordError.textContent = '';
    });
  });
})();
