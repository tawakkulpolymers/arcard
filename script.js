// Start camera as background
async function startCamera() {
  const video = document.getElementById("camera");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn("Camera API not supported.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // back camera
      audio: false,
    });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera access error:", err);
  }
}

startCamera();

// Tilt effect for AR feel
const card = document.getElementById("card");

function applyTilt(xPercent, yPercent) {
  const maxTilt = 10; // degrees
  const rotateX = (yPercent - 0.5) * -2 * maxTilt;
  const rotateY = (xPercent - 0.5) * 2 * maxTilt;

  card.style.transform =
    `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Mouse move (desktop)
window.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  applyTilt(x, y);
});

// Device motion (mobile)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    const gamma = event.gamma || 0; // left-right
    const beta = event.beta || 0;   // front-back

    const x = (gamma + 45) / 90; // normalize roughly -45..45
    const y = (beta - 30) / 60;  // normalize around portrait

    const xClamped = Math.min(Math.max(x, 0), 1);
    const yClamped = Math.min(Math.max(y, 0), 1);

    applyTilt(xClamped, yClamped);
  });
}
