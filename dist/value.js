export const getValueFromControlElement = (ctrlData, ctrlElm) => {
    const value = ctrlElm[ctrlData.valuePropName];
    if (ctrlData.valuePropType === 'boolean') {
        return String(value) === 'true';
    }
    if (ctrlData.valuePropType === 'number') {
        return parseFloat(value);
    }
    return String(value);
};
export const setValueFromControlElement = (ctrlData, ctrlElm, value) => (ctrlElm[ctrlData.valuePropName] = ctrlData.valuePropType === 'boolean' ? !!value : String(value));
