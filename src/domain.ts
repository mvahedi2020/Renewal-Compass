export const fixtureVersion = "account-1" as const;
export const options = [
  {
    id: "shared",
    name: "Shared export + operating bridge",
    days: 8,
    reach: 12,
    scope: "Reusable review export (6 days) + operating bridge (2 days).",
    excluded:
      "No custom dashboard, no delivery date, no premium support extension.",
    impact:
      "Preserves the 6-day shared accessibility milestone; export could help 12 fictional accounts.",
    dependency:
      "Discovery confirms export fields; bridge owner agrees; product lead approves capacity.",
    evidence: ["O1", "O2", "A1"],
  },
  {
    id: "bridge",
    name: "Operating bridge only",
    days: 2,
    reach: 1,
    scope: "Documented preparation workaround (2 days).",
    excluded: "No export automation or custom dashboard.",
    impact:
      "At the 14-day baseline, preserves the shared milestone and leaves 6 days available; manual work continues.",
    dependency: "Operations owner accepts recurring preparation burden.",
    evidence: ["O1", "A1"],
  },
  {
    id: "custom",
    name: "Account-specific dashboard",
    days: 14,
    reach: 1,
    scope: "Dedicated dashboard (14 days).",
    excluded:
      "No reusable export; shared accessibility work is outside this package.",
    impact:
      "At the 14-day baseline, exceeds the 8-day package budget by 6; assigning the full baseline cycle displaces the 6-day milestone for 12 accounts.",
    dependency:
      "Separate discovery, security review and additional approved capacity would be required.",
    evidence: ["O1", "A2"],
  },
] as const;
export type OptionId = (typeof options)[number]["id"];
export const observations = [
  {
    id: "O1",
    kind: "Observation",
    text: "Fictional workflow note: four reviewers manually combine three files before each review. This describes a process; it does not establish renewal causality.",
  },
  {
    id: "O2",
    kind: "Observation",
    text: "Fictional sample: 12 of 20 accounts use the same review fields. Reuse is plausible; adoption is untested.",
  },
  {
    id: "A1",
    kind: "Assumption",
    text: "A temporary operating bridge will be acceptable to the account team. Acceptance has not been obtained.",
  },
  {
    id: "A2",
    kind: "Assumption",
    text: "A custom dashboard would affect the renewal decision. No evidence confirms this.",
  },
] as const;
export type EvidenceId = (typeof observations)[number]["id"];
export type Draft = {
  option: OptionId;
  capacity: number;
  owner: string;
  reviewDate: string;
  conditions: string;
  note: string;
};
export const historyLimit = 98;
export function timing(d: Draft) {
  if (errors(d).some((issue) => issue.startsWith("Choose a valid review date")))
    return {
      classification: "date-unresolved",
      message:
        "Review timing is unresolved. Choose a valid review date before recording.",
    } as const;
  if (d.reviewDate >= "2026-11-28")
    return {
      classification: "renewal-window-missed",
      message:
        "Timing warning: review is at or after the November 28 renewal review. There is no advance review window; this late scenario does not imply a timely decision or retained renewal.",
    } as const;
  if (d.reviewDate > "2026-11-06")
    return {
      classification: "decision-deadline-missed",
      message:
        "Timing warning: review is after the November 6 decision deadline. Re-plan the decision timing; this scenario does not imply a timely commitment.",
    } as const;
  return {
    classification: "within-decision-window",
    message:
      "Review is within the November 6 decision window. Discovery and approval conditions remain unresolved.",
  } as const;
}
export type Snapshot = {
  id: number;
  draft: Draft;
  fixture: typeof fixtureVersion;
  option: (typeof options)[number];
  evidence: (typeof observations)[number][];
  budget: number;
  used: number;
  remaining: number;
  scope: string;
  exclusions: string;
  unresolved: string;
  schedule: ReturnType<typeof timing>;
  kind: "conditional-review";
};
export type Event =
  | { kind: "review"; snapshot: Snapshot }
  | { kind: "withdraw"; id: number; revision: number; reason: string };
export type State = {
  schema: 1;
  revision: number;
  draft: Draft;
  history: Event[];
};
export const initialDraft: Draft = {
  option: "shared",
  capacity: 14,
  owner: "Product lead (fictional)",
  reviewDate: "2026-11-06",
  conditions:
    "Confirm export fields with the account team; obtain capacity approval; agree an operating bridge owner before any delivery commitment.",
  note: "Renewal influence and workaround acceptance remain unknown.",
};
export const fresh = (): State => ({
  schema: 1,
  revision: 0,
  draft: { ...initialDraft },
  history: [],
});
export function calculation(d: Draft) {
  const option = options.find((o) => o.id === d.option)!;
  const budget = d.capacity - 6;
  return {
    budget,
    used: option.days,
    remaining: budget - option.days,
    feasible: budget >= option.days,
  };
}
export function errors(d: Draft): string[] {
  const result: string[] = [];
  if (!options.some((o) => o.id === d.option))
    result.push("Choose an available package.");
  if (!Number.isInteger(d.capacity) || d.capacity < 6 || d.capacity > 30)
    result.push("Capacity must be 6–30 whole team days.");
  if (!d.owner.trim()) result.push("Name a decision owner.");
  if (
    !/^2026-(11|12)-(0[1-9]|[12]\d|3[01])$/.test(d.reviewDate) ||
    Number.isNaN(Date.parse(d.reviewDate + "T00:00:00Z")) ||
    new Date(d.reviewDate + "T00:00:00Z").toISOString().slice(0, 10) !==
      d.reviewDate
  )
    result.push("Choose a valid review date in November or December 2026.");
  if (d.conditions.trim().length < 20)
    result.push("Describe the conditions in at least 20 characters.");
  if (d.note.trim().length < 10)
    result.push("Describe unresolved risks in at least 10 characters.");
  if (
    d.owner.length > 120 ||
    d.conditions.length > 1200 ||
    d.note.length > 1200
  )
    result.push("Shorten the decision text to the stated field limits.");
  return result;
}
export function snapshot(state: State): Snapshot {
  if (errors(state.draft).length || !calculation(state.draft).feasible)
    throw Error("Resolve package fit and required fields before review.");
  const option = options.find((o) => o.id === state.draft.option)!;
  const { budget, used, remaining } = calculation(state.draft);
  return JSON.parse(
    JSON.stringify({
      id: state.revision + 1,
      draft: state.draft,
      fixture: fixtureVersion,
      option,
      evidence: observations.filter((e) =>
        option.evidence.some((id) => id === e.id),
      ),
      budget,
      used,
      remaining,
      scope: option.scope,
      exclusions: option.excluded,
      unresolved: state.draft.note,
      schedule: timing(state.draft),
      kind: "conditional-review",
    }),
  ) as Snapshot;
}
export function active(s: State, id: number) {
  return (
    s.history.some((e) => e.kind === "review" && e.snapshot.id === id) &&
    !s.history.some((e) => e.kind === "withdraw" && e.id === id)
  );
}
export function record(s: State, reviewed: Snapshot): State {
  if (s.history.length >= historyLimit)
    throw Error(
      "History limit reached. Export reviewed records, then review a sample reset to begin again.",
    );
  if (JSON.stringify(snapshot(s)) !== JSON.stringify(reviewed))
    throw Error("The draft changed. Preview the current decision.");
  return {
    ...s,
    revision: s.revision + 1,
    history: [...s.history, { kind: "review", snapshot: reviewed }],
  };
}
export function withdraw(s: State, id: number): State {
  if (s.history.length >= historyLimit)
    throw Error(
      "History limit reached. Export reviewed records, then review a sample reset to begin again.",
    );
  if (!active(s, id)) throw Error("This decision is no longer active.");
  return {
    ...s,
    revision: s.revision + 1,
    history: [
      ...s.history,
      {
        kind: "withdraw",
        id,
        revision: s.revision + 1,
        reason:
          "Withdrawn from consideration; no external commitment was made.",
      },
    ],
  };
}
export function revise(s: State, draft: Draft): State {
  if (
    errors(draft).some(
      (e) => e.startsWith("Choose an available") || e.startsWith("Capacity"),
    )
  )
    throw Error("Invalid package inputs.");
  return { ...s, revision: s.revision + 1, draft: { ...draft } };
}
function exactKeys(v: unknown, keys: string[]): v is Record<string, unknown> {
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.keys(v).sort().join("|") === keys.sort().join("|")
  );
}
function draftValid(v: unknown): v is Draft {
  if (
    !exactKeys(v, [
      "option",
      "capacity",
      "owner",
      "reviewDate",
      "conditions",
      "note",
    ])
  )
    return false;
  return (
    options.some((o) => o.id === v.option) &&
    typeof v.capacity === "number" &&
    Number.isInteger(v.capacity) &&
    v.capacity >= 6 &&
    v.capacity <= 30 &&
    ["owner", "reviewDate", "conditions", "note"].every(
      (k) => typeof v[k] === "string" && (v[k] as string).length <= 1200,
    ) &&
    (v.owner as string).length <= 120
  );
}
export function parse(raw: string): State | null {
  try {
    const v: unknown = JSON.parse(raw);
    if (
      !exactKeys(v, ["schema", "revision", "draft", "history"]) ||
      v.schema !== 1 ||
      typeof v.revision !== "number" ||
      !Number.isSafeInteger(v.revision) ||
      v.revision < 0 ||
      !draftValid(v.draft) ||
      !Array.isArray(v.history) ||
      v.history.length > historyLimit
    )
      return null;
    let lastId = 0;
    const ids = new Set<number>();
    const withdrawn = new Set<number>();
    for (const e of v.history) {
      if (exactKeys(e, ["kind", "snapshot"]) && e.kind === "review") {
        const snap = e.snapshot;
        if (
          !exactKeys(snap, [
            "id",
            "draft",
            "fixture",
            "option",
            "evidence",
            "budget",
            "used",
            "remaining",
            "scope",
            "exclusions",
            "unresolved",
            "schedule",
            "kind",
          ]) ||
          typeof snap.id !== "number" ||
          !Number.isSafeInteger(snap.id) ||
          snap.id <= lastId ||
          snap.id > v.revision ||
          !draftValid(snap.draft)
        )
          return null;
        const expected = snapshot({
          schema: 1,
          revision: snap.id - 1,
          draft: snap.draft,
          history: [],
        });
        if (JSON.stringify(snap) !== JSON.stringify(expected)) return null;
        lastId = snap.id;
        ids.add(snap.id);
      } else if (
        exactKeys(e, ["kind", "id", "revision", "reason"]) &&
        e.kind === "withdraw" &&
        typeof e.id === "number" &&
        typeof e.revision === "number" &&
        Number.isSafeInteger(e.revision) &&
        e.revision > lastId &&
        e.revision <= v.revision &&
        ids.has(e.id) &&
        !withdrawn.has(e.id) &&
        e.reason ===
          "Withdrawn from consideration; no external commitment was made."
      ) {
        withdrawn.add(e.id);
        lastId = e.revision;
      } else return null;
    }
    if (v.history.length > v.revision) return null;
    return v as unknown as State;
  } catch {
    return null;
  }
}
export function exportBrief(s: Snapshot) {
  return JSON.stringify(
    {
      title:
        "Renewal Compass — fictional conditional review, not a delivery promise",
      ...s,
    },
    null,
    2,
  );
}
