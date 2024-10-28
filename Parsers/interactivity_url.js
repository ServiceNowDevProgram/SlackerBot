// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Slack verification token (replace with your actual token)
const SLACK_VERIFICATION_TOKEN = 'your-slack-verification-token';

// ServiceNow instance URL and credentials (replace with your actual instance details)
const SERVICENOW_INSTANCE_URL = 'https://INSTANCE.service-now.com';
const SERVICENOW_USERNAME = 'your-username';
const SERVICENOW_PASSWORD = 'your-password';

// Endpoint to handle Slack interactions
app.post('/slackerbot_event_handler/interaction', async (req, res) => {
    const payload = JSON.parse(req.body.payload);

    // Verify the request token
    if (payload.token !== SLACK_VERIFICATION_TOKEN) {
        return res.status(403).send('Invalid token');
    }

    // Handle different types of interactions
    switch (payload.type) {
        case 'block_actions':
            await handleBlockActions(payload);
            break;
        case 'view_submission':
            await handleViewSubmission(payload);
            break;
        default:
            console.log('Unknown interaction type:', payload.type);
    }

    // Respond to Slack to acknowledge receipt of the interaction
    res.status(200).send();
});

// Function to handle block actions
async function handleBlockActions(payload) {
    const action = payload.actions[0];
    console.log('Block action received:', action);

    // Example: Respond to a button click
    if (action.action_id === 'example_button_click') {
        const responseUrl = payload.response_url;
        await axios.post(responseUrl, {
            text: 'Button clicked!',
            replace_original: false
        });
    }
}

// Function to handle view submissions (modals)
async function handleViewSubmission(payload) {
    const view = payload.view;
    console.log('View submission received:', view);

    // Example: Process form data from a modal
    const formData = view.state.values;
    console.log('Form data:', formData);

    // Example: Create a record in ServiceNow
    const incidentData = {
        short_description: formData.short_description.value,
        description: formData.description.value
    };
    await createServiceNowIncident(incidentData);
}

// Function to create an incident in ServiceNow
async function
