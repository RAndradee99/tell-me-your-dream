
async function sendDream() {
  const dream = document.getElementById("dreamInput").value;
  const responseDiv = document.getElementById("response");

  responseDiv.innerHTML = "Interpretando sonho...";
  responseDiv.style.display = "block";

  const res = await fetch("/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dream })
  });

  const data = await res.json();
  responseDiv.innerHTML = data.result;
}
