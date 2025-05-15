
const formatJoiErrors = (errors, attributeNames, customMessages) => {
    const formattedErrors = {};

    errors.forEach(error => {
        const field = error.path.join('.');
        const friendlyName = attributeNames[field] || field;
        const message = error.message.replace(`"${field}"`, `${friendlyName}`);
        const customMessageField = field + "." + error.type;
        const customMessage = customMessages[customMessageField] || message;

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