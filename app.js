(() => {
  const DEMO_CODE = "8402";
  const inputs = [...document.querySelectorAll(".slot input")];
  const form = document.getElementById("otp-form");
  const stage = document.getElementById("otp-stage");
  const card = document.getElementById("card");
  const fillButton = document.getElementById("fill-btn");
  const verifyButton = document.getElementById("verify-btn");
  const error = document.getElementById("error");
  const helper = document.getElementById("helper");
  const continueButton = document.getElementById("continue-btn");
  let verifying = false;

  const readCode = () => inputs.map(input => input.value).join("");
  const focusAt = index => inputs[Math.max(0, Math.min(index, inputs.length - 1))].focus();

  function updateFilledState() {
    const complete = inputs.every(input => input.value.length === 1);
    stage.classList.toggle("verified", complete);
    verifyButton.style.display = complete ? "block" : "none";
    if (complete) error.textContent = "";
  }

  function setCode(value) {
    const digits = String(value).replace(/\D/g, "").slice(0, 4);
    inputs.forEach((input, index) => input.value = digits[index] || "");
    updateFilledState();
    focusAt(Math.min(digits.length, 3));
  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      const digit = input.value.replace(/\D/g, "").slice(-1);
      input.value = digit;
      if (digit && index < inputs.length - 1) focusAt(index + 1);
      updateFilledState();
    });
    input.addEventListener("keydown", event => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].value = "";
        focusAt(index - 1);
        updateFilledState();
      }
      if (event.key === "ArrowLeft" && index > 0) focusAt(index - 1);
      if (event.key === "ArrowRight" && index < 3) focusAt(index + 1);
    });
    input.addEventListener("paste", event => {
      const pasted = event.clipboardData?.getData("text") || "";
      if (pasted) {
        event.preventDefault();
        setCode(pasted);
      }
    });
  });

  fillButton.addEventListener("click", () => {
    setCode(DEMO_CODE);
    error.textContent = "";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (verifying) return;
    const entered = readCode();
    if (entered.length !== 4) {
      error.textContent = "Enter all four digits to continue.";
      return;
    }
    if (entered !== DEMO_CODE) {
      error.textContent = "That code doesn't match. Try 8402.";
      inputs.forEach(input => input.value = "");
      updateFilledState();
      focusAt(0);
      return;
    }
    verifying = true;
    error.textContent = "";
    verifyButton.disabled = true;
    verifyButton.textContent = "Verifying…";
    stage.classList.add("verified");
    window.setTimeout(() => {
      card.classList.add("success");
      helper.textContent = "Your one-time passcode has been accepted.";
      verifying = false;
    }, 650);
  });

  continueButton.addEventListener("click", () => {
    card.classList.remove("success");
    setCode("");
    verifyButton.disabled = false;
    verifyButton.innerHTML = 'Verify code <span>→</span>';
    helper.innerHTML = 'Type it, paste it, or let the message fill it — <strong>8402</strong> is the good one.';
    focusAt(0);
  });

  updateFilledState();
})();