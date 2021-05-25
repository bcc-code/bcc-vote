export default {
  focusOnNextFormInput: (el) => {
    const currentIndex = Array.from(el.form.elements).indexOf(el);
    if (currentIndex < el.form.elements.length - 1)
      el.form.elements.item(currentIndex + 1).focus();
  },
  focusOnPreviousFormInput: (el) => {
    const currentIndex = Array.from(el.form.elements).indexOf(el);
    if (currentIndex > 0)
      el.form.elements.item(currentIndex - 1).focus();
  },
  repeat: (num, func) => {
    for (let i = 0; i < num; i++) {
      func();
    }
  }
}
