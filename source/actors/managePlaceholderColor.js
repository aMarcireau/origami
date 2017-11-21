const style = document.createElement('style');
let placeholderColor = null;

export default function managePlaceholderColor(store) {
    const state = store.getState();
    if (state.colors.placeholderColor !== placeholderColor) {
        placeholderColor = state.colors.placeholderColor;
        if (style.styleSheet) {
            style.styleSheet.cssText = `input::-webkit-input-placeholder {color: ${placeholderColor};}`;
        } else {
            style.appendChild(document.createTextNode(`input::-webkit-input-placeholder {color: ${placeholderColor};}`));
        }
    }
}
