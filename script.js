import { recognize } from 'https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/+esm';

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("preview");
const outputBox = document.getElementById("output");
const copyButton = document.getElementById("copyButton");

previewImage.style.display = "none";
outputBox.style.display = "none";
copyButton.style.display = "none";

imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageDataUrl = e.target.result;
    displayPreview(imageDataUrl);
    extractTextFromImage(imageDataUrl);
  };

  reader.readAsDataURL(file);
}

function displayPreview(dataUrl) {
  previewImage.src = dataUrl;
  previewImage.style.display = "block";
  outputBox.style.display = "block";
}

async function extractTextFromImage(imageData) {
  outputBox.innerText = "Processando imagem...";
  copyButton.style.display = "none";

  try {
    const { data: { text } } = await recognize(imageData, "por", {
      logger: ({ status, progress }) => {
        outputBox.innerText = `${status} (${Math.round(progress * 100)}%)`;
      }
    });

    outputBox.innerText = text || "Nenhum texto encontrado.";
    copyButton.style.display = text ? "inline-block" : "none";
  } catch (error) {
    outputBox.innerText = "Erro ao processar a imagem.";
    console.error(error);
  }
}

copyButton.addEventListener("click", () => {
  const text = outputBox.innerText;
  navigator.clipboard.writeText(text)
    .then(() => {
      copyButton.innerText = "Copiado!";
      copyButton.classList.add("success");
      setTimeout(() => {
        copyButton.innerText = "Copiar";
        copyButton.classList.remove("success");
      }, 1000);
    })
    .catch(err => {
      console.error("Erro ao copiar:", err);
      copyButton.innerText = "Erro ao copiar";
    });
});

previewImage.addEventListener("click", () => {
  previewImage.classList.toggle("zoomed");
});
