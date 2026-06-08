// --- DOT CLICK LOGIC ---
const targetPoints = document.querySelectorAll('.target-point');

targetPoints.forEach(point => {
  const dot = point.querySelector('.pulse-dot');
  
  dot.addEventListener('click', (e) => {
    // 1. Close all other open labels first
    targetPoints.forEach(p => {
      if (p !== point) {
        p.classList.remove('active');
      }
    });
    
    // 2. Open (or close) the one that was clicked
    point.classList.toggle('active');
    
    // 3. Stop the click from registering anywhere else
    e.stopPropagation();
  });
});

// Click anywhere else on the screen to close all open labels
document.addEventListener('click', () => {
  targetPoints.forEach(p => p.classList.remove('active'));
});

// Prevent clicking inside the text/buttons from accidentally closing the label
document.querySelectorAll('.label-wrapper').forEach(label => {
  label.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// --- UPDATED QUIZ DATA (Multiple questions per part!) ---
const quizData = {
  "Skull": [
    { question: "How many fused bones make up the adult skull?", options: ["12", "22", "206", "8"], correctAnswer: "22" },
    { question: "What is the primary function of the skull?", options: ["Pumping blood", "Digesting food", "Protecting the brain", "Connecting to legs"], correctAnswer: "Protecting the brain" },
    { question: "Which is the ONLY movable bone in the skull?", options: ["Cranium", "Nasal Bone", "Mandible (Jaw)", "Cheekbone"], correctAnswer: "Mandible (Jaw)" }
  ],
  "Clavicle": [
    { question: "What is the common name for the Clavicle?", options: ["Shoulder blade", "Funny bone", "Collarbone", "Wishbone"], correctAnswer: "Collarbone" },
    { question: "True or False: The clavicle is rarely broken.", options: ["True", "False"], correctAnswer: "False" }
  ],
  "Ribcage": [
    { question: "How many total ribs do most humans have?", options: ["12", "24", "206", "10"], correctAnswer: "24" },
    { question: "What do we call the bottom two pairs of ribs?", options: ["Floating ribs", "Sinking ribs", "False ribs", "Hidden ribs"], correctAnswer: "Floating ribs" }
  ],
  "Humerus": [
    { question: "Where is the humerus located?", options: ["Lower leg", "Upper arm", "Forearm", "Spine"], correctAnswer: "Upper arm" },
    { question: "Hitting your 'funny bone' actually hits a nerve near which bone?", options: ["Radius", "Humerus", "Ulna", "Femur"], correctAnswer: "Humerus" }
  ],
  "Radius": [
    { question: "Which side of the arm is the Radius on?", options: ["Pinky-side", "Thumb-side", "Back of the hand", "It switches"], correctAnswer: "Thumb-side" },
    { question: "What happens to the radius and ulna when you flip your hand over?", options: ["They lock together", "They bend", "They cross over each other", "Nothing"], correctAnswer: "They cross over each other" }
  ],
  "Pelvis": [
    { question: "What shape best describes the pelvis?", options: ["Cylinder", "Basin-shaped", "Flat plate", "Sphere"], correctAnswer: "Basin-shaped" },
    { question: "What does the pelvis connect together?", options: ["Head and neck", "Arms and chest", "Spine and legs", "Ribs and sternum"], correctAnswer: "Spine and legs" }
  ],
  "Phalanges": [
    { question: "Where in the body do you have phalanges?", options: ["Hands only", "Feet only", "Hands AND Feet", "Spine"], correctAnswer: "Hands AND Feet" },
    { question: "How many phalanges are in your thumb?", options: ["1", "2", "3", "4"], correctAnswer: "2" }
  ],
  "Femur": [
    { question: "Which of these is true about the femur?", options: ["It is the smallest bone", "It is the longest, strongest bone", "It protects the heart", "It is easily broken"], correctAnswer: "It is the longest, strongest bone" },
    { question: "Roughly how much of your total height does the femur make up?", options: ["One-half", "One-third", "One-quarter", "One-tenth"], correctAnswer: "One-quarter" }
  ],
  "Patella": [
    { question: "What is the common name for the Patella?", options: ["Kneecap", "Shinbone", "Ankle", "Elbow"], correctAnswer: "Kneecap" },
    { question: "Babies are born without a bony patella. What is it made of at first?", options: ["Muscle", "Tendon", "Cartilage", "Skin"], correctAnswer: "Cartilage" }
  ],
  "Tibia": [
    { question: "Which bone in the lower leg bears most of your weight?", options: ["Fibula", "Tibia", "Femur", "Patella"], correctAnswer: "Tibia" },
    { question: "What is the everyday name for the Tibia?", options: ["Calf bone", "Thigh bone", "Shinbone", "Heel bone"], correctAnswer: "Shinbone" }
  ]
};

// --- HTML ELEMENTS ---
const quizModal = document.getElementById('quiz-modal');
const drawingModal = document.getElementById('drawing-modal');
const quizQuestion = document.getElementById('quiz-question');
const quizOptionsGrid = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const challengeTitle = document.getElementById('challenge-title');
const canvas = document.getElementById('art-canvas');
const ctx = canvas.getContext('2d');

// --- NEW VARIABLES TO TRACK QUIZ PROGRESS ---
let currentActivePart = "";
let currentQuestionIndex = 0; 

// --- EVENT LISTENERS FOR BUTTONS ---
document.querySelectorAll('.start-quiz-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const part = e.target.getAttribute('data-part');
    openQuiz(part);
  });
});

// --- QUIZ LOGIC ---
function openQuiz(part) {
  currentActivePart = part;
  currentQuestionIndex = 0; // Reset back to question 1
  loadQuestion(); // Call the new function to build the screen
  quizModal.classList.remove('hidden');
}

function loadQuestion() {
  const dataList = quizData[currentActivePart];
  const currentQ = dataList[currentQuestionIndex];
  
  // Updates the title to show progress (e.g. "Skull Quiz (1 of 3)")
  document.getElementById('quiz-title').innerText = `${currentActivePart} Quiz (${currentQuestionIndex + 1} of ${dataList.length})`;
  
  quizQuestion.innerText = currentQ.question;
  quizFeedback.innerText = ""; 
  quizFeedback.style.color = "#ff4757"; // Resets text color to red
  quizOptionsGrid.innerHTML = ""; 

  // Create buttons for answers
  currentQ.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerText = option;
    btn.addEventListener('click', () => checkAnswer(option, currentQ.correctAnswer));
    quizOptionsGrid.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const dataList = quizData[currentActivePart];

  if (selected === correct) {
    currentQuestionIndex++; // Move to the next question in line!

    if (currentQuestionIndex < dataList.length) {
      // If there are still questions left, show a success message and load the next one
      quizFeedback.style.color = "#00b894"; // Green!
      quizFeedback.innerText = "Correct! Next question...";
      
      // A quick 0.8-second delay so they see they got it right before the screen changes
      setTimeout(() => {
        loadQuestion();
      }, 800);
      
    } else {
      // They finished ALL questions! Unlock the canvas.
      quizModal.classList.add('hidden');
      challengeTitle.innerText = `Masterpiece Time: Draw the ${currentActivePart}!`;
      drawingModal.classList.remove('hidden');
      clearCanvas();
      
      // Close the label on the main map
      targetPoints.forEach(p => p.classList.remove('active'));
    }

  } else {
    // Got it wrong
    quizFeedback.style.color = "#ff4757";
    quizFeedback.innerText = "Incorrect! Try again.";
  }
}

// Close Buttons
document.getElementById('close-quiz-btn').addEventListener('click', () => {
  quizModal.classList.add('hidden');
});

// --- DRAWING LOGIC ---
document.getElementById('clear-btn').addEventListener('click', clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#2d3436';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

// --- NEW SELF-GRADE LOGIC ---
const drawingControls = document.getElementById('drawing-controls');
const selfGradeBox = document.getElementById('self-grade-box');
const passBtn = document.getElementById('pass-btn');
const retryBtn = document.getElementById('retry-btn');

document.getElementById('close-draw-btn').addEventListener('click', () => {
  drawingControls.classList.add('hidden');
  selfGradeBox.classList.remove('hidden');
});

retryBtn.addEventListener('click', () => {
  clearCanvas();
  selfGradeBox.classList.add('hidden');
  drawingControls.classList.remove('hidden');
});

passBtn.addEventListener('click', () => {
  drawingModal.classList.add('hidden');
  selfGradeBox.classList.add('hidden');
  drawingControls.classList.remove('hidden');
});
