export function setbuttonText(btn, isloading) {
  if (isloading) {
    btn.disabled = true;
    btn.textContent = "Saving...";
  } else {
    btn.disabled = false;
    btn.textContent = "Save";
  }
}


 