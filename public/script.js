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
  responseDiv.style.display = "block";
  document.getElementById("shareContainer").style.display = "flex";

  typeWriterEffect(document.getElementById("typewriter"), data.result, 20);
}

function typeWriterEffect(element, text, speed) {
  let i = 0;
  element.classList.remove("justify-text");

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.classList.add("justify-text");
      removeCursor();
    }
  }

  type();
}

function removeCursor() {
  const cursor = document.querySelector(".cursor");
  if (cursor) cursor.remove();
}

let loadingInterval;

function startLoading(element) {
  let dots = 0;
  element.classList.add("loading");
  element.style.display = "flex";
  element.innerHTML = `<span id="loading-text">Interpretando</span>`;

  const loadingText = document.getElementById("loading-text");

  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    if (loadingText) {
      loadingText.innerText = "Interpretando" + ".".repeat(dots);
    }
  }, 400);
}

function stopLoading(element) {
  clearInterval(loadingInterval);
  element.classList.remove("loading");
}

// Resumo para o WhatsApp
function gerarResumo(textoCompleto) {
  const maxLength = 600;
  let resumo = textoCompleto.substring(0, maxLength);
  const ultimoPonto = resumo.lastIndexOf('.');

  if (ultimoPonto > 100) {
    resumo = resumo.substring(0, ultimoPonto + 1);
  }

  return `*Interpretador de Sonhos*\n\n${resumo.trim()}\n\n*Descubra o significado do seu sonho em:* app.eleveia.com.br`;
}

document.getElementById("shareButton").addEventListener("click", function () {
  const textoCompleto = document.getElementById("response").innerText;
  const resumo = gerarResumo(textoCompleto);
  const mensagem = encodeURIComponent(resumo);
  const linkWhatsApp = `https://wa.me/?text=${mensagem}`;
  window.open(linkWhatsApp, "_blank");
});
