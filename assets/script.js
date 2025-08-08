// Global Variables
let currentSlideIndex = 0;
let currentTrack = 0;
let isPlaying = false;
let gameTimer;
let gameStartTime;
let moveCount = 0;
let currentDifficulty = 'easy';
let puzzlePieces = [];
let countdownInterval;
let targetBirthday = null;

// Audio tracks (using placeholder URLs - in real implementation, you'd have actual audio files)
// In your script.js file
const audioTracks = [
    {
        title: "Khoobsurat ",
        artist: "Birthday Collection",
        duration: "3:56",
        src: "assets/audio/Khoobsurat.mp3"  // Update this path
    },
    {
        title: "Happy Birthday Song",
        artist: "Party Hits",
        duration: "3:15",
        src: "audio/23.mp3"  // Update this path
    },
    {
        title: "Party Anthem",
        artist: "Birthday Beats",
        duration: "2:45",
        src: "audio/24.mp3"  // Update this path
    }
];

// Gallery images for puzzle
const puzzleImages = [
    "assets/img/game-1.jpeg",
    "assets/img/game-2.jpeg",
    "assets/img/game-3.jpeg"
];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const vinylRecord = document.getElementById('vinylRecord');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBackgroundAnimations();
    initializeGallery();
    initializeMusicPlayer();
    initializePuzzleGame();
    initializeCountdown();
    initializeEventListeners();
    
    // Set initial birthday date to next year
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    nextYear.setMonth(0, 1); // January 1st
    document.getElementById('birthdayDate').value = nextYear.toISOString().slice(0, 16);
});

// Initialize event listeners
function initializeEventListeners() {
    // Celebrate button
    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', celebrateNow);
    }
    
    // Gallery controls
    const gridViewBtn = document.getElementById('gridViewBtn');
    const slideshowViewBtn = document.getElementById('slideshowViewBtn');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => changeView('grid'));
    }
    
    if (slideshowViewBtn) {
        slideshowViewBtn.addEventListener('click', () => changeView('slideshow'));
    }
    
    // Slideshow controls
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    
    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => changeSlide(-1));
    }
    
    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => changeSlide(1));
    }
    
    // Music player controls
    const audio = document.getElementById("audioPlayer");
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");

    let currentTrackIndex = 0;

    function loadTrack(index) {
        const track = audioTracks[index];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
    }

    loadTrack(currentTrackIndex);

    document.getElementById("playPauseBtn").addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            document.getElementById("playPauseBtn").textContent = "⏸️";
        } else {
            audio.pause();
            document.getElementById("playPauseBtn").textContent = "▶️";
        }
    });

    // Playlist items
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => selectTrack(index));
    });
    
    // Game controls
    const difficultySelect = document.getElementById('difficultySelect');
    const newGameBtn = document.getElementById('newGameBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', changeDifficulty);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
    
    if (showSolutionBtn) {
        showSolutionBtn.addEventListener('click', showSolution);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', startNewGame);
    }
    
    // Birthday date input
    const birthdayInput = document.getElementById('birthdayDate');
    if (birthdayInput) {
        birthdayInput.addEventListener('change', updateCountdown);
    }
    
    // Slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => jumpToSlide(index));
    });
}

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Background Animation Functions
function initializeBackgroundAnimations() {
    createConfetti();
    createParticles();
    
    // Regenerate confetti every 10 seconds
    setInterval(createConfetti, 10000);
    
    // Regenerate particles every 15 seconds
    setInterval(createParticles, 15000);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing confetti
    
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing particles
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(particle);
    }
}

// Celebration function
function celebrateNow() {
    // Trigger confetti explosion
    triggerConfettiExplosion();
    
    // Play celebration sound (if available)
    if (audioPlayer && !audioPlayer.src) {
        // If no audio is loaded, just show visual effects
        showCelebrationMessage();
    } else {
        togglePlay();
    }
    
    // Scroll to gallery section
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const offsetTop = gallerySection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function triggerConfettiExplosion() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    
    // Create burst of confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function showCelebrationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 2000;
        animation: celebrationPop 0.5s ease-out;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    `;
    message.innerHTML = '🎉 Let the celebration begin! 🎉';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Gallery Functions
function initializeGallery() {
    // Add intersection observer for gallery animations
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function changeView(viewType) {
    const gridView = document.getElementById('galleryGrid');
    const slideshowView = document.getElementById('gallerySlideshow');
    
    if (!gridView || !slideshowView) return;
    
    if (viewType === 'grid') {
        gridView.style.display = 'grid';
        slideshowView.style.display = 'none';
    } else if (viewType === 'slideshow') {
        gridView.style.display = 'none';
        slideshowView.style.display = 'block';
        startSlideshow();
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function jumpToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = slideIndex;
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function startSlideshow() {
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 75000);
}

// Music Player Functions
function initializeMusicPlayer() {
    // Since we don't have actual audio files, we'll simulate the player
    updateTrackDisplay();
    
    // Simulate audio loading
    if (durationDisplay) {
        durationDisplay.textContent = audioTracks[currentTrack].duration;
    }
    
    // Progress bar click
    const progressContainer = document.querySelector('.progress-bar');
    if (progressContainer) {
        progressContainer.addEventListener('click', seek);
    }
    
    // Simulate time updates
    setInterval(updateProgressBar, 1000);
}

function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        if (vinylRecord) vinylRecord.classList.add('playing');
        
        // In a real implementation, you would start the audio
        // audioPlayer.play();
    } else {
        if (playPauseBtn) playPauseBtn.textContent = '▶️';
        if (vinylRecord) vinylRecord.classList.remove('playing');
        
        // In a real implementation, you would pause the audio
        // audioPlayer.pause();
    }
}

function previousTrack() {
    currentTrack = currentTrack > 0 ? currentTrack - 1 : audioTracks.length - 1;
    switchTrack();
}

function nextTrack() {
    currentTrack = currentTrack < audioTracks.length - 1 ? currentTrack + 1 : 0;
    switchTrack();
}

function selectTrack(trackIndex) {
    // Remove active class from all playlist items
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected track
    if (playlistItems[trackIndex]) {
        playlistItems[trackIndex].classList.add('active');
    }
    
    currentTrack = trackIndex;
    switchTrack();
}

function switchTrack() {
    updateTrackDisplay();
    
    // Reset progress
    if (progressBar) progressBar.style.width = '0%';
    if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
    if (durationDisplay) durationDisplay.textContent = audioTracks[currentTrack].duration;
    
    // Update playlist active state
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
    
    // If playing, continue playing new track
    if (isPlaying) {
        // In real implementation: audioPlayer.src = audioTracks[currentTrack].src;
        // audioPlayer.play();
    }
}

function updateTrackDisplay() {
    const track = audioTracks[currentTrack];
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
}

function changeVolume() {
    if (!volumeSlider) return;
    const volume = volumeSlider.value / 100;
    // In real implementation: audioPlayer.volume = volume;
}

function seek(e) {
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    // In real implementation, you would seek the audio:
    // const duration = audioPlayer.duration;
    // audioPlayer.currentTime = (percentage / 100) * duration;
}

function updateProgressBar() {
    if (isPlaying && progressBar) {
        // Simulate progress (in real implementation, use audioPlayer.currentTime)
        let currentWidth = parseFloat(progressBar.style.width) || 0;
        currentWidth += 0.5; // Simulate progress
        
        if (currentWidth >= 100) {
            currentWidth = 0;
            nextTrack(); // Auto-advance to next track
        }
        
        progressBar.style.width = currentWidth + '%';
        
        // Update time display (simulated)
        if (currentTimeDisplay) {
            const minutes = Math.floor(currentWidth * 0.03); // Rough simulation
            const seconds = Math.floor((currentWidth * 1.8) % 60);
            currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Puzzle Game Functions
function initializePuzzleGame() {
    changeDifficulty();
    startNewGame();
}

function changeDifficulty() {
    const select = document.getElementById('difficultySelect');
    if (!select) return;
    
    currentDifficulty = select.value;
    
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    let gridSize;
    
    switch (currentDifficulty) {
        case 'easy':
            gridSize = 3;
            break;
        case 'medium':
            gridSize = 4;
            break;
        case 'hard':
            gridSize = 5;
            break;
    }
    
    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    puzzleBoard.style.width = '300px';
    puzzleBoard.style.height = '300px';
}

function startNewGame() {
    clearInterval(gameTimer);
    gameStartTime = Date.now();
    moveCount = 0;
    updateGameStats();
    
    generatePuzzle();
    shufflePuzzle();
    startGameTimer();
    
    // Hide completion screen
    const gameCompletion = document.getElementById('gameCompletion');
    if (gameCompletion) {
        gameCompletion.style.display = 'none';
    }
}

function generatePuzzle() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    const gridSize = currentDifficulty === 'easy' ? 3 : currentDifficulty === 'medium' ? 4 : 5;
    const totalPieces = gridSize * gridSize;
    
    puzzleBoard.innerHTML = '';
    puzzlePieces = [];
    
    // Use random image from puzzle images
    const imageUrl = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    const solutionImage = document.getElementById('solutionImage');
    if (solutionImage) {
        solutionImage.src = imageUrl;
    }
    
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = i;
        piece.dataset.correctPosition = i;
        
        // Calculate background position
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const bgPosX = (col / (gridSize - 1)) * 100;
        const bgPosY = (row / (gridSize - 1)) * 100;
        
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        piece.style.backgroundSize = `${gridSize * 100}%`;
        
        // Add drag and drop events
        piece.draggable = true;
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);
        
        puzzleBoard.appendChild(piece);
        puzzlePieces.push(piece);
    }
}

function shufflePuzzle() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    const pieces = Array.from(puzzlePieces);
    
    // Fisher-Yates shuffle
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    // Update positions
    pieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement && e.target !== draggedElement && e.target.classList.contains('puzzle-piece')) {
        // Swap positions
        const draggedPosition = draggedElement.dataset.position;
        const targetPosition = e.target.dataset.position;
        
        draggedElement.dataset.position = targetPosition;
        e.target.dataset.position = draggedPosition;
        
        // Swap DOM positions
        const parent = draggedElement.parentNode;
        const nextSibling = draggedElement.nextSibling === e.target ? draggedElement : draggedElement.nextSibling;
        
        parent.insertBefore(draggedElement, e.target.nextSibling);
        parent.insertBefore(e.target, nextSibling);
        
        moveCount++;
        updateGameStats();
        checkPuzzleCompletion();
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function checkPuzzleCompletion() {
    const isComplete = puzzlePieces.every(piece => 
        piece.dataset.position === piece.dataset.correctPosition
    );
    
    if (isComplete) {
        clearInterval(gameTimer);
        showCompletionMessage();
        triggerConfettiExplosion();
    }
}

function showCompletionMessage() {
    const completionDiv = document.getElementById('gameCompletion');
    const finalTime = document.getElementById('finalTime');
    const finalMoves = document.getElementById('finalMoves');
    
    if (!completionDiv || !finalTime || !finalMoves) return;
    
    const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    finalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    finalMoves.textContent = moveCount;
    
    completionDiv.style.display = 'flex';
}

function showSolution() {
    // Sort pieces to correct positions
    puzzlePieces.sort((a, b) => a.dataset.correctPosition - b.dataset.correctPosition);
    
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    puzzlePieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
    
    checkPuzzleCompletion();
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const gameTimerElement = document.getElementById('gameTimer');
        if (gameTimerElement) {
            gameTimerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function updateGameStats() {
    const moveCounter = document.getElementById('moveCounter');
    if (moveCounter) {
        moveCounter.textContent = moveCount;
    }
}

// Globals
    // let countdownInterval = null;
    // let targetBirthday = null;

    // Helper: pad
    function pad(n) { return String(n).padStart(2, '0'); }

    // Helper: format a JS Date into local YYYY-MM-DDTHH:MM for datetime-local
    function toLocalInputValue(date){
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    }

    function initializeCountdown(){
      // Default: 9 August 2025 at 00:00 local time
      const defaultDate = new Date(2025, 7, 9, 0, 0, 0); // month 7 = Aug
      const birthdayInput = document.getElementById('birthdayDate');
      if (birthdayInput) {
        birthdayInput.value = toLocalInputValue(defaultDate);
        birthdayInput.addEventListener('change', updateCountdown);
      }
      updateCountdown();
    }

    function updateCountdown(){
      const birthdayInput = document.getElementById('birthdayDate');
      const msg = document.getElementById('countdownMessage');
      if (!birthdayInput) return;

      if (!birthdayInput.value) {
        if (msg) msg.innerHTML = '<p>Set your birthday date to start the countdown!</p>';
        return;
      }

      // Parse as local time (datetime-local gives local)
      const selected = new Date(birthdayInput.value);
      if (isNaN(selected.getTime())) {
        if (msg) msg.innerHTML = '<p>Invalid date — pick a supported value.</p>';
        return;
      }

      targetBirthday = selected;

      // Clear any previous interval
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }

      // Start ticking
      calculateTimeRemaining();
      countdownInterval = setInterval(calculateTimeRemaining, 1000);
    }

    function calculateTimeRemaining(){
      if (!targetBirthday) return;
      const now = Date.now();
      const birthdayTime = targetBirthday.getTime();
      let timeDiff = birthdayTime - now;

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');
      const messageDiv = document.getElementById('countdownMessage');

      if (timeDiff <= 0) {
        // Arrived
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        if (messageDiv) {
          messageDiv.innerHTML = '<p class="birthday-celebration">🎉 Happy Birthday! It\'s time to celebrate! 🎂</p>';
          messageDiv.classList.add('birthday-celebration');
        }

        // Guard if confetti function is missing
        if (typeof triggerConfettiExplosion === 'function') {
          try { triggerConfettiExplosion(); } catch(e){ console.warn(e); }
        }

        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      timeDiff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      timeDiff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(timeDiff / (1000 * 60));
      timeDiff -= minutes * (1000 * 60);
      const seconds = Math.floor(timeDiff / 1000);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);

      if (messageDiv) {
        messageDiv.classList.remove('birthday-celebration');
        if (days > 1) {
          messageDiv.innerHTML = `<p>🎂 ${days} days until your special day!</p>`;
        } else if (days === 1) {
          messageDiv.innerHTML = '<p>🎉 Tomorrow is the big day!</p>';
        } else if (hours > 1) {
          messageDiv.innerHTML = `<p>⏰ Just ${hours} hours to go!</p>`;
        } else if (minutes > 1) {
          messageDiv.innerHTML = `<p>⏱️ Only ${minutes} minutes left!</p>`;
        } else {
          messageDiv.innerHTML = `<p>⚡ ${seconds} seconds until birthday time!</p>`;
        }
      }
    }

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', initializeCountdown);

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Gallery slideshow keyboard controls
    const slideshowView = document.getElementById('gallerySlideshow');
    if (slideshowView && slideshowView.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
    
    // Music player keyboard controls
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
    }
    
    // Puzzle game keyboard controls
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        startNewGame();
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Adjust gallery layout on resize
    if (window.innerWidth <= 768) {
        // Mobile layout adjustments
        changeView('grid');
    }
});

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause music when page is hidden
        if (isPlaying) {
            togglePlay();
        }
    }
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/300x200/ff6b9d/ffffff?text=Birthday+Image';
    });
});

// Touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Only handle swipes in gallery slideshow
        const slideshowView = document.getElementById('gallerySlideshow');
        if (slideshowView && slideshowView.style.display !== 'none') {
            if (diff > 0) {
                changeSlide(1); // Swipe left - next slide
            } else {
                changeSlide(-1); // Swipe right - previous slide
            }
        }
    }
}

// tap to top scrolling
const scrollBtn = document.getElementById("scroll");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


//   3d images
class Carousel3dAuto extends HTMLElement {
    constructor() {
        super();
        const frameWidth = this.getAttribute("data-width") || 150;
        const frameHeight = this.getAttribute("data-height") || 250;
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
                .overlay {
                    position: fixed;
                    display: grid;
                    place-items: center;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,.6);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease-in-out;

                    &.open {
                        opacity: 1;
                        pointer-events: auto;
                    }
                }
                .overlay > * {
                    position: absolute;
                    width: 70%;
                    height: 70%;
                    border-radius: 9px;
                    opacity: 0;
                    object-fit: cover;

                    &.open {
                        opacity: 1;
                    }
                }
                .carousel-container{
                    display: grid;
                    place-items: center;
                    width: 100%;
                    height: 100%;
                    perspective: 1000px;
                    perspective-origin: 50% 30%;
                    overflow: hidden;
                    // background-color: black;
                }
                .floor {
                    position: absolute;
                    width: 400%;
                    height: 400%;
                    // background-image: 
                    //     radial-gradient(transparent, black 75%),
                    //     repeating-conic-gradient(from 45deg, #111 0deg 90deg, #222 90deg 180deg);
                    background-size: 100%, 100px 100px;
                    transform: translateY(${(frameHeight / 2) + 20}px) rotateX(90deg);
                }
                .frame-container {
                    position: absolute;
                    width: ${frameWidth}px;
                    height: ${frameHeight}px;
                    transform-style: preserve-3d;
                }
                .shadow-container, .shadow-wrap {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }
                .shadow-wrap {
                    transform: translateY(calc(50% + 20px));
                }
                .shadow {
                    transform: rotateX(-90deg) translateY(-${frameHeight / 2}px);
                    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,.7), transparent 70%);
                    mask-image: linear-gradient(to top, rgba(0,0,0,.7), transparent 70%);
                }
                ::slotted(*), .shadow {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    background-color: lightblue;
                    transition: opacity 0.5s;
                }
                ::slotted(*) {
                    cursor: pointer;
                }
            </style>
            <div class="carousel-container">
                <div class="floor"></div>
                <div class="frame-container">
                    <slot></slot>
                    <div class="shadow-container"></div>
                </div>
                <div class="primary-window"></div>
            </div>
            <div class="overlay">
            </div>
        `;
        this.frames = [];
        this.currentAngle = 0;
        this.increment = 0;
        this.frameWidth = frameWidth;
        this.midX;
        this.midY;
        this.increment = .5;
        this.overlay = this.shadowRoot.querySelector(".overlay");
        this.carouselContainer = this.shadowRoot.querySelector(".carousel-container");
        this.primaryWindow = this.shadowRoot.querySelector(".primary-window");
        this.frameContainer = this.shadowRoot.querySelector(".frame-container");
        this.shadowContainer = this.shadowRoot.querySelector(".shadow-container");
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            const frames = this.children;
            const radius = (this.frameWidth * frames.length) / (1.2 * 3.2);
    
            this.primaryWindow.style.translate = `0 0 ${radius}px`;
            for (let i = 0; i < frames.length; i++) {
                const frame = frames[i];
                const fullFrame = frame.cloneNode(true);
                const shadow = frame.cloneNode(true);
                shadow.classList.add("shadow");

                this.frames.push(frame)
                frame.style.transformOrigin = `50% 50% ${-radius}px`;
                frame.style.translate = `0 0 ${radius}px`;
                frame.initialRotation = 360 / frames.length * i;
                frame.rotation = this.initialRotation;
                frame.style.rotate = `y ${frame.initialRotation}deg`;
                
                frame.addEventListener("click", () => {
                    this.overlay.classList.add("open");
                    fullFrame.classList.add("open");
                    this.increment = 0;
                });
                this.overlay.addEventListener("click", (event) => {
                    if (event.target !== this.overlay) return;
                    this.overlay.classList.remove("open");
                    fullFrame.classList.remove("open");
                });

                const shadowWrap = document.createElement("div");
                shadowWrap.classList.add("shadow-wrap");
                shadowWrap.style.transformOrigin = `50% 50% ${-radius}px`;
                shadowWrap.style.translate = `0 0 ${radius}px`;
                shadowWrap.style.rotate = `y ${360 / frames.length * i}deg`;
                shadowWrap.appendChild(shadow);
                this.shadowContainer.appendChild(shadowWrap);
                this.overlay.appendChild(fullFrame);
            }
            this.midX = this.clientWidth / 2;
            this.midY = this.clientHeight / 2;
            
            this.rotateCarousel();
        });

        this.carouselContainer.addEventListener("mousemove", (event) => {
            this.carouselContainer.style.removeProperty("transition");
            const containerRect = this.getBoundingClientRect();
            const mouseY = event.clientY - containerRect.top;
            const percentY = (mouseY - this.midY) / this.midY * 30 + 30;
            this.carouselContainer.style.perspectiveOrigin = `50% ${percentY}%`;

            const mouseX = event.clientX - containerRect.left;
            if (mouseX > (this.midX - 25) && mouseX < (this.midX + 25)) {
                this.increment = 0;
            } else {
                const percentX = (mouseX - this.midX) / this.midX;
                this.increment = 360 / (150 / percentX);
            }
        });
        this.carouselContainer.addEventListener("mouseout", () => {
            this.carouselContainer.style.perspectiveOrigin = "50% 30%"
            this.carouselContainer.style.transition = "perspective-origin .5s ease-in-out";
        });

        window.addEventListener("resize", () => {
            this.midX = this.clientWidth / 2;
            this.midY = this.clientHeight / 2;
        });
    }

    rotateCarousel() {
        if (this.currentAngle % 360 > -Math.abs(this.increment) && this.currentAngle % 360 < Math.abs(this.increment)) {
            this.currentAngle = 0;
            this.frames.forEach(frame => frame.rotation = frame.initialRotation);
        }
        this.frames.forEach(frame => {
            frame.rotation += this.increment
            this.applyOpacity(frame);
        });
        this.currentAngle += this.increment;
        this.frameContainer.style.transform = `rotateY(${this.currentAngle}deg)`;
        requestAnimationFrame(() => this.rotateCarousel());
    }
    applyOpacity(frame) {
        const rotation = frame.rotation % 360;
        
        if ((rotation >= 0 && rotation <= 45) || (rotation <= 360 && rotation >= 315) || (rotation >= -360 && rotation <= -315) || (rotation <= 0 && rotation >= -45)) {
            frame.style.opacity = "1";
        } else if ((rotation > 45 && rotation <= 90) || (rotation < 315 && rotation >= 270) || (rotation < -315 && rotation >= -270) || (rotation < -45 && rotation >= -90)) {
            frame.style.opacity = "0.8";
        } else if ((rotation > 90 && rotation <= 135) || (rotation < 270 && rotation >= 225) || (rotation < -270 && rotation >= -255) || (rotation < -90 && rotation >= -135)) {
            frame.style.opacity = "0.6";
        } else {
            frame.style.opacity = "0.4";
        }
    }
}
customElements.define("carousel-3d-auto", Carousel3dAuto);