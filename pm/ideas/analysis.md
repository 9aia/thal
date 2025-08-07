# Analysis

## User Perspective

 * Send Message: After sending your message, a small button may appear if mistakes are found.
 * See Correction: Clicking the button instantly shows you the corrected message with the changes highlighted. Clicking the button again would hide the corrections until you click on it again. You can also close the highlighted changes clicking on the close icon on the message.
 * Get Summary: For a deeper dive, you can click on the message to open a modal with a summary of the changes.
** Get Explanation: Click on the "Explain" button inside the modal to get a detailed breakdown of why the corrections were made.
** In the modal, you can also request "Re-analyze", "Ignore" or just close it.

## Developer Perspective

This revised user flow for the message analysis introduces some key technical considerations:

Backend

 * [x] Initial Request: When the user sends a message, two concurrent requests are still the most efficient approach: one for the character's reply and another for the corrected version of the user's message if applicable.
 * Diffing Logic: The diff is now crucial. The backend needs to store both the original and corrected messages. The diffing algorithm (e.g., diff-match-patch) will likely run on the client-side to dynamically highlight changes without extra server load, but the corrected text itself must be generated and stored on the server.
 * Modal Content: When the user clicks the message to open the modal, the backend will need to retrieve the corrected message and generate the summary. And after clicking "Explain" to generate  the explanation on demand. The "Re-analyze" button will trigger a new LLM request to get a fresh corrected message, summary and if necessary a explanation.
 * "Ignore" Logic: The "Ignore" button will likely set a flag in the database for that specific message to hide the corrected version for that message. This requires a dedicated field in the message analysis schema.
 * API Endpoints: You'll need at least three parts:
   * POST /message: Handles the message and triggers the concurrent LLM calls (character response and analysis).
   * SERVICE getMessageCorrection(): Retrieves the corrected message for the diffing and the summary of the changes, if applicable.
   * GET /message/:id/explanation: Generates and returns the detailed explanation.
  * POST /message/:id/ignore: Marks the current message analysis as ignored and let the user analyze again
  * POST /message/:id/re-analyze: Regenerate the corrected message, the summary and the explanation, if applicable

Frontend
 * UI State Management: You'll need to manage the state of each message. Each message object in your UI would need a state property like correctionVisible and modalOpen to control the visibility of the correction, modal, and the "mistakes" button itself.
 * Component Structure: The message component will need to be intelligent. It should conditionally render the "mistakes" button. Clicking this button would toggle the correctionVisible state, causing the component to re-render and show the diffed version of the message. Clicking the message body itself would trigger the modal to open.
 * Caching: To reduce repeated DB calls, you could cache the corrected message and the explanation data on the client-side using TanStack Query after the first request. This makes subsequent message (history) interactions faster.
 * Dynamic UI: The UI will need to handle multiple states for a single message: normal, correction visible, and modal open. This requires careful component design to ensure a smooth transition between states without jarring the user. The "close" icon on the message will revert to the normal message view and the "close" button in the modal will close the modal.
