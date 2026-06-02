// =========================================================================
// Upkeeply · Sample data layer (invented campus — Northgate University)
// =========================================================================

const CAMPUSES = [
  { id: 'main',   name: 'Northgate — Main Campus',   short: 'Main Campus',  zones: 148, workers: 34, code: 'NG-01' },
  { id: 'north',  name: 'Northgate — North Annex',    short: 'North Annex',  zones: 62,  workers: 14, code: 'NG-02' },
  { id: 'river',  name: 'Northgate — Riverside Ext.', short: 'Riverside',    zones: 41,  workers: 9,  code: 'NG-03' },
];

const BUILDINGS = ['Rizal Hall', 'Engineering Complex', 'Science Wing', 'Student Center', 'Main Library', 'Sports Complex'];

// ─── Workers (maintenance staff) ─────────────────────────────────────────────
const WORKERS = [
  { id: 'W-1042', name: 'Marisol Reyes',   initials: 'MR', shift: 'AM · 06:00–14:00', zones: 12, today: 41, status: 'On shift', color: 'var(--crimson-600)' },
  { id: 'W-1055', name: 'Dann Villanueva', initials: 'DV', shift: 'AM · 06:00–14:00', zones: 9,  today: 33, status: 'On shift', color: '#1E5BA8' },
  { id: 'W-1063', name: 'Grace Lim',       initials: 'GL', shift: 'AM · 06:00–14:00', zones: 14, today: 52, status: 'On shift', color: '#2F7D4F' },
  { id: 'W-1071', name: 'Tomas Aquino',    initials: 'TA', shift: 'PM · 14:00–22:00', zones: 10, today: 8,  status: 'On shift', color: '#B47512' },
  { id: 'W-1088', name: 'Joy Mendoza',     initials: 'JM', shift: 'PM · 14:00–22:00', zones: 11, today: 6,  status: 'On shift', color: '#6A0B0C' },
  { id: 'W-1090', name: 'Rolando Cruz',    initials: 'RC', shift: 'AM · 06:00–14:00', zones: 8,  today: 27, status: 'Break',    color: '#4A4641' },
  { id: 'W-1102', name: 'Faith Soriano',   initials: 'FS', shift: 'Off',              zones: 7,  today: 0,  status: 'Off',      color: '#9A938C' },
];

// ─── Zones (with maintenance state) ──────────────────────────────────────────
const ZONES = [
  { id: 'Z-0312', name: 'Restroom · 2F East',      type: 'Restroom',  building: 'Rizal Hall',           lastMin: 8,   status: 'Cleaned OK',      today: 6, worker: 'Grace Lim' },
  { id: 'Z-0288', name: 'Main Lobby',              type: 'Lobby',     building: 'Student Center',       lastMin: 14,  status: 'Cleaned OK',      today: 4, worker: 'Marisol Reyes' },
  { id: 'Z-0401', name: 'Cafeteria Hall A',        type: 'Cafeteria', building: 'Student Center',       lastMin: 22,  status: 'Needs Attention', today: 3, worker: 'Dann Villanueva' },
  { id: 'Z-0144', name: 'Stairwell · West Core',   type: 'Stairwell', building: 'Engineering Complex',  lastMin: 47,  status: 'Cleaned OK',      today: 5, worker: 'Grace Lim' },
  { id: 'Z-0520', name: 'Restroom · GF North',     type: 'Restroom',  building: 'Main Library',         lastMin: 119, status: 'Overdue',         today: 2, worker: 'Rolando Cruz' },
  { id: 'Z-0077', name: 'Parking Deck · Level 1',  type: 'Parking',   building: 'Sports Complex',       lastMin: 35,  status: 'Cleaned OK',      today: 3, worker: 'Dann Villanueva' },
  { id: 'Z-0612', name: 'Corridor · 3F Science',   type: 'Hallway',   building: 'Science Wing',         lastMin: 9,   status: 'Cleaned OK',      today: 7, worker: 'Grace Lim' },
  { id: 'Z-0199', name: 'Garden · Central Quad',   type: 'Garden',    building: 'Rizal Hall',           lastMin: 188, status: 'Overdue',         today: 1, worker: 'Tomas Aquino' },
  { id: 'Z-0455', name: 'Waste Station · Dock B',  type: 'Waste',     building: 'Engineering Complex',  lastMin: 18,  status: 'Needs Attention', today: 4, worker: 'Marisol Reyes' },
  { id: 'Z-0333', name: 'Classroom · 204',         type: 'Classroom', building: 'Rizal Hall',           lastMin: 28,  status: 'Cleaned OK',      today: 2, worker: 'Marisol Reyes' },
  { id: 'Z-0701', name: 'Soap Dispenser · 2F-E-3', type: 'Dispenser', building: 'Rizal Hall',           lastMin: 8,   status: 'Needs Attention', today: 1, worker: 'Grace Lim' },
  { id: 'Z-0820', name: 'Exterior Light · Path 4', type: 'Lighting',  building: 'Sports Complex',       lastMin: 240, status: 'Overdue',         today: 0, worker: '—' },
];

// ─── Live log feed (most recent first; minutes-ago) ──────────────────────────
const SEED_LOGS = [
  { id: 'L-88142', zone: 'Restroom · 2F East',     zoneId: 'Z-0312', type: 'Restroom',  building: 'Rizal Hall',          worker: 'Grace Lim',       initials: 'GL', status: 'Cleaned OK',      min: 2,  note: '' },
  { id: 'L-88141', zone: 'Corridor · 3F Science',  zoneId: 'Z-0612', type: 'Hallway',   building: 'Science Wing',        worker: 'Grace Lim',       initials: 'GL', status: 'Cleaned OK',      min: 9,  note: '' },
  { id: 'L-88140', zone: 'Main Lobby',             zoneId: 'Z-0288', type: 'Lobby',     building: 'Student Center',      worker: 'Marisol Reyes',   initials: 'MR', status: 'Cleaned OK',      min: 14, note: '' },
  { id: 'L-88139', zone: 'Waste Station · Dock B', zoneId: 'Z-0455', type: 'Waste',     building: 'Engineering Complex', worker: 'Marisol Reyes',   initials: 'MR', status: 'Needs Attention', min: 18, note: 'Bin overflow — 2 bags left outside, needs pickup.' },
  { id: 'L-88138', zone: 'Cafeteria Hall A',       zoneId: 'Z-0401', type: 'Cafeteria', building: 'Student Center',      worker: 'Dann Villanueva', initials: 'DV', status: 'Needs Attention', min: 22, note: 'Spill near counter 3, signage placed.', source: 'public' },
  { id: 'L-88137', zone: 'Classroom · 204',        zoneId: 'Z-0333', type: 'Classroom', building: 'Rizal Hall',          worker: 'Marisol Reyes',   initials: 'MR', status: 'Cleaned OK',      min: 28, note: '' },
  { id: 'L-88136', zone: 'Parking Deck · Level 1', zoneId: 'Z-0077', type: 'Parking',   building: 'Sports Complex',      worker: 'Dann Villanueva', initials: 'DV', status: 'Cleaned OK',      min: 35, note: '' },
  { id: 'L-88135', zone: 'Stairwell · West Core',  zoneId: 'Z-0144', type: 'Stairwell', building: 'Engineering Complex', worker: 'Grace Lim',       initials: 'GL', status: 'Cleaned OK',      min: 47, note: '' },
];

// pool of events that the live simulator prepends over time
const LIVE_POOL = [
  { zone: 'Restroom · 1F West',    zoneId: 'Z-0291', type: 'Restroom',  building: 'Main Library',        worker: 'Rolando Cruz',  initials: 'RC', status: 'Cleaned OK',      note: '' },
  { zone: 'Study Area · Level 2',  zoneId: 'Z-0510', type: 'Study',     building: 'Main Library',        worker: 'Grace Lim',     initials: 'GL', status: 'Cleaned OK',      note: '' },
  { zone: 'Restroom · GF North',   zoneId: 'Z-0520', type: 'Restroom',  building: 'Main Library',        worker: 'Rolando Cruz',  initials: 'RC', status: 'Needs Attention', note: 'Out of paper towels, refilled. Tap leaking.' },
  { zone: 'Corridor · 1F Rizal',   zoneId: 'Z-0118', type: 'Hallway',   building: 'Rizal Hall',          worker: 'Marisol Reyes', initials: 'MR', status: 'Cleaned OK',      note: '' },
  { zone: 'Cafeteria Hall A',      zoneId: 'Z-0401', type: 'Cafeteria', building: 'Student Center',      worker: '—',             initials: '?',  status: 'Needs Attention', note: 'Sticky floor by entrance.', source: 'public' },
  { zone: 'Classroom · 311',       zoneId: 'Z-0344', type: 'Classroom', building: 'Science Wing',        worker: 'Dann Villanueva',initials: 'DV', status: 'Cleaned OK',     note: '' },
  { zone: 'Garden · Central Quad', zoneId: 'Z-0199', type: 'Garden',    building: 'Rizal Hall',          worker: 'Tomas Aquino',  initials: 'TA', status: 'Cleaned OK',      note: '' },
  { zone: 'Lobby · Engineering',   zoneId: 'Z-0210', type: 'Lobby',     building: 'Engineering Complex', worker: 'Joy Mendoza',   initials: 'JM', status: 'Cleaned OK',      note: '' },
];

// ─── Alerts (flagged issues) ─────────────────────────────────────────────────
const SEED_ALERTS = [
  { id: 'A-2051', zone: 'Restroom · GF North',  zoneId: 'Z-0520', building: 'Main Library',         status: 'Open',     priority: 'High',   min: 12,  note: 'Tap leaking, floor flooding near stalls 3–4.', source: 'Public report', assignee: null },
  { id: 'A-2050', zone: 'Cafeteria Hall A',     zoneId: 'Z-0401', building: 'Student Center',       status: 'Open',     priority: 'Medium', min: 22,  note: 'Spill near counter 3 — signage placed, mop needed.', source: 'Marisol Reyes', assignee: null },
  { id: 'A-2049', zone: 'Exterior Light · Path 4', zoneId: 'Z-0820', building: 'Sports Complex',    status: 'Open',     priority: 'High',   min: 56,  note: 'Walkway light out — dark stretch near field gate.', source: 'Public report', assignee: null },
  { id: 'A-2048', zone: 'Waste Station · Dock B',zoneId: 'Z-0455', building: 'Engineering Complex',  status: 'Assigned', priority: 'Medium', min: 18,  note: 'Bin overflow, 2 bags outside.', source: 'Marisol Reyes', assignee: 'Tomas Aquino' },
  { id: 'A-2047', zone: 'Soap Dispenser · 2F-E-3',zoneId: 'Z-0701',building: 'Rizal Hall',          status: 'Resolved', priority: 'Low',    min: 95,  note: 'Empty dispenser refilled.', source: 'Grace Lim', assignee: 'Grace Lim' },
];

// ─── Lost & Found ────────────────────────────────────────────────────────────
const LOST_FOUND = [
  { id: 'LF-7781', name: 'Black JanSport backpack', category: 'Bags',        found: 'Main Library · 2F',   foundMin: 95,   by: 'Grace Lim',     state: 'unclaimed', public: true,  ref: 'LF-7781', desc: 'Black backpack, worn straps, blue keychain.' },
  { id: 'LF-7780', name: 'iPhone 14, navy case',    category: 'Electronics', found: 'Cafeteria Hall A',    foundMin: 140,  by: 'Dann Villanueva',state: 'pending',   public: true,  ref: 'LF-7780', desc: 'Navy silicone case, cracked top-left corner.', claim: { email: 'a.santos@northgate.edu', desc: 'Lock screen is a photo of a corgi. Cracked corner near camera.', min: 40 } },
  { id: 'LF-7779', name: 'Student ID — J. Domingo', category: 'IDs',         found: 'Rizal Hall · 2F',     foundMin: 200,  by: 'Marisol Reyes', state: 'unclaimed', public: true,  ref: 'LF-7779', desc: 'Northgate ID card, name J. Domingo, BS-CpE.' },
  { id: 'LF-7778', name: 'Brown leather wallet',    category: 'Wallets',     found: 'Parking Deck L1',     foundMin: 260,  by: 'Dann Villanueva',state: 'unclaimed', public: true,  ref: 'LF-7778', desc: 'Brown bifold, no cash logged publicly.' },
  { id: 'LF-7777', name: 'Grey hoodie, size M',     category: 'Clothing',    found: 'Sports Complex',      foundMin: 320,  by: 'Joy Mendoza',   state: 'claimed',   public: true,  ref: 'LF-7777', desc: 'Grey pullover hoodie, small bleach mark on sleeve.' },
  { id: 'LF-7776', name: 'AirPods Pro, white',      category: 'Electronics', found: 'Study Area L2',       foundMin: 410,  by: 'Grace Lim',     state: 'unclaimed', public: true,  ref: 'LF-7776', desc: 'White case, faint scratch on lid.' },
  // PMU-only (never public)
  { id: 'LF-7775', name: 'Loose cash',              category: 'Cash',        found: 'Cafeteria Hall A',    foundMin: 150,  by: 'Dann Villanueva',state: 'pmu',       public: false, ref: 'LF-7775', desc: 'Amount recorded internally. PMU office only.' },
  { id: 'LF-7774', name: 'Unmarked keys (3)',       category: 'Keys',        found: 'Main Lobby',          foundMin: 180,  by: 'Marisol Reyes', state: 'pmu',       public: false, ref: 'LF-7774', desc: 'No identifier. PMU office only.' },
];

const LF_CATEGORIES = ['All', 'Bags', 'Electronics', 'IDs', 'Wallets', 'Clothing'];

// ─── Worker (maintenance staff) profile, schedule, checklists, history ───────
const WORKER_PROFILE = { id: 'W-1063', name: 'Grace Lim', initials: 'GL', color: '#2F7D4F', shift: 'AM · 06:00–14:00', zonesAssigned: 14 };

// What should be checked per zone type — drives the verification checklist
const CHECKLISTS = {
  Restroom:  ['Floors mopped and dry', 'Sinks and counters wiped', 'Soap and paper refilled', 'Bins emptied', 'Mirrors cleaned', 'Toilets sanitised'],
  Hallway:   ['Floors swept and mopped', 'Bins emptied', 'Walkway clear of obstruction', 'Lighting working'],
  Cafeteria: ['Tables and chairs wiped', 'Floors cleaned', 'Bins emptied', 'Spills cleared', 'Counters sanitised'],
  Classroom: ['Floors cleaned', 'Whiteboard wiped', 'Bins emptied', 'Desks arranged'],
  Lobby:     ['Floors cleaned', 'Glass and doors wiped', 'Bins emptied', 'Seating arranged'],
  Stairwell: ['Steps swept', 'Handrails wiped', 'Lighting working', 'No obstructions'],
  Parking:   ['Litter cleared', 'Bins emptied', 'Markings visible', 'Lighting working'],
  Study:     ['Tables wiped', 'Floors cleaned', 'Bins emptied', 'Chairs arranged'],
  Garden:    ['Litter cleared', 'Paths swept', 'Bins emptied', 'Plants watered'],
  Waste:     ['Bins emptied', 'Area hosed down', 'Liners replaced', 'No overflow'],
  _default:  ['Surface cleaned', 'Bins emptied', 'Area inspected', 'No hazards present'],
};
function checklistFor(type) { return CHECKLISTS[type] || CHECKLISTS._default; }

// Today's assigned route for Grace Lim
const WORKER_TASKS = [
  { id: 'T-0c', zoneId: 'Z-0455', zone: 'Waste Station · Dock B', type: 'Waste',     building: 'Engineering Complex', time: '07:20', window: 'done',  status: 'done', priority: 'Normal' },
  { id: 'T-0b', zoneId: 'Z-0118', zone: 'Corridor · 1F Rizal',    type: 'Hallway',   building: 'Rizal Hall',          time: '07:50', window: 'done',  status: 'done', priority: 'Normal' },
  { id: 'T-0a', zoneId: 'Z-0288', zone: 'Main Lobby',             type: 'Lobby',     building: 'Student Center',      time: '08:15', window: 'done',  status: 'done', priority: 'Normal' },
  { id: 'T-1',  zoneId: 'Z-0312', zone: 'Restroom · 2F East',     type: 'Restroom',  building: 'Rizal Hall',          time: '09:30', window: 'now',   status: 'due',  priority: 'High' },
  { id: 'T-2',  zoneId: 'Z-0612', zone: 'Corridor · 3F Science',  type: 'Hallway',   building: 'Science Wing',        time: '09:45', window: 'now',   status: 'due',  priority: 'Normal' },
  { id: 'T-3',  zoneId: 'Z-0510', zone: 'Study Area · Level 2',   type: 'Study',     building: 'Main Library',        time: '10:15', window: 'soon',  status: 'upcoming', priority: 'Normal' },
  { id: 'T-4',  zoneId: 'Z-0144', zone: 'Stairwell · West Core',  type: 'Stairwell', building: 'Engineering Complex', time: '10:30', window: 'soon',  status: 'upcoming', priority: 'Normal' },
  { id: 'T-5',  zoneId: 'Z-0333', zone: 'Classroom · 204',        type: 'Classroom', building: 'Rizal Hall',          time: '11:00', window: 'later', status: 'upcoming', priority: 'Normal' },
  { id: 'T-6',  zoneId: 'Z-0520', zone: 'Restroom · GF North',    type: 'Restroom',  building: 'Main Library',        time: '11:30', window: 'later', status: 'upcoming', priority: 'High' },
];

// Seed history (the already-done tasks earlier in the shift)
const WORKER_HISTORY_SEED = [
  { id: 'H-0a', zone: 'Main Lobby',          type: 'Lobby',   time: '08:15', outcome: 'Cleaned OK', items: 4, of: 4 },
  { id: 'H-0b', zone: 'Corridor · 1F Rizal', type: 'Hallway', time: '07:50', outcome: 'Cleaned OK', items: 4, of: 4 },
  { id: 'H-0c', zone: 'Waste Station · Dock B', type: 'Waste', time: '07:20', outcome: 'Needs Attention', items: 3, of: 4, note: 'Bin overflow — left 2 bags for pickup.' },
];

// ─── Analytics (daily counters + 14-day series) ──────────────────────────────
const KPI = {
  verifications: 312, cleanings: 287, alerts: 4, activeWorkers: 6,
};
const SERIES_14D = [218, 240, 233, 261, 198, 142, 130, 255, 271, 248, 290, 277, 305, 312];
const HEATMAP = BUILDINGS.map((b, i) => ({
  building: b,
  // hourly issue intensity 06:00–20:00 (15 buckets)
  hours: Array.from({ length: 15 }, (_, h) => {
    const base = [3, 1, 0, 2, 4, 5, 2, 1, 3, 6, 4, 2, 1, 0, 1][h];
    return Math.max(0, Math.round(base * [1.4, 0.7, 1.0, 1.6, 0.5, 0.9][i] + (h % 3 === 0 ? 1 : 0)));
  }),
}));
const HEAT_HOURS = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p'];

Object.assign(window, {
  CAMPUSES, BUILDINGS, WORKERS, ZONES, SEED_LOGS, LIVE_POOL, SEED_ALERTS,
  LOST_FOUND, LF_CATEGORIES, KPI, SERIES_14D, HEATMAP, HEAT_HOURS,
  WORKER_PROFILE, CHECKLISTS, checklistFor, WORKER_TASKS, WORKER_HISTORY_SEED,
});
