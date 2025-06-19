import { browser } from "$app/environment"

const mm_dd_yyyy = () => new Date().toLocaleDateString();

// I do not like this
// Create a temporary a tag to simulate a href file download experience
export function fileDownload(blob: Blob) {
  if(!browser || !blob) return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${mm_dd_yyyy()}_reports.xlsx`// Current date string generation helper
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}