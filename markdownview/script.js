/* ===========================================================
   Markdown Loader — Simple & Fast
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const markdownFile = "README.md"; // Change if needed

  fetch(markdownFile)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${markdownFile}`);
      return res.text();
    })
    .then((text) => {
      document.getElementById("content").innerHTML = marked.parse(text);
    })
    .catch((err) => {
      document.getElementById("content").innerHTML =
        `<p style="color:red;">Error loading Markdown: ${err.message}</p>`;
    });
});
