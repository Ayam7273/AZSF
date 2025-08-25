document.addEventListener("DOMContentLoaded", function () {
  const formSteps = document.querySelectorAll(".form-step");
  const nextBtns = document.querySelectorAll(".next-button");
  const prevBtns = document.querySelectorAll(".prev-button");
  const progress = document.querySelector(".progress");
  const progressSteps = document.querySelectorAll(".progress-step");

  let currentStep = 0;

  function updateFormSteps() {
      formSteps.forEach((step, index) => {
          step.style.display = index === currentStep ? "block" : "none";
      });

      progressSteps.forEach((step, index) => {
          if (index <= currentStep) {
              step.classList.add("active");
          } else {
              step.classList.remove("active");
          }
      });

      progress.style.width = `${(currentStep / (formSteps.length - 1)) * 100}%`;
  }

  nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
          if (currentStep < formSteps.length - 1) {
              currentStep++;
              updateFormSteps();
          }
      });
  });

  prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
          if (currentStep > 0) {
              currentStep--;
              updateFormSteps();
          }
      });
  });

  updateFormSteps(); // Initialize the form
});
