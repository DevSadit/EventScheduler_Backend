"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeEvent = categorizeEvent;
function categorizeEvent(title, notes = "") {
    const workKeywords = ["meeting", "project", "client"];
    const personalKeywords = ["birthday", "family"];
    const combinedText = `${title} ${notes}`.toLowerCase();
    if (workKeywords.some(word => combinedText.includes(word))) {
        return "Work";
    }
    if (personalKeywords.some(word => combinedText.includes(word))) {
        return "Personal";
    }
    return "Other";
}
