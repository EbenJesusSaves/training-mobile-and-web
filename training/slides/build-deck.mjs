import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const outFile = path.join(__dirname, 'railpass-frontend-course.pptx');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GitHub Copilot for RailPass';
pptx.subject = 'RailPass frontend onboarding course';
pptx.title = 'RailPass frontend course';
pptx.company = 'RailPass';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  lang: 'en-US',
};
pptx.defineSlideMaster({
  title: 'RAILPASS',
  background: { color: 'EEF2EE' },
  objects: [
    { line: { x: 0.4, y: 7.12, w: 12.55, h: 0, line: { color: 'DDF7E6', width: 1 } } },
    { text: { text: 'RailPass frontend onboarding', options: { x: 0.55, y: 7.18, w: 4.5, h: 0.16, fontFace: 'Arial', fontSize: 6.5, color: '5F6A62' } } },
  ],
  slideNumber: { x: 12.45, y: 7.18, color: '5F6A62' },
});

const C = {
  canvas: 'EEF2EE',
  surface: 'FFFFFF',
  ink: '0B120D',
  muted: '5F6A62',
  line: 'E1E6E1',
  inverse: '07110A',
  inverseRaised: '17301D',
  accent: '7EE6A0',
  accentStrong: '4FCB7B',
  accentSoft: 'DDF7E6',
  red: 'FF4D5A',
  redSoft: '3A1418',
  danger: 'C8372D',
  warning: 'B76E00',
  seatTaken: 'DCDEDB',
};
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function addNotes(slide, notes) {
  if (typeof slide.addNotes === 'function') slide.addNotes(notes);
}

function slideBase(title, subtitle, opts = {}) {
  const slide = pptx.addSlide('RAILPASS');
  slide.background = { color: opts.dark ? C.inverse : C.canvas };
  const color = opts.dark ? 'FFFFFF' : C.ink;
  slide.addText(title, { x: 0.58, y: 0.38, w: 8.8, h: 0.45, fontFace: 'Arial', fontSize: 21, bold: true, color, margin: 0 });
  if (subtitle) slide.addText(subtitle, { x: 0.6, y: 0.84, w: 10.2, h: 0.24, fontSize: 8.5, color: opts.dark ? 'A99595' : C.muted, margin: 0 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 11.6, y: 0.38, w: 1.15, h: 0.28, rectRadius: 0.06, fill: { color: opts.dark ? C.red : C.accent }, line: { color: opts.dark ? C.red : C.accent } });
  slide.addText('RailPass', { x: 11.78, y: 0.425, w: 0.8, h: 0.1, fontSize: 7, bold: true, color: opts.dark ? '140405' : C.ink, margin: 0, align: 'center' });
  return slide;
}

function addTitle(slide, text, y = 1.2, dark = false) {
  slide.addText(text, { x: 0.72, y, w: 11.9, h: 0.55, fontSize: 24, bold: true, color: dark ? 'FFFFFF' : C.ink, margin: 0, breakLine: false, fit: 'shrink' });
}
function addBullets(slide, bullets, x, y, w, h, opts = {}) {
  slide.addText(bullets.map((b) => ({ text: b, options: { bullet: { type: 'bullet' } } })), {
    x, y, w, h,
    fontSize: opts.fontSize ?? 14,
    color: opts.color ?? C.ink,
    breakLine: false,
    fit: 'shrink',
    valign: 'top',
    paraSpaceAfterPt: 7,
    margin: 0.04,
  });
}
function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: opts.fill ?? C.surface, transparency: opts.transparency ?? 0 }, line: { color: opts.line ?? C.line, width: opts.lineWidth ?? 1 } });
}
function tag(slide, text, x, y, fill = C.accentSoft, color = C.ink) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 1.35, h: 0.28, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
  slide.addText(text, { x: x + 0.05, y: y + 0.065, w: 1.25, h: 0.1, fontSize: 6.5, bold: true, align: 'center', color, margin: 0 });
}
function codeBox(slide, code, x, y, w, h, title = 'Real code excerpt') {
  card(slide, x, y, w, h, { fill: '101614', line: '274038' });
  slide.addText(title, { x: x + 0.18, y: y + 0.15, w: w - 0.35, h: 0.18, fontSize: 7, color: C.accent, bold: true, margin: 0 });
  slide.addText(code.trim(), { x: x + 0.2, y: y + 0.45, w: w - 0.4, h: h - 0.55, fontFace: 'Courier New', fontSize: 8.2, color: 'F6F3F3', fit: 'shrink', breakLine: false, valign: 'top', margin: 0.03 });
}
function diagramNode(slide, text, x, y, w, h, fill, color = C.ink) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  slide.addText(text, { x: x + 0.06, y: y + 0.1, w: w - 0.12, h: h - 0.1, fontSize: 10, bold: true, align: 'center', valign: 'mid', color, fit: 'shrink', margin: 0 });
}
function arrow(slide, x1, y1, x2, y2, color = C.muted) {
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.2, beginArrowType: 'none', endArrowType: 'triangle' } });
}
function addImageIfExists(slide, rel, x, y, w, h, label) {
  const imagePath = path.join(repoRoot, rel);
  if (fs.existsSync(imagePath)) {
    slide.addImage({ path: imagePath, x, y, w, h });
    if (label) slide.addText(label, { x, y: y + h + 0.07, w, h: 0.16, fontSize: 6.5, color: C.muted, align: 'center', margin: 0 });
    return true;
  }
  return false;
}

function titleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.inverse };
  slide.addShape(pptx.ShapeType.arc, { x: -1.3, y: -1.2, w: 5.0, h: 5.0, line: { color: C.red, transparency: 100 }, fill: { color: C.red, transparency: 54 } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.7, y: 4.2, w: 4.2, h: 4.2, line: { color: C.accent, transparency: 100 }, fill: { color: C.accent, transparency: 38 } });
  slide.addText('RailPass', { x: 0.7, y: 0.65, w: 2.2, h: 0.35, fontSize: 16, bold: true, color: C.accent, margin: 0 });
  slide.addText('Frontend onboarding course', { x: 0.7, y: 1.65, w: 8.9, h: 0.8, fontSize: 39, bold: true, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText('Expo passenger app + React/Vite operations dashboard\nReal code, interactive demos, debugging and review practice', { x: 0.75, y: 2.75, w: 8.2, h: 0.75, fontSize: 15, color: 'B9B1B1', margin: 0, breakLine: false });
  tag(slide, 'NEW EMPLOYEES', 0.75, 4.0, C.red, '140405');
  tag(slide, 'FRONTEND', 2.25, 4.0, C.accent, C.ink);
  tag(slide, 'GHANA RAIL', 3.75, 4.0, C.inverseRaised, 'FFFFFF');
  addNotes(slide, 'Open by positioning RailPass as a realistic training monorepo: mobile passenger app, staff dashboard, and backend API contract. Tell learners the course is about decisions and trade-offs, not memorizing libraries.');
}

function systemSlide() {
  const slide = slideBase('RailPass system map', 'One API, two frontends, one design language');
  diagramNode(slide, 'Expo passenger app\nmobile/', 0.85, 2.0, 2.2, 0.85, C.surface);
  diagramNode(slide, 'Vite staff dashboard\ndashboard/', 0.85, 3.6, 2.2, 0.85, C.surface);
  diagramNode(slide, 'NestJS API\n/api + /admin', 5.2, 2.75, 2.35, 0.95, C.accentSoft);
  diagramNode(slide, 'PostgreSQL\nPrisma', 9.5, 2.0, 2.0, 0.8, C.surface);
  diagramNode(slide, 'Mailpit\npassword reset', 9.5, 3.65, 2.0, 0.8, C.surface);
  arrow(slide, 3.1, 2.42, 5.08, 3.05);
  arrow(slide, 3.1, 4.02, 5.08, 3.45);
  arrow(slide, 7.6, 3.0, 9.38, 2.38);
  arrow(slide, 7.6, 3.45, 9.38, 4.05);
  addBullets(slide, ['Frontend lessons reference backend contracts only where they shape UX.', 'Design tokens mirror across mobile constants and dashboard CSS variables.', 'Server owns pricing and seat-concurrency truth.'], 0.95, 5.35, 11.0, 1.0, { fontSize: 13 });
  addNotes(slide, 'Use this as the mental model for the course. Learners should not edit backend in frontend exercises, but they must understand pricing, validation and seat reservation guarantees.');
}

function scheduleSlide() {
  const slide = slideBase('Course paths', 'Run the core lessons in one day, two days, or four half-days');
  const cols = [0.75, 4.75, 8.75];
  const titles = ['1-day intensive', '2-day course', '4 half-days'];
  const items = [
    ['Codebase map', 'Tokens', 'State', 'API failure', 'Review'],
    ['Day 1: lessons 1–4', 'Day 2: lessons 5–8', 'Exercises between blocks', 'Mini PR review'],
    ['Map + tokens', 'Flow + state', 'API + debugging', 'Quality + extension'],
  ];
  titles.forEach((t, i) => {
    card(slide, cols[i], 1.45, 3.35, 4.7);
    slide.addText(t, { x: cols[i] + 0.25, y: 1.75, w: 2.8, h: 0.28, fontSize: 17, bold: true, color: C.ink, margin: 0 });
    addBullets(slide, items[i], cols[i] + 0.35, 2.35, 2.65, 2.8, { fontSize: 13 });
  });
  addNotes(slide, 'Explain that the course length is modular. The deck supports all schedules; detailed timing lives in the README and lesson notes.');
}

function keyRuleSlide() {
  const slide = slideBase('Course rule: token-first UI', 'No hard-coded design values in components');
  codeBox(slide, "// Do\nrow: { borderRadius: radii.xl, padding: spacing.md }\n\n// Don't\nrow: { borderRadius: 24, padding: 12, backgroundColor: '#FF4D5A' }", 0.8, 1.45, 5.6, 3.05);
  card(slide, 7.0, 1.45, 4.95, 3.05, { fill: C.accentSoft, line: C.accentSoft });
  slide.addText('Why it matters', { x: 7.35, y: 1.78, w: 2.8, h: 0.24, fontSize: 18, bold: true, color: C.ink, margin: 0 });
  addBullets(slide, ['Light/dark themes stay aligned.', 'Danger and red brand remain distinct.', 'Screenshots become predictable.', 'Reviews focus on intent, not magic numbers.'], 7.35, 2.3, 3.9, 1.7, { fontSize: 13 });
  addNotes(slide, 'This is the convention the user emphasized. Repeat it often. Tokens include colours, spacing, radii, typography, sizes, motion and drawing geometry.');
}

const lessons = [
  {
    n: '01', title: 'Project organisation', duration: '60 min', paths: 'mobile/app → features → constants/config',
    objectives: ['Thin Expo Router entries', 'Feature boundaries', 'Naming and import order', 'Constants vs runtime config'],
    decisions: [['Routes delegate', 'Feature screens are testable'], ['Config separated', 'Runtime values differ from design'], ['Dashboard router central', 'Staff routes are guarded once']],
    code: "import { SignInScreen } from '@/features/auth/screens/sign-in-screen';\n\nexport default SignInScreen;",
    activity: 'Refactor a hypothetical route that does fetching, rendering and styling into route + feature screen + components.',
    notes: 'Open mobile/app/_layout.tsx and station-picker route. Emphasize that app/ is the navigation layer, not the place for full implementation.',
  },
  {
    n: '02', title: 'Components and design tokens', duration: '75 min', paths: 'mobile/constants + dashboard tokens.css',
    objectives: ['Use tokens everywhere', 'Understand light/dark palettes', 'Keep danger separate from red brand', 'Extend reusable components safely'],
    decisions: [['StyleSheet + constants', 'Plain, typed, searchable'], ['Mantine + CSS variables', 'Accessible dashboard primitives'], ['Danger token', 'Not the dark brand red']],
    code: "danger: {\n  background: colors.dangerSoft,\n  border: colors.danger,\n  tone: 'danger',\n}",
    activity: 'Find and replace a hard-coded style in a flawed example with tokens.',
    notes: 'Use docs/design-tokens.md. The red dark-mode accent is brand, not error. Unavailable seats use hatching and grey token.',
  },
  {
    n: '03', title: 'Navigation and flows', duration: '75 min', paths: 'Expo Router groups + dashboard RequireStaff',
    objectives: ['Trace one-way and round-trip booking', 'Explain Stack.Protected', 'Use the station picker page', 'Trace dashboard routes'],
    decisions: [['Protected groups', 'Screens avoid auth checks'], ['Station picker page', 'One picker handles origin/destination'], ['Route params', 'Minimal addressable context']],
    code: "<Stack.Screen name=\"station-picker\" />\n<Stack.Screen name=\"journeys/[id]\" />\n<Stack.Screen name=\"checkout\" />",
    activity: 'Draw the booking flow and mark which state is route params vs draft store.',
    notes: 'Demonstrate home → seat → checkout → tickets. For dashboard, show passenger refused and staff allowed.',
  },
  {
    n: '04', title: 'State management', duration: '90 min', paths: 'Zustand + useApiQuery vs Redux + TanStack Query',
    objectives: ['Classify client vs server state', 'Use persist/partialize safely', 'Use selectors/useShallow', 'Invalidate query caches'],
    decisions: [['Zustand mobile draft', 'Small client intent store'], ['useApiQuery mobile', 'Modest server-state needs'], ['TanStack dashboard', 'Server cache and mutations']],
    code: "partialize: ({ origin, destination }) => ({ origin, destination }),\n\nqueryClient.invalidateQueries({ queryKey: ['journeys'] });",
    activity: 'Classify ten example values as route, component, client store or server state.',
    notes: 'Stress that selected seats are volatile and should not be persisted. Dashboard Redux does not own server lists.',
  },
  {
    n: '05', title: 'API, forms and failures', duration: '90 min', paths: 'Axios clients, ApiError, checkout recovery',
    objectives: ['Normalize API errors', 'Map field errors', 'Trust server quote', 'Recover from SEAT_TAKEN'],
    decisions: [['One Axios client', 'Central auth and 401'], ['Server quote', 'Prices are authoritative'], ['Conflict recovery', 'Concurrency is normal']],
    code: "const quote = useApiQuery(\n  request ? `quote:${JSON.stringify(request)}` : null,\n  () => bookingsApi.quote(request!),\n);",
    activity: 'Trigger invalid email and explain the path from backend fieldErrors to TextField error.',
    notes: 'Server-side pricing and final seat conflicts are not optional. The UI is resilient, not authoritative.',
  },
  {
    n: '06', title: 'Performance and debugging', duration: '90 min', paths: 'FlatList, Skia, Reanimated, polling',
    objectives: ['Profile list patterns', 'Explain Skia + native Pressables', 'Respect reduced motion', 'Debug stale seat maps'],
    decisions: [['Skia draws', 'Native controls interact'], ['Focus polling', 'Fresh enough without always-on traffic'], ['Memoized sets', 'Avoid repeated seat lookups']],
    code: "const taken = useMemo(() => new Set(car.takenSeats), [car.takenSeats]);\nconst reduceMotion = useReducedMotion();",
    activity: 'Debug a selected seat that becomes taken while the screen is open.',
    notes: 'Show Canvas accessible=false and Pressable labels. Polling cost is a product/infra trade-off.',
  },
  {
    n: '07', title: 'Accessibility, testing, review', duration: '75 min', paths: 'RNTL, Vitest, e2e, Husky',
    objectives: ['Add roles/labels/states', 'Test user-visible behavior', 'Use Husky hooks', 'Apply review checklist'],
    decisions: [['Icon + label + colour', 'Status is not colour-only'], ['Targeted tests', 'Fast confidence'], ['Backend e2e', 'Concurrency proof']],
    code: "expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy();\nexpect(statuses).toEqual([201, 409]);",
    activity: 'Write five code-review comments for flawed examples.',
    notes: 'Connect accessibility to implementation choices in the seat map. Git hooks are guardrails, not full CI.',
  },
  {
    n: '08', title: 'Extending maintainably', duration: '75 min', paths: 'Feature-local first, query keys, API contracts',
    objectives: ['Plan changes across layers', 'Know when to abstract', 'Avoid duplicated responsibilities', 'Write acceptance criteria'],
    decisions: [['Feature-local first', 'Avoid premature shared APIs'], ['Inputs in query keys', 'Prevent stale filters'], ['Backend DTO contract', 'Frontend cannot invent authority']],
    code: "const key = originId && destinationId\n  ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}`\n  : null;",
    activity: 'Plan a first-class-only or departs-after-noon journey filter end-to-end.',
    notes: 'This lesson ties everything together. Require learners to write acceptance criteria before code.',
  },
];

function sectionSlide(lesson) {
  const slide = pptx.addSlide();
  slide.background = { color: C.inverse };
  slide.addText(`Lesson ${lesson.n}`, { x: 0.75, y: 0.75, w: 2.0, h: 0.3, fontSize: 14, bold: true, color: C.accent, margin: 0 });
  slide.addText(lesson.title, { x: 0.75, y: 1.45, w: 9.3, h: 0.7, fontSize: 34, bold: true, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText(`${lesson.duration} · ${lesson.paths}`, { x: 0.78, y: 2.35, w: 9.5, h: 0.3, fontSize: 13, color: 'B9B1B1', margin: 0 });
  slide.addShape(pptx.ShapeType.line, { x: 0.8, y: 3.1, w: 6.1, h: 0, line: { color: C.red, width: 5 } });
  addBullets(slide, lesson.objectives, 0.9, 3.65, 6.8, 2.1, { color: 'FFFFFF', fontSize: 16 });
  addNotes(slide, lesson.notes);
}

function objectiveSlide(lesson) {
  const slide = slideBase(`Lesson ${lesson.n}: objectives`, lesson.title);
  addBullets(slide, lesson.objectives, 0.85, 1.45, 5.4, 3.0, { fontSize: 16 });
  card(slide, 7.0, 1.45, 4.9, 3.2, { fill: C.surface });
  slide.addText('Code paths to open', { x: 7.35, y: 1.75, w: 3.5, h: 0.25, fontSize: 17, bold: true, color: C.ink, margin: 0 });
  slide.addText(lesson.paths, { x: 7.35, y: 2.35, w: 3.8, h: 1.0, fontSize: 16, color: C.muted, bold: true, fit: 'shrink', margin: 0 });
  slide.addText('Keep slides light; use lesson notes for detailed facilitation.', { x: 7.35, y: 3.85, w: 3.8, h: 0.4, fontSize: 10, color: C.muted, margin: 0 });
  addNotes(slide, `Objectives for ${lesson.title}. Ask learners to predict where the code lives before opening files.`);
}

function decisionsSlide(lesson) {
  const slide = slideBase(`Lesson ${lesson.n}: decisions and trade-offs`, 'What we chose, why, and when to choose differently');
  lesson.decisions.forEach((row, i) => {
    const y = 1.45 + i * 1.35;
    card(slide, 0.85, y, 10.8, 0.9, { fill: i % 2 ? C.surface : C.accentSoft, line: i % 2 ? C.line : C.accentSoft });
    slide.addText(row[0], { x: 1.15, y: y + 0.18, w: 2.8, h: 0.2, fontSize: 15, bold: true, color: C.ink, margin: 0 });
    slide.addText(row[1], { x: 4.3, y: y + 0.18, w: 6.5, h: 0.25, fontSize: 13, color: C.muted, margin: 0 });
  });
  slide.addText('Review prompt: what would make us choose differently?', { x: 0.95, y: 5.75, w: 8.0, h: 0.28, fontSize: 16, bold: true, color: C.danger, margin: 0 });
  addNotes(slide, `Use the lesson note table for complete What/Why/Trade-offs/When differently. This slide is for discussion, not lecture.`);
}

function codeSlide(lesson) {
  const slide = slideBase(`Lesson ${lesson.n}: anchor snippet`, 'Short, real excerpts from the monorepo');
  codeBox(slide, lesson.code, 0.8, 1.35, 6.1, 3.5);
  card(slide, 7.35, 1.35, 4.65, 3.5, { fill: C.surface });
  slide.addText('Ask learners', { x: 7.7, y: 1.75, w: 2.0, h: 0.25, fontSize: 17, bold: true, color: C.ink, margin: 0 });
  addBullets(slide, ['Which layer owns this code?', 'What invariant does it protect?', 'What bug appears if we move it?', 'What test or review check covers it?'], 7.7, 2.25, 3.3, 1.65, { fontSize: 13 });
  addNotes(slide, `Use this actual snippet to keep the lesson grounded in the codebase. Avoid generic framework tours.`);
}

function activitySlide(lesson) {
  const slide = slideBase(`Lesson ${lesson.n}: activity`, 'Interactive practice');
  card(slide, 0.85, 1.45, 11.0, 3.7, { fill: C.accentSoft, line: C.accentSoft });
  slide.addText(lesson.activity, { x: 1.25, y: 1.9, w: 9.8, h: 1.0, fontSize: 24, bold: true, color: C.ink, fit: 'shrink', margin: 0 });
  addBullets(slide, ['Prediction first: what will happen if…?', 'Debugging task: reproduce or trace the issue.', 'Code review: leave actionable comments.', 'Implementation challenge: small, accepted by criteria.'], 1.3, 3.3, 9.0, 1.25, { fontSize: 14 });
  addNotes(slide, `Run the activity from the lesson notes. Keep the group focused on evidence from actual files.`);
}

function screenshotSlide() {
  const slide = slideBase('Screenshots as review artifacts', 'Use visuals to discuss tokens, states and layout');
  const imgs = [
    ['.artifacts/dashboard/overview-light-1440x900.png', 0.7, 1.25, 3.85, 2.4, 'Dashboard overview'],
    ['.artifacts/dashboard/journeys-list-dark-1440x900.png', 4.75, 1.25, 3.85, 2.4, 'Dark journeys list'],
    ['.artifacts/dashboard/journey-detail-seat-map-light-1440x900.png', 8.8, 1.25, 3.85, 2.4, 'Seat occupancy'],
  ];
  imgs.forEach(([rel, x, y, w, h, label]) => addImageIfExists(slide, rel, x, y, w, h, label));
  slide.addText('Mobile screenshots were not present when this deck was generated; use live Expo demos for mobile flows.', { x: 0.9, y: 5.15, w: 10.8, h: 0.35, fontSize: 13, color: C.muted, italic: true, margin: 0 });
  addNotes(slide, 'Use dashboard screenshots for visual review. If mobile screenshots are later added to .artifacts/mobile, rerun build-deck.mjs; the script can be extended to include them.');
}

function extensionSlide(title, bullets, code, notes) {
  const slide = slideBase(title, 'Optional extension module');
  addBullets(slide, bullets, 0.85, 1.35, 5.3, 3.4, { fontSize: 15 });
  codeBox(slide, code, 6.75, 1.35, 5.2, 3.4);
  addNotes(slide, notes);
}

function closingSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.inverse };
  slide.addText('Final review checklist', { x: 0.75, y: 0.75, w: 6.0, h: 0.45, fontSize: 28, bold: true, color: 'FFFFFF', margin: 0 });
  addBullets(slide, ['Paths and ownership are correct.', 'Design values come from tokens.', 'Server state is not duplicated.', 'Errors and conflicts have recovery paths.', 'Accessible labels/roles/states exist.', 'Tests or verification evidence are included.'], 0.95, 1.75, 6.0, 3.4, { color: 'FFFFFF', fontSize: 17 });
  diagramNode(slide, 'Ship small\nReview deeply\nLearn the code', 8.2, 2.2, 3.1, 1.25, C.red, '140405');
  addNotes(slide, 'Close by asking learners to use the checklist on their first RailPass PR and to link evidence: files read, tests run, screenshots inspected.');
}

titleSlide();
systemSlide();
scheduleSlide();
keyRuleSlide();
screenshotSlide();
for (const lesson of lessons) {
  sectionSlide(lesson);
  objectiveSlide(lesson);
  decisionsSlide(lesson);
  codeSlide(lesson);
  activitySlide(lesson);
}
extensionSlide('Extension A: Tickets and PDF417', ['API generates PDF417 matrix.', 'Mobile draws one Skia path.', 'PDF uses same matrix as SVG.', 'Black-on-white stays scannable.'], "export function pdf417Matrix(payload: string): BarcodeMatrix {\n  const options = { bcid: 'pdf417', text: payload };\n  return { format: 'PDF417', payload, columns, rows };\n}", 'Optional module for ticketing. Focus on bundle size, API contract and drawing trade-offs, not barcode internals.');
extensionSlide('Extension B: Dashboard operations', ['Redux owns auth/UI only.', 'TanStack Query owns server data.', 'Mantine components use tokens.', 'CSS Modules use --rp-* variables.'], "const journeys = useJourneys({\n  page, pageSize, search: debouncedSearch, status\n});\n\nconst density = useAppSelector((s) => s.ui.tableDensity);", 'Optional module for staff dashboard work. Use screenshots and table filters.');
extensionSlide('Extension C: API contracts', ['Backend error shape drives forms.', 'Server pricing is authoritative.', 'SeatReservation unique index prevents races.', 'E2E test proves one 201 and one 409.'], "@@unique([journeyId, carNumber, seatNumber])\n\nexpect(statuses).toEqual([201, 409]);", 'Optional module for end-to-end thinking. Explain why UI must be resilient to final server conflicts.');
closingSlide();

await pptx.writeFile({ fileName: outFile });
console.log(`Wrote ${outFile} with ${pptx._slides.length} slides.`);
