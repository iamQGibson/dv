// DOM Elements
const startScreen = document.getElementById('start-screen');
const cameraScreen = document.getElementById('camera-screen');
const previewScreen = document.getElementById('preview-screen');
const filterScreen = document.getElementById('filter-screen');
const downloadScreen = document.getElementById('download-screen');

const takePhotoBtn = document.getElementById('take-photo-btn');
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const acceptBtn = document.getElementById('accept-btn');
const photoPreview = document.getElementById('photo-preview');
const filteredPhoto = document.getElementById('filtered-photo');
const filterLeft = document.getElementById('filter-left');
const filterRight = document.getElementById('filter-right');
const filterName = document.getElementById('filter-name');
const saveBtn = document.getElementById('save-btn');
const finalPhoto = document.getElementById('final-photo');
const downloadBtn = document.getElementById('download-btn');
const canvas = document.getElementById('canvas');

let stream = null;
let photoDataURL = '';
let filteredDataURL = '';
let currentFilterIndex = 0;

// Define filter options
const filters = [
  { name: 'Normal', css: 'none' },
  { name: 'Grayscale', css: 'grayscale(100%)' },
  { name: 'Sepia', css: 'sepia(100%)' },
  { name: 'Invert', css: 'invert(100%)' },
  { name: 'Blur', css: 'blur(2px)' },
  { name: 'Brightness', css: 'brightness(1.4)' },
  { name: 'Contrast', css: 'contrast(1.8)' },
  { name: 'Hue Rotate', css: 'hue-rotate(90deg)' }
];

// Helper: Show only the desired screen
function showScreen(screen) {
  [startScreen, cameraScreen, previewScreen, filterScreen, downloadScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

// Step 1: Start - "Take Photo"
takePhotoBtn.onclick = async () => {
  showScreen(cameraScreen);
  // Request camera access
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    alert('Camera access denied or unavailable.');
    showScreen(startScreen);
  }
};

// Step 2: Capture Photo
captureBtn.onclick = () => {
  // Draw video frame to canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  photoDataURL = canvas.toDataURL('image/png');
  photoPreview.src = photoDataURL;
  showScreen(previewScreen);
  // Stop camera stream
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
};

// Step 3: Retake or Accept
retakeBtn.onclick = () => {
  showScreen(cameraScreen);
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(s => {
      stream = s;
      video.srcObject = stream;
      video.play();
    }).catch(() => {
      alert('Unable to access camera.');
      showScreen(startScreen);
    });
};

acceptBtn.onclick = () => {
  // Move to filter selection
  currentFilterIndex = 0;
  updateFilter();
  showScreen(filterScreen);
};

// Step 4: Filter Selection
function updateFilter() {
  filteredPhoto.src = photoDataURL;
  filteredPhoto.style.filter = filters[currentFilterIndex].css;
  filterName.textContent = filters[currentFilterIndex].name;
}

filterLeft.onclick = () => {
  currentFilterIndex = (currentFilterIndex - 1 + filters.length) % filters.length;
  updateFilter();
};

filterRight.onclick = () => {
  currentFilterIndex = (currentFilterIndex + 1) % filters.length;
  updateFilter();
};

saveBtn.onclick = () => {
  // Draw the filtered image onto canvas to "bake in" the filter
  canvas.width = filteredPhoto.naturalWidth;
  canvas.height = filteredPhoto.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.filter = filters[currentFilterIndex].css;
  ctx.drawImage(filteredPhoto, 0, 0, canvas.width, canvas.height);
  filteredDataURL = canvas.toDataURL('image/png');
  finalPhoto.src = filteredDataURL;
  showScreen(downloadScreen);
};

// Step 5: Download
downloadBtn.onclick = () => {
  const a = document.createElement('a');
  a.href = filteredDataURL;
  a.download = 'my-photo.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Optionally reset to start
  showScreen(startScreen);
};

// On load, show start screen
showScreen(startScreen);
