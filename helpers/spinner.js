// spinner helper functions
export function showSpinner() {
  document.getElementById("spinner-container").classList.remove("d-none");
}

export function hideSpinner() {
  document.getElementById("spinner-container").classList.add("d-none");
}
