function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId + '-section').classList.remove('hidden');
  }

  const taskStatus = {
    answer1: false,
    answer2: false,
    answer3: false,
    answer4: false
  };

  function checkAllTasksCompleted() {
    const allCorrect = Object.values(taskStatus).every(status => status === true);
    if (allCorrect) {
      toggleOverlay("scroll-overlay", true);
    }
  }
  
  function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.add('hidden'));

    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
  }

  window.addEventListener('load', () => showSection('navodila-section'));

  function toggleOverlay(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", !show);
  }

  document.querySelector(".izzivi-btn").addEventListener("click", () => {
    toggleOverlay("izziviOverlay", true);
  });

  // Закрытие по крестику – универсально для всех
  function closeOverlay(id) {
    toggleOverlay(id, false);
  }

  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function checkHashedAnswer(inputId, correctHash) {
    const input = document.getElementById(inputId).value;
    const feedback = document.getElementById("feedback-" + inputId);

    const inputHash = await sha256(input);
    
    if (inputHash === correctHash) {
      feedback.textContent = "✅ Pravilen odgovor :)";
      feedback.style.color = "#2e6e2f";
      taskStatus[inputId] = true;
      checkAllTasksCompleted();
    } else {
      feedback.textContent = "❌ Napačen odgovor. Poskusi znova.";
      feedback.style.color = "#6e2f2f";
      askStatus[inputId] = false;
    }
  }

  async function checkHashedRangeAnswer(inputId) {
    const input = document.getElementById(inputId).value.trim();
    const feedback = document.getElementById("feedback-" + inputId);
    const allowedHashes = [
      'ad723f42c7aba316d944f19f340ce47d8e0c6fb354d212736ec4782314a6824a', // 625
      '87acb1e183a2b0f74c3b2008b8ef6975a95269bc490a8886f317fa4bd714b085', // 626
      '9a35532c7499c19daeacafc961657409c7280ce59d7ae1a3606dd638ac3d99ec',  // 627
      '67c312330b0371a0a37c565cf44ef264835147fea61261bf57380f338efcd8c9', // 628
      '1ad269a743bd01b5bb74f135c332a4acc98ef1a570d966fcd6a801de6d9ae3bc',  // 629
      '21900f41ecb7b8e6cfd9250f096aad2fe7f6d8fbec9436b2d28e48c304ff8255',  // 630
      '7b81eb727ed48055fa55c5e03aaa43f27b01bd9b1c8eb38f37a1ca541a79c1f7',  // 631
      '3bcc1340d90b3d55accb9a57998b69708fea2a63c39f7369047469f952ccad4f',  // 632
      'b6b1b469ea43c90a602e7ae3bdea001b11f66c17337dec23df0b0249542357ee',  // 633
    ];

    const inputHash = await sha256(input);
    
    if (allowedHashes.includes(inputHash)) {
      feedback.textContent = "✅ Pravilen odgovor!";
      feedback.style.color = "#2e6e2f";
      taskStatus[inputId] = true;
      checkAllTasksCompleted();
    } else {
      feedback.textContent = "❌ Napačen odgovor. Poskusi znova.";
      feedback.style.color = "#6e2f2f";
      taskStatus[inputId] = false;
    }
  }


  function round(num, decimals = 5) {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
  }
  
  async function checkCoordsAnswer(inputId) {
    const input = document.getElementById(inputId).value.trim();
    const feedback = document.getElementById("feedback-" + inputId);
  
    const correctLat = 46.27;
    const correctLon = 15.30;
    const tolerance = 0.05;
  
    const cleaned = input.replace(/\s+/g, '');
    const parts = cleaned.split(/[;,]/);
  
    if (parts.length !== 2) {
      feedback.textContent = "❌ Napačen format. Vpiši npr. 56.47,23.31 ali 56.47;23.31";
      feedback.style.color = "#6e2f2f";
      return;
    }
  
    const lat = round(parseFloat(parts[0]));
    const lon = round(parseFloat(parts[1]));
  
    if (isNaN(lat) || isNaN(lon)) {
      feedback.textContent = "❌ Napačne številke. Poskusi znova.";
      feedback.style.color = "#6e2f2f";
      return;
    }
  
    const isLatValid = lat >= round(correctLat - tolerance) && lat <= round(correctLat + tolerance);
    const isLonValid = lon >= round(correctLon - tolerance) && lon <= round(correctLon + tolerance);
  
    if (isLatValid && isLonValid) {
      feedback.textContent = "✅ Pravilen odgovor!";
      feedback.style.color = "#2e6e2f";
      taskStatus[inputId] = true;
      checkAllTasksCompleted();
    } else {
      feedback.textContent = "❌ Napačen odgovor. Poskusi znova.";
      feedback.style.color = "#6e2f2f";
      taskStatus[inputId] = false;
    }
  }
  
  document.getElementById('check-solutions-btn').addEventListener('click', function () {
    const msg = document.getElementById('reseno-msg');
    const allCorrect = Object.values(taskStatus).every(status => status === true);
  
    if (allCorrect) {
      msg.classList.add('hidden');
      toggleOverlay("scroll-overlay", true);
    } else {
      msg.textContent = 'Vse naloge morajo biti pravilno rešene!';
      msg.classList.remove('hidden');
    }
  });
  
  