import { recognize } from 'https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/+esm';

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("preview");
const outputBox = document.getElementById("output");

previewImage.style.display = "none";
outputBox.style.display = "none";

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
  outputBox.innerText = "Processando image  m...";

  try {
    const { data: { text } } = await recognize(imageData, "por", {
      logger: ({ status, progress }) => {
        outputBox.innerText = `${status} (${Math.round(progress * 100)}%)`;
      }
    });

    outputBox.innerText = text || "Nenhum texto encontrado.";
  } catch (error) {
    outputBox.innerText = "Erro ao processar a imagem.";
    console.error(error);
  }
}

previewImage.addEventListener("click", () => {
  previewImage.classList.toggle("zoomed");
});
