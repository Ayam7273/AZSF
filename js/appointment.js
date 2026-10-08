document.addEventListener("DOMContentLoaded", function () {
  var picker = document.getElementById("slot-picker");
  var hiddenInput = document.getElementById("appointment_slot");
  var selectedLabel = document.getElementById("slot-picker-selected");
  var errorMessage = document.getElementById("slot-picker-error");
  var form = document.getElementById("apply-form");

  if (!picker || !hiddenInput || !form) return;

  function selectSlot(slot, button) {
    hiddenInput.value = slot.id;
    errorMessage.hidden = true;

    var buttons = picker.querySelectorAll(".slot-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("selected");
      buttons[i].setAttribute("aria-pressed", "false");
    }
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");

    selectedLabel.textContent = "Selected: " + slot.dateLabel + ", " + slot.timeLabel;
    selectedLabel.hidden = false;
  }

  function renderSlots(slots) {
    picker.innerHTML = "";

    if (slots.length === 0) {
      picker.innerHTML = '<p class="slot-picker-status">No appointment times are available right now. Please contact us directly.</p>';
      return;
    }

    var byDate = {};
    var order = [];
    slots.forEach(function (slot) {
      if (!byDate[slot.date]) {
        byDate[slot.date] = [];
        order.push(slot.date);
      }
      byDate[slot.date].push(slot);
    });

    order.forEach(function (date) {
      var group = document.createElement("div");
      group.className = "slot-group";

      var heading = document.createElement("h4");
      heading.textContent = byDate[date][0].dateLabel;
      group.appendChild(heading);

      var row = document.createElement("div");
      row.className = "slot-row";

      byDate[date].forEach(function (slot) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "slot-btn";
        button.textContent = slot.timeLabel.split(" – ")[0];
        button.setAttribute("aria-pressed", "false");

        if (!slot.available) {
          button.disabled = true;
          button.classList.add("unavailable");
        } else {
          button.addEventListener("click", function () {
            selectSlot(slot, button);
          });
        }

        row.appendChild(button);
      });

      group.appendChild(row);
      picker.appendChild(group);
    });
  }

  function loadSlots() {
    picker.innerHTML = '<p class="slot-picker-status">Loading available times&hellip;</p>';

    fetch("/api/slots")
      .then(function (response) {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then(function (data) {
        renderSlots(data.slots || []);
      })
      .catch(function () {
        picker.innerHTML = '<p class="slot-picker-status">Couldn’t load appointment times. <button type="button" id="slot-retry" class="slot-retry">Retry</button></p>';
        var retry = document.getElementById("slot-retry");
        if (retry) retry.addEventListener("click", loadSlots);
      });
  }

  form.addEventListener("submit", function (event) {
    if (!hiddenInput.value) {
      event.preventDefault();
      errorMessage.hidden = false;
      errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  loadSlots();
});
