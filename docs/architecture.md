# Architecture & Types

Structure du projet, règles de placement, conventions de typage.

---

## Architecture

### Arborescence racine

```
app/
├── api/          # Client HTTP + interceptors
├── features/     # Modules métier (voir ci-dessous)
├── navigators/   # Config navigation
├── shared/       # Tout le global : assets, components, constants, contexts, services, types, theme, skeleton, utils, form…
│   └── types/
│       └── api/  # Types bruts API (snake_case)
└── i18n/         # Traductions
```

### Module feature

```
features/my-feature/
├── index.ts         # API publique de la feature (voir plus bas)
├── assets/          # SVGs et images propres à la feature
├── components/      # Composants utilisés uniquement dans cette feature
├── contexts/        # Context providers scopés à la feature
├── enums/           # Enums propres à la feature
├── hooks/           # Hooks métier (UI, logique, hors data fetching)
├── services/
│   ├── api.ts       # Appels API, throw on error
│   ├── hook.ts      # Hooks data fetching
│   ├── reducer.ts   # Transform API → app
│   ├── types.ts     # Types Api de la feature
│   └── params.ts    # Types de paramètres (optionnel)
└── types/           # Types domaine de la feature
```

### Règles de placement

Le critère est l'**appartenance au domaine métier**, pas le nombre de features qui consomment le code.

- Composant **propre à un domaine métier** → reste dans `features/X/components/`, **même s'il est consommé par d'autres features**
  - Ex : `ItemCard` reste dans `features/item/`, même si `admin` l'utilise
- Composant **agnostique du domaine** (générique, réutilisable) → `shared/components/`
  - Ex : `Collapse`, `Button`, `Modal`
- Composant **hybride 2 domaines** → vit dans la feature dont c'est la **logique métier principale**, pas l'affichage
  - Ex : `AdminItemCard` (carte item avec logique admin) → `features/admin/`
  - Préférer la composition (children, slots) à un composant hybride quand c'est possible

Mêmes règles pour les **types**, **hooks** et **enums**.

#### Cas spécifique : hooks

- Hook lié à un domaine métier → `features/X/hooks/`
- Hook agnostique réutilisable (ex : `useDebounce`, `useKeyboard`, `useAppState`) → `shared/hooks/`
- Hook de **data fetching** (TanStack Query/Mutation) → toujours dans `features/X/services/hook.ts` (cf. `data-fetching.md`), **jamais** dans `hooks/`

### API publique d'une feature (`index.ts`)

Chaque feature expose un fichier `index.ts` à sa racine qui ré-exporte ce qui est consommable depuis l'extérieur. **Les imports cross-features passent obligatoirement par cet `index.ts`**, jamais par les chemins internes.

```ts
// features/item/index.ts
export { default as ItemCard } from './components/ItemCard';
export { useItem } from './services/hook';
export type { Item } from './types/Item';
```

```ts
// ✅ Depuis features/admin/
import { ItemCard } from '~features/item';

// ❌
import ItemCard from '~features/item/components/ItemCard';
```

Règles :
- Re-export simple, **pas de renommage** à l'export (le nom externe = le nom interne)
- Tout ce qui n'est pas dans `index.ts` est considéré comme **privé** à la feature
- À l'intérieur d'une feature, on importe par chemins relatifs ou alias internes — pas par `~features/X` (pas d'auto-référence)

### Règles de fichier

- **Un fichier = un composant** (pas de regroupement de plusieurs composants dans un même fichier)
- **Ordre dans un fichier composant** :
  1. Imports
  2. `type Props`
  3. Composant
  4. `StyleSheet.create()`
  5. `export default`

### Alias d'import

Tous les imports passent par `~` → `./app/` :

```ts
import { translate } from '~i18n/translate';
import { colors } from '~shared/theme/theme';
import api from '~api/api';
import { ItemCard } from '~features/item';
```

---

## Types

### Localisation

Le critère est l'**appartenance au domaine métier**, comme pour les composants.

| Type | Localisation | Convention |
|---|---|---|
| App (métier) — feature | `features/X/types/Item.ts` | camelCase fields |
| App (métier) — partagé | `app/shared/types/Item.ts` | camelCase fields |
| API — feature | `features/X/services/types.ts` | snake_case fields, suffixe `Api` |
| API — partagé | `app/shared/types/api/Item.ts` | snake_case fields, suffixe `Api` |

Les **reducers font le pont** entre les deux mondes (`XxxApi` → `Xxx`). Un type API ne doit **jamais** sortir de la couche `services/`. Un composant ne manipule que des types App.

### `type` vs `interface`

**`type` par défaut**, partout. Pas d'`interface` sauf cas justifié (ex : extension de classe, ce qui ne devrait pas arriver).

```ts
// ✅
type Item = {
  id: number;
  name: string;
};

// ❌
interface Item {
  id: number;
  name: string;
}
```

### Un fichier = un type principal

Un fichier contient **un type principal** + ses types **liés** (sous-structures qui ne sont jamais utilisées sans le type principal). Si un type est utilisé indépendamment ailleurs, il a son propre fichier.

```ts
// ✅ Item.ts — Item + ses sous-types liés
export type Item = {
  id: number;
  name: string;
  variants: ItemVariant[];
};

export type ItemVariant = {
  sku: string;
  price: number;
};
```

### Naming des sous-types de domaine

Préfixer les sous-types avec le nom du type parent pour grouper visuellement.

```ts
// ✅
type Item = { /* ... */ };
type ItemVariant = { /* ... */ };
type ItemOption = { /* ... */ };
type ItemCategory = { /* ... */ };

// ❌
type Item = { /* ... */ };
type Variant = { /* ... */ };
type Option = { /* ... */ };
```

### Enums plutôt qu'union de strings

Pour un ensemble de valeurs possibles, **toujours une enum**, jamais une union de strings.

```ts
// ✅
export enum ITEM_STATUS {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

type Item = {
  status: ITEM_STATUS;
};

// ❌
type Item = {
  status: 'pending' | 'shipped' | 'delivered';
};
```

### Champs nullables

Les valeurs absentes côté API arrivent en `null`. **Les conserver en `null` côté App**, ne pas les transformer en optionnel (`?: string`).

```ts
// API
type ItemApi = {
  description: string | null;
};

// ✅ App — on garde null
type Item = {
  description: string | null;
};

// ❌ App — pas de transformation en optionnel
type Item = {
  description?: string;
};
```

### Pas de `any`, pas d'`as`

- **`any` interdit** sauf le cas spécifique `catch (error: any)`
- Pour les valeurs non-typées (data brute avant validation), utiliser **`unknown`** et faire un type guard
- **`as` (type assertion) interdit** sauf cas justifié — préférer un type guard

```ts
// ❌
const data = response as Item;

// ✅
if (isItem(response)) {
  const data = response;
}
```

### Params de fonction / hook

- **1 argument** → positionnel
- **2+ arguments** → objet `params` typé avec un type dédié à suffixe `Params`

```ts
// ✅ 1 arg
export const useItemQuery = (itemId: number) => { /* ... */ };

// ✅ 2+ args
type UpdateItemParams = {
  itemId: number;
  fields: ItemFields;
};

export const useUpdateItemMutation = () => {
  return useMutation({
    mutationFn: (params: UpdateItemParams) => updateItemApi(params),
  });
};
```
