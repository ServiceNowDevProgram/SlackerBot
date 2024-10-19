
function getInstanceStatus(instanceName) {

    const mockStatus = {
        instance: instanceName,
        status: 'Up',
        lastChecked: new Date().toISOString()
    };
    return mockStatus;
}


function handleMessage(message) {
    const command = message.text.trim().toLowerCase();

    if (command.startsWith('status')) {
        const instanceName = command.split(' ')[1];
        const status = getInstanceStatus(instanceName);
        sendMessage(message.channel, `Instance: ${status.instance}\nStatus: ${status.status}\nLast Checked: ${status.lastChecked}`);
    } else {
        sendMessage(message.channel, 'Unknown command. Please try again.');
    }
}


function sendMessage(channel, text) {

    console.log(`Sending message to channel ${channel}: ${text}`);
}


module.exports = {
    handleMessage
};
