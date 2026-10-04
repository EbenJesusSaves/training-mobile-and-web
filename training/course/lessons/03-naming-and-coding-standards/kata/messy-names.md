# Kata · Rename the mess

**Time:** 10 minutes in pairs, then 5 minutes comparing as a room.
**Goal:** practise reading code against `CONVENTIONS.md`. Spotting the problem matters more than fixing it.

Each snippet below *works* (more or less). It just breaks most of the team's agreements. For each one:

1. List every problem you can find: file name, location, names, imports, values, and anything else that slows a reader down.
2. For each problem, name the rule in `CONVENTIONS.md` that it breaks. If no rule covers it, you may have found a new team rule.
3. Write the fixed file name and the new names. You don't need to rewrite the whole component.
4. Open the answer key, then compare with the real RailPass file.

Some problems belong to later lessons (styling, data fetching). Note them and tag them with the lesson that fixes them.

---

## 📱 Mobile · `mobile/components/JourneyItem.tsx`

```tsx
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDuration } from '../libs/format';
import React, { useState } from 'react';
import type { Journey } from '@/api/types';

export default function journeyItem(props: { j: Journey; n: number; click: (j: Journey, c: string) => void }) {
  const [open, setOpen] = useState(false);
  const d = props.j.durationMinutes;

  function clicked(c: string) {
    props.click(props.j, c);
  }

  return (
    <View style={{ backgroundColor: '#0B1F14', padding: 16, borderRadius: 12 }}>
      <Text style={{ color: '#fff', fontSize: 17 }}>
        {props.j.trainNumber} {props.j.trainName}
      </Text>
      <Text>{formatDuration(d)}</Text>
      {props.j.classes.map((c) => (
        <TouchableOpacity onPress={() => clicked(c.travelClass)}>
          <Text>{c.travelClass}</Text>
          {c.availableSeats < 10 && <Text>Few seats left</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

<details>
<summary>Answer key (mobile)</summary>

| # | Problem | Rule | Fix | Fixed in |
| --- | --- | --- | --- | --- |
| 1 | `JourneyItem.tsx` is PascalCase | Files are kebab-case | `journey-card.tsx` | 03 |
| 2 | Lives in `components/`, but only booking uses it | Feature code lives with its feature (lesson 02) | `mobile/features/booking/journey-card.tsx` | 02 |
| 3 | `export default` | Named exports only (default exports are for route files in `app/`) | `export const JourneyCard = …` | 03 |
| 4 | `journeyItem` starts lower-case | Components are PascalCase nouns. In JSX, React treats `<journeyItem />` as a built-in element, not your component | `JourneyCard` | 03 |
| 5 | Props typed inline; `j`, `n`, `click` say nothing | Name props for what they are; event props start with `on` | `interface JourneyCardProps { journey; passengers; onSelectClass }` | 03 |
| 6 | `c: string` for a travel class | Use the domain type | `travelClass: TravelClass` from `@/api/types` | 03 |
| 7 | `open` / `setOpen` is never used, and `open` doesn't read as a yes/no | Delete dead code; booleans read as questions | Remove it (or `isExpanded` if you need it) | 03 |
| 8 | `d` | Names say what the value is | `journey.durationMinutes`, passed straight to `formatDuration` | 03 |
| 9 | `clicked` | Handlers are verbs for what they do | Call `onSelectClass(journey, option.travelClass)` directly | 03 |
| 10 | Imports out of order; `../libs/format` is relative | Import groups; mobile uses the `@/` alias | Run `yarn --cwd mobile lint --fix`; import from `@/libs/format` | 03 |
| 11 | `10` seats is a magic number | No magic numbers | RailPass derives it instead: "too few" means fewer seats than `passengers` | 03 |
| 12 | `'#0B1F14'`, `'#fff'`, `16`, `12`, `17` | No hard-coded design values | Theme colours, `spacing`, `radii` and `AppText` variants | 05 |
| 13 | `Text` and `TouchableOpacity` instead of the design system | Reuse shared components | `AppText`, a `Pressable` row with `accessibilityRole="button"` | 06, 14 |
| 14 | `.map` without a `key` | Lists need stable keys | `key={option.travelClass}` | 06, 13 |

**Compare:** `mobile/features/booking/journey-card.tsx` in RailPass. Look at `ClassRow` there too: its booleans are
`soldOut` and `tooFew`. A reviewer applying our rule would suggest `isSoldOut` and `hasTooFewSeats`. The reference
isn't perfect either, and that's a normal review comment, not a failure.

</details>

---

## 🖥️ Dashboard · `dashboard/src/components/PassengerTable.tsx`

```tsx
import styles from './PassengerTable.module.css';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput } from '@mantine/core';
import axios from 'axios';

export default function PassengerTable() {
  const [data, setData] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/admin/passengers?pageSize=12&search=' + q).then((r) => {
      setData(r.data.items);
      setLoading(false);
    });
  }, [q]);

  const doIt = (id: string) => (window.location.href = '/passengers/' + id);

  return (
    <div className={styles.wrapper}>
      <TextInput value={q} onChange={(e) => setQ(e.currentTarget.value)} />
      {data.map((p) => (
        <div key={p.id} style={{ padding: 12 }}>
          <Text fw={800}>{p.fullName}</Text>
          <Text>GH₵ {(p.totalSpentCents / 100).toFixed(2)}</Text>
          <Button size="xs" onClick={() => doIt(p.id)}>
            Open
          </Button>
        </div>
      ))}
    </div>
  );
}
```

<details>
<summary>Answer key (dashboard)</summary>

| # | Problem | Rule | Fix | Fixed in |
| --- | --- | --- | --- | --- |
| 1 | `components/PassengerTable.tsx`: PascalCase, outside its feature | kebab-case files; feature pages are `-view.tsx` inside the feature | `dashboard/src/features/passengers/components/passengers-view.tsx` | 02, 03 |
| 2 | `export default` | Named exports only | `export function PassengersView()` | 03 |
| 3 | The CSS Module is imported first | Import groups: packages → relative → `.module.css` → side effects | Run `yarn --cwd dashboard lint --fix` | 03 |
| 4 | `any[]` | Type API data with the feature's types | `PassengerSummaryDto` from `features/passengers/types.ts` | 03, 08 |
| 5 | `q`, `r`, `p`, `data` | Names say what the value is | `search`, `response`, `passenger`, `passengers` | 03 |
| 6 | `loading`, `flag` | Booleans read as questions; delete what you don't use | `isLoading`; remove `flag` | 03 |
| 7 | `doIt` | Handlers are verbs for what they do | `openPassenger` | 03 |
| 8 | `12`, `800`, `padding: 12` | No magic numbers | `pageSizes.default`, `fontWeights.extraBold`, spacing tokens | 03, 05 |
| 9 | `(… / 100).toFixed(2)` repeats money formatting | One formatter for one job | `formatMoney(passenger.totalSpentCents)` from `shared/lib/format.ts` | 08 |
| 10 | Hard-coded `http://localhost:3000/api` | Environment values live in one module | The shared `api` client, which reads `env.apiUrl` | 01, 10 |
| 11 | `axios` + `useEffect` in a view: no error state, races between searches | Server state belongs to query hooks | `usePassengers(params)` from `passenger-queries.ts` with `passengerKeys` | 10 |
| 12 | `window.location.href` reloads the whole app | Navigate with the router | `const navigate = useNavigate()`, then `` navigate(`/passengers/${id}`) `` | 07 |
| 13 | Every keystroke fires a request | Debounce input that drives queries | `useDebouncedValue(search)` | 13 |

**Compare:** `dashboard/src/features/passengers/components/passengers-view.tsx` in RailPass. Every problem in this
table has a fix there, and some fixes arrive in later lessons. You'll meet each of them again.

</details>

---

## Debrief questions

- Which problems could a tool catch (linter, type checker, formatter), and which only a human reviewer?
- Which problem would hurt most on a team of ten? Which one would hurt most in a year?
- Did you find a problem that `CONVENTIONS.md` doesn't cover? Add it under "Our team rules".
