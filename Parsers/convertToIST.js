function convertToIST(text) {
    // Regular expressions to match time in BST or PST
    const bstRegex = /(\d{1,2}:\d{2})\s*(AM|PM)?\s*(BST)/gi;
    const pstRegex = /(\d{1,2}:\d{2})\s*(AM|PM)?\s*(PST)/gi;

    let bstMatch = bstRegex.exec(text);
    let pstMatch = pstRegex.exec(text);
    let results = [];

    if (bstMatch) {
        let timeStr = bstMatch[1];
        let amPm = bstMatch[2] || ''; // AM/PM if exists
        let bstDate = new Date(`1970-01-01T${timeStr}${amPm}Z`);

        // BST is UTC+1, so convert to IST (UTC+5:30)
        let istDate = new Date(bstDate.getTime() + 4.5 * 60 * 60 * 1000);
        results.push(`${timeStr} ${amPm} BST is ${istDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} IST`);
    }

    if (pstMatch) {
        let timeStr = pstMatch[1];
        let amPm = pstMatch[2] || ''; // AM/PM if exists
        let pstDate = new Date(`1970-01-01T${timeStr}${amPm}Z`);

        // PST is UTC-8, so convert to IST (UTC+5:30)
        let istDate = new Date(pstDate.getTime() + 13.5 * 60 * 60 * 1000);
        results.push(`${timeStr} ${amPm} PST is ${istDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} IST`);
    }

    return results.length > 0 ? results : ['No valid time found in BST or PST.'];
}

// Example usage
const inputText = "The meeting is at 3:30 PM BST and then at 10:00 AM PST.";
const convertedTimes = convertToIST(inputText);
console.log(convertedTimes.join('\n'));
