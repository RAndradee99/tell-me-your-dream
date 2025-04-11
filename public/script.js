async function sendDream() {
  const dream = document.getElementById("dreamInput").value;
  const responseDiv = document.getElementById("response");

  startLoading(responseDiv);

  const res = await fetch("/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dream })
  });

  const data = await res.json();

  stopLoading(responseDiv);
  responseDiv.innerHTML = '<span id="typewriter"></span>';
  typeWriterEffect(document.getElementById("typewriter"), data.result, 20);
}

function typeWriterEffect(element, text, speed) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

let loadingInterval;

function startLoading(element) {
  let dots = 0;
  element.classList.add("loading"); // ✅ ADICIONA a classe
  element.innerHTML = "Interpretando";
  element.style.display = "block";
  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    element.innerHTML = "Interpretando" + ".".repeat(dots);
  }, 400);
}

function stopLoading(element) {
  clearInterval(loadingInterval);
  element.classList.remove("loading"); // ✅ REMOVE a classe
}
