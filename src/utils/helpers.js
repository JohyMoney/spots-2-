export function setbuttonText(btn, isloading, loadingText = "Saving...", defaultText = "Save") {
  if (isloading) {
    btn.disabled = true;
    btn.textContent = loadingText;
  } else {
    btn.disabled = false;
    btn.textContent = defaultText;
  }
}


