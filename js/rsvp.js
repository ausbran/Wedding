export function initRSVP() {
  const form = document.getElementById("rsvp-form");
  const steps = form.querySelectorAll(".form-step");
  let currentStep = 1;

  function trashIcon() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 29.625 27.462">
        <g transform="translate(-0.188 -1.269)">
          <path id="Path_544" data-name="Path 544" d="M22.572,27.981H7.428a2.163,2.163,0,0,1-2.163-2.163V6.346H24.735V25.817a2.163,2.163,0,0,1-2.163,2.163Z" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          <path id="Path_545" data-name="Path 545" d="M11.755,21.49V12.837" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          <path id="Path_546" data-name="Path 546" d="M18.245,21.49V12.837" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          <path id="Path_547" data-name="Path 547" d="M.938,6.346H29.063" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          <path id="Path_548" data-name="Path 548" d="M18.245,2.019h-6.49A2.163,2.163,0,0,0,9.591,4.183V6.346H20.409V4.183a2.163,2.163,0,0,0-2.163-2.163Z" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
        </g>
      </svg>
    `;
  }

  function createPersonBlock(type, index) {
    const wrapperClass = type === "adult" ? "#adults" : "#children";
    const nameLabel = type === "adult" ? "First Name" : "Name";
    const nameFieldName = type === "adult" ? "adultFirstName[]" : "childName[]";

    const ageField =
      type === "child"
        ? `<div class="field"><label>Age</label>
           <div class="number-field">
             <input type="number" name="childAge[]" min="0" />
             <div class="custom-spinner">
               <button type="button" class="spin-up"></button>
               <button type="button" class="spin-down"></button>
             </div>
           </div>
         </div>`
        : "";

    const html = `
    <div class="${type}">
      <h4>${type.charAt(0).toUpperCase() + type.slice(1)} #${index}</h4>
      <div class="row${type === "adult" ? " adult-wrapper" : ""}">
        <div class="field">
          <label>${nameLabel}</label>
          <input type="text" name="${nameFieldName}" />
        </div>
        ${
          type === "adult"
            ? `<div class="field">
              <label>Last Name</label>
              <input type="text" name="adultLastName[]" />
            </div>`
            : ageField
        }
        <div class="field trash">
            <button type="button" class="remove" aria-label="Remove">${trashIcon()}</button>
          </div>
      </div>
    </div>`;

    return html;
  }

  function createActivity(index) {
    return `
      <div class="activity" data-index="${index}">
        <h4>Activity #${index}</h4>
        <div class="row">
          <div class="field">
            <label>Choose an activity:</label>
            <select name="activity[]">
              <option value="biking">Biking</option>
              <option value="kayaking">Kayaking</option>
              <option value="hiking">Hiking</option>
            </select>
          </div>
          <div class="field">
            <label>Number of people</label>
            <div class="number-field">
              <input type="number" name="activityCount[]" min="1" />
              <div class="custom-spinner">
                <button type="button" class="spin-up"></button>
                <button type="button" class="spin-down"></button>
              </div>
            </div>
          </div>
          <div class="field trash">
            <button type="button" class="remove" aria-label="Remove">${trashIcon()}</button>
          </div>
        </div>
      </div>`;
  }

  function addSpinnerEvents(container) {
    const input = container.querySelector("input");
    container
      .querySelector(".spin-up")
      ?.addEventListener("click", () => input.stepUp());
    container
      .querySelector(".spin-down")
      ?.addEventListener("click", () => input.stepDown());
  }

  function renumberActivities() {
    const wrapper = form.querySelector("#pnw-activities .activity-wrapper");
    if (!wrapper) return;
    wrapper.querySelectorAll(".activity").forEach((act, i) => {
      const heading = act.querySelector("h4");
      if (heading) heading.textContent = `Activity #${i + 1}`;
    });
  }

  function showStep(step) {
    steps.forEach((s) => {
      window.scrollTo({
        top: 0,
      });
      const isTarget = s.getAttribute("data-step") == step;
      s.style.display = isTarget ? "block" : "none";
      const inputs = s.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (isTarget && input.dataset.originalRequired === "true") {
          input.setAttribute("required", "");
        } else if (!isTarget && input.hasAttribute("required")) {
          input.dataset.originalRequired = "true";
          input.removeAttribute("required");
        }
      });
    });
    currentStep = step;
  }

  form.addEventListener("click", function (e) {
    if (e.target.matches('[data-response="yes"]')) {
      document.getElementById("attending").value = "yes";
      showStep(2);
    } else if (e.target.matches('[data-response="no"]')) {
      document.getElementById("attending").value = "no";
      showStep("sorry");
    } else if (e.target.classList.contains("back")) {
      showStep(currentStep === 3 ? 2 : 1);
    } else if (e.target.classList.contains("next")) {
      showStep(3);
    } else if (e.target.classList.contains("add-adult")) {
      const count = form.querySelectorAll("#adults .adult").length + 1;
      const div = document.createElement("div");
      div.innerHTML = createPersonBlock("adult", count);
      form.querySelector("#adults").appendChild(div);
    } else if (e.target.classList.contains("add-child")) {
      const count = form.querySelectorAll("#children .child").length + 1;
      const div = document.createElement("div");
      div.innerHTML = createPersonBlock("child", count);
      form.querySelector("#children").appendChild(div);
      // ✅ Add this line to activate spinner buttons
      div.querySelectorAll(".number-field").forEach(addSpinnerEvents);
    } else if (e.target.closest(".remove")) {
      const block = e.target.closest(".adult, .child, .activity");
      if (block) block.remove();
      renumberActivities();
    } else if (e.target.classList.contains("add-activity")) {
      const wrapper = form.querySelector("#pnw-activities .activity-wrapper");
      const index = wrapper.children.length + 1;
      const activityHTML = createActivity(index);
      wrapper.insertAdjacentHTML("beforeend", activityHTML);

      // Add spinner to the newly added block
      const newActivity = wrapper.lastElementChild;
      addSpinnerEvents(newActivity);
    } else if (e.target.name === "pnwFunDay" && e.target.type === "radio") {
      const container = form.querySelector("#pnw-activities");
      const wrapper = container.querySelector(".activity-wrapper");
      if (e.target.value === "yes") {
        container.style.display = "block";
        if (!wrapper.querySelector(".activity")) {
          const activityHTML = createActivity(1);
          wrapper.insertAdjacentHTML("beforeend", activityHTML);
          const newActivity = wrapper.lastElementChild;
          addSpinnerEvents(newActivity);
        }
      } else {
        container.style.display = "none";
        wrapper.innerHTML = "";
      }
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    form.querySelectorAll(".form-step").forEach((step) => {
      if (step.style.display === "none") {
        step.querySelectorAll("[required]").forEach((input) => {
          input.removeAttribute("required");
        });
      }
    });

    let formData = {};
    const attending = document.getElementById("attending").value;

    if (attending === "no") {
      const first = form.querySelector('input[name="notAttendingfirstName"]');
      const last = form.querySelector('input[name="notAttendinglastName"]');

      if (!first.value.trim() || !last.value.trim()) {
        alert("Please enter your first and last name.");
        first.focus();
        return;
      }

      formData = {
        attending: "no",
        notAttendingfirstName: first.value.trim(),
        notAttendinglastName: last.value.trim(),
      };
    } else if (attending === "yes") {
      formData = {
        attending: "yes",
        firstName: form.querySelector('input[name="firstName"]')?.value || "",
        lastName: form.querySelector('input[name="lastName"]')?.value || "",
        email: form.querySelector('input[name="email"]')?.value || "",
        phone: form.querySelector('input[name="phone"]')?.value || "",
        pnwFunDay:
          form.querySelector("#pnw-activities").style.display === "block"
            ? "yes"
            : "no",
        adults: Array.from(form.querySelectorAll("#adults .adult")).map(
          (div) => ({
            firstName:
              div.querySelector('input[name="adultFirstName[]"]')?.value || "",
            lastName:
              div.querySelector('input[name="adultLastName[]"]')?.value || "",
          })
        ),
        children: Array.from(document.querySelectorAll("#children .child")).map(
          (div) => ({
            name: div.querySelector('input[name="childName[]"]')?.value || "",
            age: div.querySelector('input[name="childAge[]"]')?.value || "",
          })
        ),
        activities:
          form.querySelector("#pnw-activities").style.display === "block"
            ? Array.from(
                form.querySelectorAll("#pnw-activities .activity")
              ).map((div) => ({
                type:
                  div.querySelector('select[name="activity[]"]')?.value || "",
                count:
                  div.querySelector('input[name="activityCount[]"]')?.value ||
                  "",
              }))
            : [], // 🔥 this prevents passing anything if PNW day = no
        events: {
          welcome:
            form.querySelector('input[name="welcome"]:checked')?.value || "",
          ceremony:
            form.querySelector('input[name="ceremony"]:checked')?.value || "",
          brunch:
            form.querySelector('input[name="brunch"]:checked')?.value || "",
        },
        otherDetails:
          form.querySelector('textarea[name="otherDetails"]')?.value || "",
      };
    }

    const endpoint =
      "https://script.google.com/macros/s/AKfycbwrzD5O4pv05Ci3axeHel60bDbkV49okzaD6E9pXGUMAONsoHh3Y8k1UzBfZeS9qbZ21g/exec";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(formData),
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const rsvpContainer = document.querySelector(".rsvp");

      // Fade out the form
      form.classList.add("fading-out");

      // Wait for the transition to finish before removing and showing message
      setTimeout(() => {
        form.remove();

        const success = document.createElement("div");
        success.className = "form-success";
        success.innerHTML =
          "<h2>Thank you! Your RSVP has been submitted. 🎉</h2>";
        rsvpContainer.appendChild(success);

        // Trigger fade in
        requestAnimationFrame(() => {
          success.classList.add("show");
        });
      }, 400);
    } catch (err) {
      console.error(err);
      alert("There was an error submitting the form. Please try again.");
    }
  });

  // Add spinner functionality to any pre-rendered fields
  document.querySelectorAll(".number-field").forEach(addSpinnerEvents);
}
