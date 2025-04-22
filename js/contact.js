export function initContact() {
    // Select all one-column elements with the 'contact' class
    const contactColumns = document.querySelectorAll('.one-column.contact');

    contactColumns.forEach(contactColumn => {
        const formWrapper = contactColumn.querySelector('.form-wrapper');
        const closeButton = formWrapper.querySelector('.close');
        const getInTouchButton = contactColumn.querySelector('.get-in-touch');

        // Function to open the form
        function openForm() {
            formWrapper.classList.add('active');
        }

        // Function to close the form
        function closeForm() {
            formWrapper.classList.remove('active');
        }

        // Add click event listener to the entire one-column element
        contactColumn.addEventListener('click', function (event) {
            // Prevent form from opening if an anchor inside the .text element is clicked,
            // unless it's the "Get in touch" button
            const isAnchorInText = event.target.closest('.text a');
            if (isAnchorInText && !event.target.closest('.get-in-touch')) {
                return; // Do nothing, as the anchor has its own action
            }

            // Prevent click from propagating when close button is clicked
            if (event.target === closeButton || closeButton.contains(event.target)) {
                return;
            }

            openForm();
        });

        // Add click event listener to the close button
        if (closeButton) {
            closeButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent any default behavior
                closeForm();
            });
        }

        // Add click event listener to the "Get in touch" button
        if (getInTouchButton) {
            getInTouchButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default link behavior
                openForm();
            });
        }
    });
}