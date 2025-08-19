document.addEventListener("DOMContentLoaded", () => {
	const emailForm = document.getElementById("email-signup-form");
	const emailInput = document.getElementById("email-input");
	const formMessage = document.getElementById("form-message");
	const infoHeader = document.getElementById("info-header");
	const infoContent = document.getElementById("info-content");

	// --- Collapsible Section Logic ---
	if (infoHeader && infoContent) {
		infoHeader.addEventListener("click", () => {
			infoContent.classList.toggle("expanded");
			infoHeader.classList.toggle("active"); // For chevron rotation
		});
	}

	// --- Email Form Submission Logic ---
	if (emailForm) {
		emailForm.addEventListener("submit", async (e) => {
			e.preventDefault(); // Prevent default form submission (page reload)

			const email = emailInput.value.trim();

			if (!email) {
				displayMessage("Please enter your email address.", "error");
				return;
			}

			// Basic email validation (more robust validation should happen on the backend)
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				displayMessage("Please enter a valid email address.", "error");
				return;
			}

			emailInput.disabled = true; // Disable input during submission
			emailForm.querySelector("button").disabled = true; // Disable button
			displayMessage("Submitting...", ""); // Show submitting message

			try {
				// IMPORTANT: Replace with YOUR Cloud Function URL after deployment!
				// You can find this in the Firebase console under Functions -> Dashboard
				// or by running `firebase functions:config:get` after deployment.
				const cloudFunctionUrl = "https://saveemail-rddbjbl3cq-uc.a.run.app";

				const response = await fetch(cloudFunctionUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: email }),
				});

				const data = await response.json();

				if (response.ok) {
					displayMessage(
						data.message || "Thank you for signing up!",
						"success"
					);
					emailInput.value = ""; // Clear the input field
				} else {
					displayMessage(
						data.error || "Something went wrong. Please try again.",
						"error"
					);
				}
			} catch (error) {
				console.error("Error submitting email:", error);
				displayMessage(
					"Could not connect to the server. Please try again later.",
					"error"
				);
			} finally {
				emailInput.disabled = false; // Re-enable input
				emailForm.querySelector("button").disabled = false; // Re-enable button
			}
		});
	}

	// Helper function to display messages
	function displayMessage(message, type) {
		formMessage.textContent = message;
		formMessage.className = `form-message ${type}`; // Add class for styling (success/error)
	}
});
