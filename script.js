const DEFAULT_DISCIPLINE = "COMPUTER SCIENCE AND ENGINEERING";
const MANIFESTO_TITLE = "MANIFESTO FOR THE POST OF GENERAL SECRETARY";
const MISSION_QUOTE = '"Leadership is not about being in charge. It is about taking care of those in your charge"';
const AGENDA_TARGET_COUNT = 10;
const TITLE_OPTIONS = [
  "MANIFESTO FOR THE POST OF GENERAL SECRETARY",
  "GENERAL SECRETARY ELECTION MANIFESTO",
  "MANIFESTO FOR GENERAL SECRETARY",
  "VISION DOCUMENT FOR GENERAL SECRETARY",
  "GENERAL SECRETARY STUDENT MANIFESTO"
];
const MISSION_HEADING_OPTIONS = [
  "MISSION STATEMENT",
  "MISSION AND COMMITMENT",
  "OUR MISSION",
  "CORE MISSION",
  "MISSION"
];
const AGENDAS_HEADING_OPTIONS = [
  "AGENDAS",
  "AGENDA",
  "PRIORITY AGENDAS",
  "ACTION AGENDAS",
  "KEY AGENDAS"
];
const CREDENTIALS_HEADING_OPTIONS = [
  "CREDENTIALS",
  "EXPERIENCE AND CREDENTIALS",
  "PRIOR EXPERIENCE",
  "BACKGROUND AND EXPERIENCE",
  "CREDENTIALS AND TRACK RECORD"
];
const DEFAULT_TAGLINES = [
  "Empowering Voices, Enabling Change",
  "Built on Transparency and Trust",
  "Your Campus, Your Vision",
  "Think Forward, Act Now",
  "Where Students Shape the System",
  "Progress Through Participation"
];

const FONT_OPTIONS = [
  "Garamond, Georgia, serif",
  "Cambria, Georgia, serif",
  "Palatino Linotype, Book Antiqua, serif",
  "Trebuchet MS, Verdana, sans-serif",
  "Segoe UI, Tahoma, sans-serif",
  "Century Schoolbook, Times New Roman, serif",
  "Constantia, Cambria, serif",
  "Bookman Old Style, Georgia, serif",
  "Verdana, Geneva, sans-serif",
  "Gill Sans, Trebuchet MS, sans-serif",
  "Palatino, Book Antiqua, serif",
  "Times New Roman, Georgia, serif",
  "Tahoma, Segoe UI, sans-serif",
  "Candara, Calibri, sans-serif",
  "Century Gothic, Trebuchet MS, sans-serif",
  "Arial, Helvetica, sans-serif",
  "Corbel, Segoe UI, sans-serif",
  "Lucida Bright, Georgia, serif",
  "Franklin Gothic Medium, Arial, sans-serif",
  "Perpetua, Times New Roman, serif",
  "Calibri, Candara, sans-serif",
  "Georgia, Cambria, serif",
  "Book Antiqua, Palatino, serif",
  "Baskerville, Palatino Linotype, serif"
];

const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"];
const PHOTO_ALIGN_OPTIONS = ["left", "center", "right"];
const BORDER_STYLE_OPTIONS = ["solid", "double", "dashed", "dotted", "groove", "ridge"];
const BORDER_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6];
const RADIUS_OPTIONS = [0, 4, 8, 12, 16, 20, 24];

const candidateNameInput = document.getElementById("candidateName");
const disciplineInput = document.getElementById("discipline");
const priorExperienceInput = document.getElementById("priorExperience");
const candidatePhotoInput = document.getElementById("candidatePhoto");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const printBtn = document.getElementById("printBtn");
const pdfBtn = document.getElementById("pdfBtn");
const fontSizeSlider = document.getElementById("fontSizeSlider");
const headingScaleSlider = document.getElementById("headingScaleSlider");
const lineHeightSlider = document.getElementById("lineHeightSlider");
const borderWidthSlider = document.getElementById("borderWidthSlider");
const radiusSlider = document.getElementById("radiusSlider");
const photoScaleSlider = document.getElementById("photoScaleSlider");
const textAlignSlider = document.getElementById("textAlignSlider");
const photoAlignSlider = document.getElementById("photoAlignSlider");
const fontFamilySlider = document.getElementById("fontFamilySlider");
const borderStyleSlider = document.getElementById("borderStyleSlider");
const paddingSlider = document.getElementById("paddingSlider");
const letterSpacingSlider = document.getElementById("letterSpacingSlider");
const saturationSlider = document.getElementById("saturationSlider");
const contrastSlider = document.getElementById("contrastSlider");
const brightnessSlider = document.getElementById("brightnessSlider");
const fontSizeValue = document.getElementById("fontSizeValue");
const headingScaleValue = document.getElementById("headingScaleValue");
const lineHeightValue = document.getElementById("lineHeightValue");
const borderWidthValue = document.getElementById("borderWidthValue");
const radiusValue = document.getElementById("radiusValue");
const photoScaleValue = document.getElementById("photoScaleValue");
const textAlignValue = document.getElementById("textAlignValue");
const photoAlignValue = document.getElementById("photoAlignValue");
const fontFamilyValue = document.getElementById("fontFamilyValue");
const borderStyleValue = document.getElementById("borderStyleValue");
const paddingValue = document.getElementById("paddingValue");
const letterSpacingValue = document.getElementById("letterSpacingValue");
const saturationValue = document.getElementById("saturationValue");
const contrastValue = document.getElementById("contrastValue");
const brightnessValue = document.getElementById("brightnessValue");
const manifestoOutput = document.getElementById("manifestoOutput");
const statusEl = document.getElementById("status");

let agendaPool = [];
let taglinePool = [];
let selectedPhotoDataUrl = "";

function clampIndex(value, listLength) {
  return Math.min(Math.max(Number(value), 0), listLength - 1);
}

async function init() {
  try {
    const [agendasResponse, taglinesResponse] = await Promise.all([
      fetch("agendas.txt"),
      fetch("taglines.txt")
    ]);

    const agendasText = await agendasResponse.text();
    agendaPool = parseAgendaPool(agendasText);
    if (!agendaPool.length) {
      throw new Error("No agendas parsed from agendas.txt");
    }

    const taglinesText = await taglinesResponse.text();
    taglinePool = parseTaglinePool(taglinesText);
    if (!taglinePool.length) {
      taglinePool = [...DEFAULT_TAGLINES];
    }

    statusEl.textContent = `Loaded ${agendaPool.length} agendas and ${taglinePool.length} taglines.`;
  } catch (error) {
    agendaPool = buildFallbackPool();
    taglinePool = [...DEFAULT_TAGLINES];
    statusEl.textContent = "Could not fully load source files. Using fallback agendas and taglines.";
  }

  generateManifesto();
}

function parseTaglinePool(text) {
  const results = [];
  const regex = /"([^"]+)"/g;
  let match = regex.exec(text);

  while (match) {
    const cleaned = match[1].trim();
    if (cleaned) {
      results.push(cleaned);
    }
    match = regex.exec(text);
  }

  return results;
}

function randomItem(items) {
  if (!items.length) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hslToHex(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value) => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function buildRandomTheme() {
  const baseHue = randomInt(0, 359);

  return {
    font: randomItem(FONT_OPTIONS),
    background: hslToHex((baseHue + randomInt(-15, 15) + 360) % 360, randomInt(20, 42), randomInt(95, 98)),
    text: hslToHex((baseHue + randomInt(150, 210)) % 360, randomInt(18, 34), randomInt(12, 22)),
    accent: hslToHex((baseHue + randomInt(25, 70)) % 360, randomInt(45, 75), randomInt(32, 48)),
    border: hslToHex((baseHue + randomInt(10, 45)) % 360, randomInt(18, 40), randomInt(65, 82)),
    quote: hslToHex((baseHue + randomInt(70, 130)) % 360, randomInt(22, 42), randomInt(34, 50)),
    textAlign: randomItem(TEXT_ALIGN_OPTIONS),
    photoAlign: randomItem(PHOTO_ALIGN_OPTIONS),
    borderStyle: randomItem(BORDER_STYLE_OPTIONS),
    borderWidth: randomItem(BORDER_WIDTH_OPTIONS),
    radius: randomItem(RADIUS_OPTIONS)
  };
}

function parseAgendaPool(text) {
  const results = [];
  const regex = /\{\s*t:\s*"([^"]+)"\s*,\s*o:\s*"([^"]+)"\s*,\s*s:\s*"([^"]+)"\s*\}/g;
  let match = regex.exec(text);

  while (match) {
    results.push({
      t: match[1].trim(),
      o: match[2].trim(),
      s: match[3].trim()
    });
    match = regex.exec(text);
  }

  return results;
}

function pickAgenda(pool, pattern, pickedTitles) {
  const eligible = pool.filter((item) => pattern.test(item.t) && !pickedTitles.has(item.t));
  if (!eligible.length) {
    return null;
  }
  const found = eligible[Math.floor(Math.random() * eligible.length)];
  if (!found) {
    return null;
  }
  pickedTitles.add(found.t);
  return found;
}

function shuffledCopy(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function selectAgendas(pool, count) {
  const pickedTitles = new Set();
  const selected = [];

  const mandatoryPatterns = [
    /Dedicated Fund|Student Activities/i,
    /Career|Mental Health|Counselor/i,
    /Transparency|Open House/i,
    /Transport|Transit|Cycle|Rickshaw/i,
    /Library|Software|Portal|Academic|Tutoring|Study|Research|Coding/i
  ];

  for (const pattern of mandatoryPatterns) {
    const item = pickAgenda(pool, pattern, pickedTitles);
    if (item) {
      selected.push(item);
    }
  }

  const randomPool = shuffledCopy(pool);
  for (const item of randomPool) {
    if (selected.length >= count) {
      break;
    }
    if (!pickedTitles.has(item.t)) {
      pickedTitles.add(item.t);
      selected.push(item);
    }
  }

  return selected.slice(0, Math.min(Math.max(count, 12), 14));
}

function parseCredentials(rawExperience) {
  const lines = rawExperience
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return ["[Insert Experience Here]"];
  }

  return lines;
}

function buildManifestoText(candidateName, discipline, experiences, agendas, tagline, headings) {
  const safeName = (candidateName || "[Insert Name Here]").toUpperCase();
  const safeDiscipline = (discipline || DEFAULT_DISCIPLINE).toUpperCase();
  const lines = [];

  lines.push(headings.title);
  lines.push(tagline || DEFAULT_TAGLINES[0]);
  lines.push("");
  lines.push("+--------------------------------------------------+");
  lines.push("|                                                  |");
  lines.push("|            [AFFIX PHOTOGRAPH HERE]              |");
  lines.push("|                                                  |");
  lines.push("+--------------------------------------------------+");
  lines.push("");
  lines.push(`CANDIDATE NAME: ${safeName}`);
  lines.push(`DISCIPLINE: ${safeDiscipline}`);
  lines.push("");
  lines.push(headings.mission);
  lines.push(MISSION_QUOTE);
  lines.push("I am committed to ensuring every student has a voice, receives timely support, and has a fair opportunity to thrive in academics, campus life, and career growth.");
  lines.push("");
  lines.push(headings.agendas);

  agendas.forEach((agenda, index) => {
    lines.push("");
    lines.push(`${index + 1}. ${agenda.t}`);
    lines.push(`OVERVIEW: ${agenda.o}`);
    lines.push(`SOLUTION: ${agenda.s}`);
  });

  lines.push("");
  lines.push(headings.credentials);
  experiences.forEach((item) => {
    lines.push(`- ${item}`);
  });

  return lines.join("\n");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildManifestoHtml(candidateName, discipline, experiences, agendas, tagline, theme, headings) {
  const safeName = escapeHtml((candidateName || "[Insert Name Here]").toUpperCase());
  const safeDiscipline = escapeHtml((discipline || DEFAULT_DISCIPLINE).toUpperCase());
  const safeTagline = escapeHtml(tagline || DEFAULT_TAGLINES[0]);
  const docStyle = [
    `--doc-bg:${theme.background}`,
    `--doc-ink:${theme.text}`,
    `--doc-accent:${theme.accent}`,
    `--doc-border:${theme.border}`,
    `--doc-quote:${theme.quote}`,
    `--doc-align:${theme.textAlign}`,
    `--photo-justify:${theme.photoAlign}`,
    `--doc-font:${theme.font}`,
    `--doc-border-style:${theme.borderStyle}`,
    `--doc-border-width:${theme.borderWidth}px`,
    `--photo-border-style:${theme.borderStyle}`,
    `--photo-border-width:${Math.max(1, theme.borderWidth - 1)}px`,
    `--doc-radius:${theme.radius}px`
  ].join(";");
  const photoBoxHtml = selectedPhotoDataUrl
    ? `
      <div class="photo-box">
        <div class="passport-frame">
          <img src="${selectedPhotoDataUrl}" alt="Candidate photograph" />
        </div>
      </div>
    `
    : `
      <div class="photo-box">
        <div class="passport-frame placeholder">[AFFIX PHOTOGRAPH HERE]</div>
      </div>
    `;
  const agendaBlocks = agendas
    .map((agenda, index) => {
      return `
        <section class="agenda-item">
          <h3>${index + 1}. ${escapeHtml(agenda.t)}</h3>
          <p><strong>OVERVIEW:</strong> ${escapeHtml(agenda.o)}</p>
          <p><strong>SOLUTION:</strong> ${escapeHtml(agenda.s)}</p>
        </section>
      `;
    })
    .join("");

  const credentials = experiences
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <article class="manifesto-doc" style="${docStyle}">
      <h1>${escapeHtml(headings.title)}</h1>
      <p class="tagline">${safeTagline}</p>
      ${photoBoxHtml}
      <p><strong>CANDIDATE NAME:</strong> ${safeName}</p>
      <p><strong>DISCIPLINE:</strong> ${safeDiscipline}</p>

      <h2>${escapeHtml(headings.mission)}</h2>
      <p class="quote">${MISSION_QUOTE}</p>
      <p>I am committed to ensuring every student has a voice, receives timely support, and has a fair opportunity to thrive in academics, campus life, and career growth.</p>

      <h2>${escapeHtml(headings.agendas)}</h2>
      ${agendaBlocks}

      <h2>${escapeHtml(headings.credentials)}</h2>
      <ul>${credentials}</ul>
    </article>
  `;
}

function buildRandomHeadings() {
  return {
    title: randomItem(TITLE_OPTIONS) || TITLE_OPTIONS[0],
    mission: randomItem(MISSION_HEADING_OPTIONS) || MISSION_HEADING_OPTIONS[0],
    agendas: randomItem(AGENDAS_HEADING_OPTIONS) || AGENDAS_HEADING_OPTIONS[0],
    credentials: randomItem(CREDENTIALS_HEADING_OPTIONS) || CREDENTIALS_HEADING_OPTIONS[0]
  };
}

function setSlidersFromTheme(theme) {
  const textAlignIndex = Math.max(0, TEXT_ALIGN_OPTIONS.indexOf(theme.textAlign));
  const photoAlignIndex = Math.max(0, PHOTO_ALIGN_OPTIONS.indexOf(theme.photoAlign));
  const fontIndex = Math.max(0, FONT_OPTIONS.indexOf(theme.font));
  const borderStyleIndex = Math.max(0, BORDER_STYLE_OPTIONS.indexOf(theme.borderStyle));

  textAlignSlider.value = String(textAlignIndex);
  photoAlignSlider.value = String(photoAlignIndex);
  fontFamilySlider.value = String(fontIndex);
  borderStyleSlider.value = String(borderStyleIndex);
  borderWidthSlider.value = String(theme.borderWidth);
  radiusSlider.value = String(theme.radius);
}

function updateSliderValueLabels() {
  const textAlignIndex = clampIndex(textAlignSlider.value, TEXT_ALIGN_OPTIONS.length);
  const photoAlignIndex = clampIndex(photoAlignSlider.value, PHOTO_ALIGN_OPTIONS.length);
  const fontFamilyIndex = clampIndex(fontFamilySlider.value, FONT_OPTIONS.length);
  const borderStyleIndex = clampIndex(borderStyleSlider.value, BORDER_STYLE_OPTIONS.length);

  fontSizeValue.textContent = `${fontSizeSlider.value}px`;
  headingScaleValue.textContent = `${headingScaleSlider.value}%`;
  lineHeightValue.textContent = Number(lineHeightSlider.value).toFixed(2);
  borderWidthValue.textContent = `${borderWidthSlider.value}px`;
  radiusValue.textContent = `${radiusSlider.value}px`;
  photoScaleValue.textContent = `${photoScaleSlider.value}%`;
  textAlignValue.textContent = TEXT_ALIGN_OPTIONS[textAlignIndex];
  photoAlignValue.textContent = PHOTO_ALIGN_OPTIONS[photoAlignIndex];
  fontFamilyValue.textContent = FONT_OPTIONS[fontFamilyIndex].split(",")[0];
  borderStyleValue.textContent = BORDER_STYLE_OPTIONS[borderStyleIndex];
  paddingValue.textContent = `${paddingSlider.value}mm`;
  letterSpacingValue.textContent = `${Number(letterSpacingSlider.value).toFixed(1)}px`;
  saturationValue.textContent = `${saturationSlider.value}%`;
  contrastValue.textContent = `${contrastSlider.value}%`;
  brightnessValue.textContent = `${brightnessSlider.value}%`;
}

function applyManualAdjustments() {
  const docEl = manifestoOutput.querySelector(".manifesto-doc");
  if (!docEl) {
    return;
  }

  const textAlignIndex = clampIndex(textAlignSlider.value, TEXT_ALIGN_OPTIONS.length);
  const photoAlignIndex = clampIndex(photoAlignSlider.value, PHOTO_ALIGN_OPTIONS.length);
  const fontFamilyIndex = clampIndex(fontFamilySlider.value, FONT_OPTIONS.length);
  const borderStyleIndex = clampIndex(borderStyleSlider.value, BORDER_STYLE_OPTIONS.length);
  const borderWidth = Number(borderWidthSlider.value);

  docEl.style.setProperty("--body-font-size", `${fontSizeSlider.value}px`);
  docEl.style.setProperty("--heading-scale", `${Number(headingScaleSlider.value) / 100}`);
  docEl.style.setProperty("--body-line-height", `${lineHeightSlider.value}`);
  docEl.style.setProperty("--doc-border-width", `${borderWidth}px`);
  docEl.style.setProperty("--photo-border-width", `${Math.max(1, borderWidth - 1)}px`);
  docEl.style.setProperty("--doc-radius", `${radiusSlider.value}px`);
  docEl.style.setProperty("--photo-scale", `${Number(photoScaleSlider.value) / 100}`);
  docEl.style.setProperty("--doc-align", TEXT_ALIGN_OPTIONS[textAlignIndex]);
  docEl.style.setProperty("--photo-justify", PHOTO_ALIGN_OPTIONS[photoAlignIndex]);
  docEl.style.setProperty("--doc-font", FONT_OPTIONS[fontFamilyIndex]);
  docEl.style.setProperty("--doc-border-style", BORDER_STYLE_OPTIONS[borderStyleIndex]);
  docEl.style.setProperty("--photo-border-style", BORDER_STYLE_OPTIONS[borderStyleIndex]);
  docEl.style.setProperty("--doc-padding", `${paddingSlider.value}mm`);
  docEl.style.setProperty("--body-letter-spacing", `${letterSpacingSlider.value}px`);
  docEl.style.setProperty(
    "--doc-filter",
    `saturate(${saturationSlider.value}%) contrast(${contrastSlider.value}%) brightness(${brightnessSlider.value}%)`
  );
}

function handleAdjustmentChange() {
  updateSliderValueLabels();
  applyManualAdjustments();
}

function handlePhotoSelection(event) {
  const file = event.target.files?.[0];
  if (!file) {
    selectedPhotoDataUrl = "";
    generateManifesto();
    return;
  }

  if (!file.type.startsWith("image/")) {
    selectedPhotoDataUrl = "";
    candidatePhotoInput.value = "";
    statusEl.textContent = "Please choose a valid image file.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === "string" ? reader.result : "";
    selectedPhotoDataUrl = result;
    generateManifesto();
    statusEl.textContent = "Photograph added to manifesto.";
  };

  reader.onerror = () => {
    selectedPhotoDataUrl = "";
    statusEl.textContent = "Could not read image file. Please try another photo.";
  };

  reader.readAsDataURL(file);
}

function buildFallbackPool() {
  return [
    { t: "Dedicated Fund for Student Activities", o: "Frequent budget denials hinder club operations and event planning.", s: "Establish a separate bank reserve with a fast-track approval committee including student reps." },
    { t: "Student Development and Career Services", o: "Students face career confusion and related mental health issues.", s: "Launch regular competitive exam awareness sessions and ensure 24/7 counselor accessibility." },
    { t: "Transparency and Open House Policy", o: "Lack of communication regarding administrative decisions and fund usage.", s: "Conduct regular open houses and provide students with a right to expenditure information." },
    { t: "Weekend Transportation Services", o: "Students lack reliable transport to city hubs for recreation and shopping.", s: "Start dedicated weekend bus services to major locations with fixed schedules." },
    { t: "24/7 Library Access", o: "Current hours restrict late-night academic preparation.", s: "Transition to round-the-clock operations with night-shift staff." },
    { t: "Industry-Standard Software Access", o: "Limited licenses for high-end software hinder technical skill building.", s: "Procure campus-wide licenses for essential industry software suites." },
    { t: "Campus-Wide High-Speed WiFi", o: "Connectivity dead zones in several hostel blocks.", s: "Expand router networks to ensure complete campus coverage." },
    { t: "Real-Time Grievance App", o: "Reporting infrastructure issues lacks tracking and accountability.", s: "Launch a mobile app to log and track the status of student complaints." },
    { t: "Peer Tutoring Program", o: "Difficulty in mastering core courses through faculty hours alone.", s: "Establish a paid program for seniors to tutor juniors in tough subjects." },
    { t: "Campus Cycle Sharing", o: "Inter-block commuting is difficult and time-consuming.", s: "Introduce a dock-based cycle sharing system across campus." },
    { t: "Drinking Water Audit", o: "Inconsistent maintenance of filtration systems in various hostels.", s: "Implement scheduled hygiene audits and system upgrades." },
    { t: "24/7 Common Study Rooms", o: "Hostels lack quiet, air-conditioned spaces for group study.", s: "Upgrade common rooms with ACs and high-speed internet." },
    { t: "Subsidized Professional Certificates", o: "High costs of industry certifications for students.", s: "Partner with online platforms to provide free or discounted certificates." }
  ];
}

function generateManifesto() {
  const candidateName = candidateNameInput.value.trim();
  const discipline = disciplineInput.value.trim() || DEFAULT_DISCIPLINE;
  const experiences = parseCredentials(priorExperienceInput.value.trim());
  const agendas = selectAgendas(agendaPool, AGENDA_TARGET_COUNT);
  const selectedTagline = randomItem(taglinePool) || DEFAULT_TAGLINES[0];
  const selectedTheme = buildRandomTheme();
  const selectedHeadings = buildRandomHeadings();
  const manifesto = buildManifestoText(candidateName, discipline, experiences, agendas, selectedTagline, selectedHeadings);
  manifestoOutput.innerHTML = buildManifestoHtml(candidateName, discipline, experiences, agendas, selectedTagline, selectedTheme, selectedHeadings);
  setSlidersFromTheme(selectedTheme);
  applyManualAdjustments();
  manifestoOutput.dataset.plainText = manifesto;
  statusEl.textContent = `Manifesto generated with ${agendas.length} agendas and random style.`;
}

async function copyManifesto() {
  const text = manifestoOutput.dataset.plainText || "";
  if (!text) {
    statusEl.textContent = "Nothing to copy. Generate a manifesto first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = "Manifesto copied to clipboard.";
  } catch (error) {
    statusEl.textContent = "Copy failed. Please copy text manually from the output panel.";
  }
}

function printManifesto() {
  if (!manifestoOutput.dataset.plainText) {
    statusEl.textContent = "Generate a manifesto before printing.";
    return;
  }
  const originalTitle = document.title;
  document.title = "Manifesto";
  window.print();
  document.title = originalTitle;
}

function saveAsPdf() {
  if (!manifestoOutput.dataset.plainText) {
    statusEl.textContent = "Generate a manifesto before saving as PDF.";
    return;
  }

  if (!window.html2pdf) {
    statusEl.textContent = "PDF library did not load. Check internet and refresh the page.";
    return;
  }

  const docEl = manifestoOutput.querySelector(".manifesto-doc");
  if (!docEl) {
    statusEl.textContent = "Manifesto content not found. Please generate again.";
    return;
  }

  statusEl.textContent = "Generating PDF file...";

  const candidateName = (candidateNameInput.value.trim() || "Candidate").replace(/[^a-zA-Z0-9_-]+/g, "_");
  const fileName = `Manifesto_${candidateName}.pdf`;

  const options = {
    margin: [10, 10, 10, 10],
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"],
      avoid: [".agenda-item", "h2", "h3", "p", "li"]
    }
  };

  window.html2pdf()
    .set(options)
    .from(docEl)
    .save()
    .then(() => {
      statusEl.textContent = "PDF downloaded without URL/IP header or footer.";
    })
    .catch(() => {
      statusEl.textContent = "PDF generation failed. Please try again.";
    });
}

generateBtn.addEventListener("click", generateManifesto);
copyBtn.addEventListener("click", copyManifesto);
printBtn.addEventListener("click", printManifesto);
pdfBtn.addEventListener("click", saveAsPdf);
candidatePhotoInput.addEventListener("change", handlePhotoSelection);
fontSizeSlider.addEventListener("input", handleAdjustmentChange);
headingScaleSlider.addEventListener("input", handleAdjustmentChange);
lineHeightSlider.addEventListener("input", handleAdjustmentChange);
borderWidthSlider.addEventListener("input", handleAdjustmentChange);
radiusSlider.addEventListener("input", handleAdjustmentChange);
photoScaleSlider.addEventListener("input", handleAdjustmentChange);
textAlignSlider.addEventListener("input", handleAdjustmentChange);
photoAlignSlider.addEventListener("input", handleAdjustmentChange);
fontFamilySlider.addEventListener("input", handleAdjustmentChange);
borderStyleSlider.addEventListener("input", handleAdjustmentChange);
paddingSlider.addEventListener("input", handleAdjustmentChange);
letterSpacingSlider.addEventListener("input", handleAdjustmentChange);
saturationSlider.addEventListener("input", handleAdjustmentChange);
contrastSlider.addEventListener("input", handleAdjustmentChange);
brightnessSlider.addEventListener("input", handleAdjustmentChange);

updateSliderValueLabels();

init();
