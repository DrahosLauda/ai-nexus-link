/**
 * Unit testy rezervačného enginu (čistá logika `booking.ts`).
 *
 * Spustenie: `npm test` (Node natívny test runner + type-stripping, bez závislostí).
 * Pokrýva: generovanie slotov, krok, buffer, prekryv s rezerváciou, blackout,
 * minulosť/predstih, obedná prestávka (2 riadky) a časové pásmo (letný/zimný čas).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { computeFreeSlots, slotEndIso, type BookingService, type AvailabilityRow } from "./booking.ts";

// Pomocník: dostupnosť Po–Pia 09:00–17:00 (weekday 1–5).
const workweek = (start = "09:00", end = "17:00"): AvailabilityRow[] =>
  [1, 2, 3, 4, 5].map((weekday) => ({ weekday, start_time: start, end_time: end }));

// „Teraz" hlboko v minulosti, nech nič neodfiltruje predstih.
const PAST = new Date("2020-01-01T00:00:00Z");

const svc30: BookingService = { id: 1, duration_min: 30, buffer_min: 0, slot_step_min: 30 };

// 2026-03-16 je pondelok; zimný čas → Bratislava = UTC+1.
const MONDAY = "2026-03-16";

test("vygeneruje sloty krokom cez celé okno (30 min, 09–17, zima = UTC+1)", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: workweek(),
    bookings: [],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  // 8 hodín / 30 min = 16 slotov; prvý 09:00 local = 08:00 UTC, posledný 16:30 = 15:30 UTC.
  assert.equal(slots.length, 16);
  assert.equal(slots[0], "2026-03-16T08:00:00.000Z");
  assert.equal(slots[slots.length - 1], "2026-03-16T15:30:00.000Z");
});

test("cez víkend (žiadna dostupnosť pre weekday) → prázdne", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: workweek(),
    bookings: [],
    blackouts: [],
    date: "2026-03-15", // nedeľa
    now: PAST,
  });
  assert.deepEqual(slots, []);
});

test("slot_step_min < duration → prekrývajúce sa začiatky (krok 15, dĺžka 30)", () => {
  const svc: BookingService = { id: 2, duration_min: 30, buffer_min: 0, slot_step_min: 15 };
  const slots = computeFreeSlots({
    service: svc,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "10:00" }],
    bookings: [],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  // Okno 60 min, krok 15, dĺžka 30 → začiatky 09:00, 09:15, 09:30 (09:45 by končil 10:15 > okno).
  assert.deepEqual(slots, [
    "2026-03-16T08:00:00.000Z",
    "2026-03-16T08:15:00.000Z",
    "2026-03-16T08:30:00.000Z",
  ]);
});

test("buffer_min sa počíta do obsadeného bloku (dĺžka 30 + buffer 15)", () => {
  const svc: BookingService = { id: 3, duration_min: 30, buffer_min: 15, slot_step_min: 30 };
  const slots = computeFreeSlots({
    service: svc,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "10:00" }],
    bookings: [],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  // Blok = 45 min. Krok 30. 09:00 (→09:45 OK), 09:30 (→10:15 > okno) padá. Ostáva 09:00.
  assert.deepEqual(slots, ["2026-03-16T08:00:00.000Z"]);
  assert.equal(slotEndIso(slots[0], svc), "2026-03-16T08:45:00.000Z");
});

test("existujúca rezervácia vyradí prekrývajúce sloty (aj dotyk hrany prejde)", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "11:00" }],
    bookings: [
      // 09:30–10:00 local (zima = 08:30–09:00 UTC) obsadené.
      { start: "2026-03-16T08:30:00.000Z", end: "2026-03-16T09:00:00.000Z" },
    ],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  // Sloty 09:00,09:30,10:00,10:30. 09:30 padá (prekryv). Dotyk 10:00 (začína presne na konci) prejde.
  assert.deepEqual(slots, [
    "2026-03-16T08:00:00.000Z", // 09:00
    "2026-03-16T09:00:00.000Z", // 10:00
    "2026-03-16T09:30:00.000Z", // 10:30
  ]);
});

test("blackout blokuje sloty rovnako ako rezervácia", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "11:00" }],
    bookings: [],
    blackouts: [{ start: "2026-03-16T08:00:00.000Z", end: "2026-03-16T09:00:00.000Z" }],
    date: MONDAY,
    now: PAST,
  });
  // 09:00 a 09:30 local padnú (blackout 09:00–10:00 local), ostáva 10:00 a 10:30.
  assert.deepEqual(slots, ["2026-03-16T09:00:00.000Z", "2026-03-16T09:30:00.000Z"]);
});

test("minulosť a minimálny predstih odfiltrujú skoré sloty", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "11:00" }],
    bookings: [],
    blackouts: [],
    date: MONDAY,
    // „Teraz" = 09:10 local (08:10 UTC) + predstih 60 min → najskôr 10:10 local.
    // Okno 09–11 local (08–10 UTC): sloty 08:00,08:30,09:00,09:30 UTC → ostáva len 09:30 (10:30 local).
    now: new Date("2026-03-16T08:10:00.000Z"),
    minLeadMin: 60,
  });
  assert.deepEqual(slots, ["2026-03-16T09:30:00.000Z"]);
});

test("obedná prestávka: dva riadky dostupnosti rozdelia deň", () => {
  const slots = computeFreeSlots({
    service: svc30,
    availability: [
      { weekday: 1, start_time: "09:00", end_time: "10:00" },
      { weekday: 1, start_time: "13:00", end_time: "14:00" },
    ],
    bookings: [],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  // 09:00,09:30 a 13:00,13:30 local (zima UTC+1) → 08:00,08:30,12:00,12:30 UTC, zoradené.
  assert.deepEqual(slots, [
    "2026-03-16T08:00:00.000Z",
    "2026-03-16T08:30:00.000Z",
    "2026-03-16T12:00:00.000Z",
    "2026-03-16T12:30:00.000Z",
  ]);
});

test("časové pásmo: letný čas (DST) posunie UTC o hodinu viac", () => {
  // 2026-07-13 je pondelok; letný čas → Bratislava = UTC+2.
  const slots = computeFreeSlots({
    service: svc30,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "10:00" }],
    bookings: [],
    blackouts: [],
    date: "2026-07-13",
    now: PAST,
  });
  // 09:00 local v lete = 07:00 UTC (nie 08:00 ako v zime).
  assert.deepEqual(slots, ["2026-07-13T07:00:00.000Z", "2026-07-13T07:30:00.000Z"]);
});

test("slot_step_min null → krok = duration_min", () => {
  const svc: BookingService = { id: 4, duration_min: 60, buffer_min: 0, slot_step_min: null };
  const slots = computeFreeSlots({
    service: svc,
    availability: [{ weekday: 1, start_time: "09:00", end_time: "12:00" }],
    bookings: [],
    blackouts: [],
    date: MONDAY,
    now: PAST,
  });
  assert.equal(slots.length, 3); // 09,10,11 local
});
