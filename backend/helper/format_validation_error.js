
const formatJoiErrors = (errors, attributeNames, customMessages) => {
    const formattedErrors = {};

    errors.forEach(error => {
        const field = error.path.join('.');

        let friendlyName = field;
        if (attributeNames && attributeNames[field]) {
            friendlyName = attributeNames[field];
        }

        const message = error.message.replace(`"${field}"`, `${friendlyName}`);
        const customMessageField = field + "." + error.type;

        let customMessage = message;
        if (customMessages && customMessages[customMessageField]) {
            customMessage = customMessages[customMessageField];
        }

        if (!formattedErrors[field]) {
            formattedErrors[field] = [];
        }

        formattedErrors[field].push(customMessage);
    });

    return formattedErrors;
};

module.exports = {
    formatJoiErrors
}