const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fake news patterns and keywords to check
const fakeNewsPatterns = [
  { pattern: /sudden|surprise|unexpected|shock|breaking|urgent/i, flag: "Sensationalist language", type: "red" },
  { pattern: /all students|all schools|all colleges|nationwide|country-wide/i, flag: "Overgeneralization", type: "red" },
  { pattern: /(free|100% scholarship|guaranteed admission)/i, flag: "Too-good-to-be-true promises", type: "red" },
  { pattern: /(WhatsApp|forward|share)/i, flag: "Referenced as forwarded content", type: "red" },
  { pattern: /(cancel|cancelled|cancellation|postpone|postponed|postponement)/i, flag: "Mentions cancellations or postponements", type: "red" },
  { pattern: /(CBSE|ICSE|UGC|AICTE|NCERT)/i, flag: "Mentions official educational bodies", type: "neutral" },
  { pattern: /(official website|press release|notification|circular)/i, flag: "References official sources", type: "green" },
  { pattern: /(exam|result|admission|form)/i, flag: "Related to key educational events", type: "neutral" }
];

// Education-related entities in India to help with analysis
const educationalEntities = [
  { name: "CBSE", fullName: "Central Board of Secondary Education", official: "cbse.gov.in" },
  { name: "UGC", fullName: "University Grants Commission", official: "ugc.ac.in" },
  { name: "AICTE", fullName: "All India Council for Technical Education", official: "aicte-india.org" },
  { name: "NCERT", fullName: "National Council of Educational Research and Training", official: "ncert.nic.in" },
  { name: "NTA", fullName: "National Testing Agency", official: "nta.ac.in" },
  { name: "ICSE", fullName: "Indian Certificate of Secondary Education", official: "cisce.org" }
];

// Common fake educational news themes
const fakeNewsThemes = [
  "Exam cancellations or postponements without official confirmation",
  "Changes to syllabus or evaluation criteria without proper notification",
  "Free education opportunities without proper verification",
  "Fake job opportunities or internships in prestigious institutions",
  "Dubious admission offers or scholarship schemes",
  "Misleading information about educational policies"
];

// Add a message to the chat box
function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'user-message' : 'bot-message';
  messageDiv.innerText = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Analyze the headline for potential fake news markers
function analyzeHeadline(headline) {
  let foundPatterns = [];
  let detectedEntities = [];
  let credibilityScore = 50; // Start with a neutral score

  // Check for patterns
  fakeNewsPatterns.forEach(pattern => {
    if (pattern.pattern.test(headline)) {
      foundPatterns.push({ flag: pattern.flag, type: pattern.type });

      // Adjust credibility score based on pattern type
      if (pattern.type === "red") credibilityScore -= 10;
      if (pattern.type === "green") credibilityScore += 10;
    }
  });

  // Check for educational entities
  educationalEntities.forEach(entity => {
    const entityRegex = new RegExp(entity.name, 'i');
    if (entityRegex.test(headline)) {
      detectedEntities.push(entity);
    }
  });

  // Analyze if the news seems fake based on common themes
  let matchingThemes = fakeNewsThemes.filter(theme => {
    const themeWords = theme.toLowerCase().split(' ');
    return themeWords.some(word => headline.toLowerCase().includes(word));
  });

  // Cap the credibility score between 0 and 100
  credibilityScore = Math.max(0, Math.min(100, credibilityScore));

  return {
    foundPatterns,
    detectedEntities,
    matchingThemes,
    credibilityScore
  };
}

// Generate a response based on analysis
function generateResponse(headline) {
  const analysis = analyzeHeadline(headline);

  let response = `I've analyzed the headline: "${headline}"\n\n`;

  // Add a summary based on credibility score
  if (analysis.credibilityScore < 30) {
    response += "⚠️ This headline shows strong signs of potential misinformation.\n\n";
  } else if (analysis.credibilityScore < 60) {
    response += "⚠️ This headline has some concerning elements that warrant verification.\n\n";
  } else {
    response += "✅ This headline appears to be potentially credible, though verification is still recommended.\n\n";
  }

  // Create analysis HTML
  let analysisHTML = `<div class="analysis-section">
            <div class="analysis-title">Headline Analysis:</div>`;

  // Add flags section
  if (analysis.foundPatterns.length > 0) {
    analysisHTML += `<p><strong>Identified patterns:</strong></p><ul>`;
    analysis.foundPatterns.forEach(pattern => {
      let flagClass = pattern.type === "red" ? "red-flag" :
        pattern.type === "green" ? "green-flag" : "";
      analysisHTML += `<li class="${flagClass}">${pattern.flag}</li>`;
    });
    analysisHTML += `</ul>`;
  }

  // Add entities section
  if (analysis.detectedEntities.length > 0) {
    analysisHTML += `<p><strong>Referenced educational bodies:</strong></p><ul>`;
    analysis.detectedEntities.forEach(entity => {
      analysisHTML += `<li>${entity.fullName} (${entity.name}) - Official website: ${entity.official}</li>`;
    });
    analysisHTML += `</ul>`;
  }

  // Add themes section if any were detected
  if (analysis.matchingThemes.length > 0) {
    analysisHTML += `<p><strong>Matches common fake news themes:</strong></p><ul>`;
    analysis.matchingThemes.forEach(theme => {
      analysisHTML += `<li>${theme}</li>`;
    });
    analysisHTML += `</ul>`;
  }

  // Add recommendations
  analysisHTML += `<p><strong>Recommendations:</strong></p>
            <ul>
                <li>Verify this information on the official website of the mentioned institution</li>
                <li>Look for official notifications or press releases</li>
                <li>Check if mainstream news outlets have reported this information</li>
                <li>Be cautious about sharing until verified</li>
            </ul>`;

  analysisHTML += `<p><strong>Credibility Score:</strong> ${analysis.credibilityScore}/100</p>`;
  analysisHTML += `</div>`;

  // Add the analysis HTML to the response
  const responseDiv = document.createElement('div');
  responseDiv.className = 'bot-message';
  responseDiv.innerHTML = response + analysisHTML;
  chatBox.appendChild(responseDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle user input
function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage === '') return;

  addMessage(userMessage, true);
  userInput.value = '';

  // Simulate thinking
  setTimeout(() => {
    generateResponse(userMessage);
  }, 1000);
}

// Event listeners
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});

// Example headlines for testing
const exampleHeadlines = [
  "CBSE announces surprise exam cancellation for all 10th standard students",
  "UGC declares all college students to get free laptops next month",
  "New education policy makes Sanskrit mandatory in all schools",
  "IIT entrance exam postponed indefinitely due to technical issues",
  "WhatsApp forward: Government to close all schools until further notice"
];
