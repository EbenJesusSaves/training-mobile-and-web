import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const outFile = path.join(__dirname, 'railpass-frontend-course.pdf');
const W = 960;
const H = 540;
const C = {
  canvas: '#EEF2EE', surface: '#FFFFFF', ink: '#0B120D', muted: '#5F6A62', line: '#E1E6E1',
  inverse: '#07110A', accent: '#7EE6A0', accentSoft: '#DDF7E6', red: '#FF4D5A', danger: '#C8372D',
};
const lessons = [
  ['01', 'Project organisation', '60 min', ['Thin Expo Router entries', 'Feature boundaries', 'Naming/import order', 'Constants vs config'], ['Routes delegate', 'Config separated', 'Dashboard guard once'], "import { SignInScreen } from '@/features/auth/screens/sign-in-screen';\n\nexport default SignInScreen;", 'Refactor a route that mixes fetching, rendering and styling.'],
  ['02', 'Components and design tokens', '75 min', ['Use tokens everywhere', 'Light/dark palettes', 'Danger separate from red brand', 'Extend components safely'], ['StyleSheet + constants', 'Mantine + CSS variables', 'Danger token, not brand red'], "danger: {\n  background: colors.dangerSoft,\n  border: colors.danger,\n  tone: 'danger',\n}", 'Replace hard-coded styles in a flawed example with tokens.'],
  ['03', 'Navigation and flows', '75 min', ['Trace one-way/round-trip booking', 'Explain Stack.Protected', 'Use the station picker page', 'Trace dashboard routes'], ['Protected groups', 'Station picker page', 'Route params for minimal context'], "<Stack.Screen name=\"station-picker\" />\n<Stack.Screen name=\"journeys/[id]\" />\n<Stack.Screen name=\"checkout\" />", 'Draw the booking flow and mark route state vs draft store.'],
  ['04', 'State management', '90 min', ['Classify client vs server state', 'Use persist/partialize', 'Use selectors/useShallow', 'Invalidate query caches'], ['Zustand for mobile draft', 'useApiQuery for modest mobile server state', 'TanStack Query for dashboard'], "partialize: ({ origin, destination }) => ({ origin, destination })\n\nqueryClient.invalidateQueries({ queryKey: ['journeys'] });", 'Classify ten values as route, component, client, server or derived state.'],
  ['05', 'API, forms and failures', '90 min', ['Normalize API errors', 'Map field errors', 'Trust server quote', 'Recover from SEAT_TAKEN'], ['One Axios client', 'Server quote is source of truth', 'Conflict recovery is normal'], "const quote = useApiQuery(\n  request ? `quote:${JSON.stringify(request)}` : null,\n  () => bookingsApi.quote(request!),\n);", 'Trigger invalid email and trace fieldErrors to TextField error.'],
  ['06', 'Performance and debugging', '90 min', ['FlatList/DataTable patterns', 'Skia + native Pressables', 'Reduced motion', 'Debug stale seat maps'], ['Skia draws; native controls interact', 'Focus-scoped polling', 'Memoized taken-seat sets'], "const taken = useMemo(() => new Set(car.takenSeats), [car.takenSeats]);\nconst reduceMotion = useReducedMotion();", 'Debug a selected seat that becomes taken while the screen is open.'],
  ['07', 'Accessibility, testing, review', '75 min', ['Roles/labels/states', 'Test visible behavior', 'Husky hooks', 'Review checklist'], ['Icon + label + colour', 'Targeted tests', 'Backend e2e proves concurrency'], "expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy();\nexpect(statuses).toEqual([201, 409]);", 'Write five actionable review comments for flawed examples.'],
  ['08', 'Extending maintainably', '75 min', ['Plan across layers', 'Know when to abstract', 'Avoid duplicate responsibilities', 'Write acceptance criteria'], ['Feature-local first', 'Inputs in query keys', 'Backend DTO contract'], "const key = originId && destinationId\n  ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}`\n  : null;", 'Plan a first-class-only or departs-after-noon filter end-to-end.'],
];
let pageNo = 0;
const doc = new PDFDocument({ size: [W, H], margin: 0, autoFirstPage: false, info: { Title: 'RailPass frontend course', Author: 'GitHub Copilot' } });
const stream = fs.createWriteStream(outFile);
doc.pipe(stream);
function addPage(bg = C.canvas) { pageNo += 1; doc.addPage({ size: [W, H], margin: 0 }); doc.rect(0, 0, W, H).fill(bg); footer(bg === C.inverse); }
function footer(dark = false) { doc.font('Helvetica').fontSize(7).fillColor(dark ? '#B9B1B1' : C.muted).text('RailPass frontend onboarding', 40, 515); doc.text(String(pageNo), 910, 515, { width: 25, align: 'right' }); }
function title(t, st = '', dark = false) { doc.font('Helvetica-Bold').fontSize(22).fillColor(dark ? '#FFFFFF' : C.ink).text(t, 42, 32, { width: 670 }); if (st) doc.font('Helvetica').fontSize(9).fillColor(dark ? '#A99595' : C.muted).text(st, 44, 67, { width: 760 }); }
function card(x, y, w, h, fill = C.surface, stroke = C.line) { doc.roundedRect(x, y, w, h, 14).fillAndStroke(fill, stroke); }
function bullets(items, x, y, w, size = 15, color = C.ink) { doc.font('Helvetica').fontSize(size).fillColor(color); let yy = y; for (const b of items) { doc.circle(x + 4, yy + 7, 2.2).fill(color); doc.text(b, x + 18, yy, { width: w - 20, lineGap: 3 }); yy += size + 18; } }
function code(text, x, y, w, h) { card(x, y, w, h, '#101614', '#274038'); doc.font('Courier').fontSize(9).fillColor('#F6F3F3').text(text, x + 18, y + 28, { width: w - 36, height: h - 38, lineGap: 2 }); }
function node(text, x, y, w, h, fill, color = C.ink) { card(x, y, w, h, fill, fill); doc.font('Helvetica-Bold').fontSize(12).fillColor(color).text(text, x + 8, y + 16, { width: w - 16, align: 'center' }); }
function line(x1, y1, x2, y2, color = C.muted) { doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(1.4).strokeColor(color).stroke(); }
function image(rel, x, y, w, h) { const p = path.join(repoRoot, rel); if (fs.existsSync(p)) doc.image(p, x, y, { fit: [w, h], align: 'center', valign: 'center' }); }

addPage(C.inverse);
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.accent).text('RailPass', 54, 56);
doc.font('Helvetica-Bold').fontSize(42).fillColor('#FFFFFF').text('Frontend onboarding course', 54, 120, { width: 670 });
doc.font('Helvetica').fontSize(17).fillColor('#B9B1B1').text('Expo passenger app + React/Vite operations dashboard\nReal code, demos, debugging and code review', 58, 230, { width: 640, lineGap: 6 });
card(58, 330, 130, 28, C.red, C.red); doc.font('Helvetica-Bold').fontSize(8).fillColor('#140405').text('NEW EMPLOYEES', 74, 340);
card(202, 330, 100, 28, C.accent, C.accent); doc.fillColor(C.ink).text('FRONTEND', 222, 340);

addPage(); title('RailPass system map', 'One API, two frontends, one design language');
node('Expo passenger app\nmobile/', 80, 155, 170, 60, C.surface); node('Vite staff dashboard\ndashboard/', 80, 275, 170, 60, C.surface);
node('NestJS API\n/api + /admin', 395, 215, 180, 70, C.accentSoft); node('PostgreSQL\nPrisma', 710, 155, 150, 55, C.surface); node('Mailpit\npassword reset', 710, 285, 150, 55, C.surface);
line(250, 185, 395, 238); line(250, 305, 395, 260); line(575, 238, 710, 182); line(575, 260, 710, 312);
bullets(['Frontend lessons reference backend contracts where they shape UX.', 'Design tokens mirror across mobile constants and dashboard CSS variables.', 'Server owns pricing and seat-concurrency truth.'], 80, 405, 760, 13);

addPage(); title('Course paths', 'Choose the schedule that fits the cohort');
[['1-day intensive', ['Map', 'Tokens', 'State', 'API failure', 'Review']], ['2-day course', ['Day 1: lessons 1–4', 'Day 2: lessons 5–8', 'Mini PR review']], ['4 half-days', ['Map + tokens', 'Flow + state', 'API + debugging', 'Quality + extension']]].forEach((c, i) => { const x = 70 + i*290; card(x, 130, 235, 300); doc.font('Helvetica-Bold').fontSize(18).fillColor(C.ink).text(c[0], x+22, 160); bullets(c[1], x+26, 215, 180, 12); });

addPage(); title('Course rule: token-first UI', 'No hard-coded design values in components'); code("// Do\nrow: { borderRadius: radii.xl, padding: spacing.md }\n\n// Don't\nrow: { borderRadius: 24, padding: 12, backgroundColor: '#FF4D5A' }", 70, 130, 410, 230); card(535, 130, 335, 230, C.accentSoft, C.accentSoft); doc.font('Helvetica-Bold').fontSize(20).fillColor(C.ink).text('Why it matters', 560, 160); bullets(['Themes stay aligned.', 'Danger and red brand remain distinct.', 'Screenshots are predictable.', 'Reviews focus on intent.'], 565, 210, 260, 13);

addPage(); title('Screenshots as review artifacts', 'Use visuals to discuss tokens, states and layout'); image('.artifacts/dashboard/overview-light-1440x900.png', 50, 112, 265, 165); image('.artifacts/dashboard/journeys-list-dark-1440x900.png', 347, 112, 265, 165); image('.artifacts/dashboard/journey-detail-seat-map-light-1440x900.png', 644, 112, 265, 165); doc.font('Helvetica').fontSize(13).fillColor(C.muted).text('Mobile screenshots were not present during generation; use live Expo demos for mobile flows.', 90, 365, { width: 760, align: 'center' });

for (const [n, name, dur, objs, decisions, snippet, activity] of lessons) {
  addPage(C.inverse); doc.font('Helvetica-Bold').fontSize(16).fillColor(C.accent).text(`Lesson ${n}`, 55, 58); doc.font('Helvetica-Bold').fontSize(40).fillColor('#FFFFFF').text(name, 55, 125, { width: 730 }); doc.font('Helvetica').fontSize(15).fillColor('#B9B1B1').text(dur, 58, 220); bullets(objs, 80, 300, 720, 17, '#FFFFFF');
  addPage(); title(`Lesson ${n}: objectives`, name); bullets(objs, 85, 135, 410, 16); card(560, 135, 300, 210); doc.font('Helvetica-Bold').fontSize(18).fillColor(C.ink).text('Code paths', 585, 165); doc.font('Helvetica-Bold').fontSize(15).fillColor(C.muted).text('Open the lesson notes for exact files and demos.', 585, 218, { width: 230 });
  addPage(); title(`Lesson ${n}: decisions and trade-offs`, 'What we chose, why, and when to choose differently'); decisions.forEach((d, i) => { const y = 128 + i*82; card(72, y, 760, 52, i % 2 ? C.surface : C.accentSoft, i % 2 ? C.line : C.accentSoft); doc.font('Helvetica-Bold').fontSize(15).fillColor(C.ink).text(d, 100, y+17); }); doc.font('Helvetica-Bold').fontSize(16).fillColor(C.danger).text('Review prompt: what would make us choose differently?', 80, 420);
  addPage(); title(`Lesson ${n}: anchor snippet`, 'Short, real excerpts from the monorepo'); code(snippet, 70, 125, 455, 260); card(590, 125, 280, 260); doc.font('Helvetica-Bold').fontSize(18).fillColor(C.ink).text('Ask learners', 620, 160); bullets(['Which layer owns this?', 'What invariant does it protect?', 'What bug appears if moved?', 'What verification covers it?'], 625, 215, 210, 12);
  addPage(); title(`Lesson ${n}: activity`, 'Interactive practice'); card(75, 135, 770, 260, C.accentSoft, C.accentSoft); doc.font('Helvetica-Bold').fontSize(25).fillColor(C.ink).text(activity, 115, 178, { width: 690 }); bullets(['Prediction first.', 'Debugging task.', 'Code review.', 'Implementation challenge with acceptance criteria.'], 125, 295, 610, 13);
}

const extensions = [
  ['Extension A: Tickets and PDF417', ['API generates PDF417 matrix.', 'Mobile draws one Skia path.', 'PDF uses same matrix as SVG.', 'Black-on-white stays scannable.'], "export function pdf417Matrix(payload: string): BarcodeMatrix {\n  return { format: 'PDF417', payload, columns, rows };\n}"],
  ['Extension B: Dashboard operations', ['Redux owns auth/UI only.', 'TanStack Query owns server data.', 'Mantine components use tokens.', 'CSS Modules use --rp-* variables.'], "const journeys = useJourneys({ page, pageSize, search });\nconst density = useAppSelector((s) => s.ui.tableDensity);"],
  ['Extension C: API contracts', ['Backend error shape drives forms.', 'Server pricing is authoritative.', 'Unique index prevents races.', 'E2E proves one 201 and one 409.'], "@@unique([journeyId, carNumber, seatNumber])\nexpect(statuses).toEqual([201, 409]);"],
];
for (const [t, bs, snip] of extensions) { addPage(); title(t, 'Optional extension module'); bullets(bs, 85, 130, 380, 16); code(snip, 530, 130, 340, 230); }

addPage(C.inverse); doc.font('Helvetica-Bold').fontSize(32).fillColor('#FFFFFF').text('Final review checklist', 55, 70); bullets(['Paths and ownership are correct.', 'Design values come from tokens.', 'Server state is not duplicated.', 'Errors and conflicts have recovery paths.', 'Accessible labels/roles/states exist.', 'Tests or verification evidence are included.'], 85, 150, 560, 17, '#FFFFFF'); node('Ship small\nReview deeply\nLearn the code', 660, 215, 210, 90, C.red, '#140405');

doc.end();
await new Promise((resolve) => stream.on('finish', resolve));
console.log(`Wrote ${outFile} with ${pageNo} pages.`);
