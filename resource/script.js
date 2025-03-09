const fileInput = document.getElementById('file-input');
const dropArea = document.querySelector('.drop-area');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const formatSelect = document.getElementById('format');
const compressBtn = document.getElementById('compress-btn');
const originalImg = document.getElementById('original-img');
const compressedImg = document.getElementById('compressed-img');
const originalSize = document.getElementById('original-size');
const compressedSize = document.getElementById('compressed-size');
const reductionPercent = document.getElementById('reduction-percent');
const downloadBtn = document.getElementById('download-btn');
const themeToggle = document.getElementById('theme-toggle');

let originalFileSize = 0;

// Drag & Drop Functionality
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  handleFiles(files);
});

// Handle Image Files
function handleFiles(files) {
  if (files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImg.src = e.target.result;
      originalFileSize = (file.size / 1024).toFixed(2);
      originalSize.textContent = `${originalFileSize} KB`;
      // Reset compressed image and stats
      compressedImg.src = '#';
      compressedSize.textContent = '-';
      reductionPercent.textContent = '-';
      downloadBtn.disabled = true;
    };
    reader.readAsDataURL(file);
  }
}

// Compress Image
compressBtn.addEventListener('click', () => {
  const quality = qualitySlider.value / 180;
  const width = widthInput.value || originalImg.naturalWidth;
  const height = heightInput.value || originalImg.naturalHeight;
  const format = formatSelect.value;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(originalImg, 0, 0, width, height);

  canvas.toBlob((blob) => {
    const compressedFileSize = (blob.size / 1024).toFixed(2);
    compressedSize.textContent = `${compressedFileSize} KB`;
    reductionPercent.textContent = `${((1 - blob.size / (originalFileSize * 1024)) * 100).toFixed(2)}%`;

    compressedImg.src = URL.createObjectURL(blob);
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.download = `compressed-image.${format}`;
      link.href = URL.createObjectURL(blob);
      link.click();
    };
  }, `image/${format}`, quality);
});

// Update Quality Value
qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = `${qualitySlider.value}%`;
});

// Dark/Light Mode Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
});