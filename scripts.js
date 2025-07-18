
const sentences = [
    "Attendance Device",
    "Payroll Software",
    "AI Recognition",
    "Face Device",
    "Gateway",
    "Attendance Software",
    "Cloud-Based Attendance",
    "Smart Office Solutions",
    "Real-Time Data Sync",
    "Biometric Verification",
    "Secure Access Control",
    "Contactless Attendance",
    "HR & Payroll Automation",
    "Mobile Attendance Tracking",
    "Live Notifications & Alerts",
    "Fingerprint & Face Recognition",
    "Time Tracking Simplified",
    "Seamless API Integration",
  ];
  

  const typedSpan = document.getElementById("typed-sentence");
  let sentenceIndex = 0;
  let charIndex = 0;
  let typingSpeed = 100;
  let erasingSpeed = 50;
  let delayBetween = 1500;

  function type() {
    if (charIndex < sentences[sentenceIndex].length) {
      typedSpan.textContent += sentences[sentenceIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, delayBetween);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedSpan.textContent = sentences[sentenceIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      sentenceIndex = (sentenceIndex + 1) % sentences.length;
      setTimeout(type, 500);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 500);
  });

