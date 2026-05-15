# REACT-NATIVE.md

Règles génériques pour tout projet React Native + TypeScript.
Spécificités projet (stack, versions, palette) → `CLAUDE.md`.

Documentation détaillée dans `docs/`. Lire le sous-fichier correspondant **avant** d'écrire du code dans son domaine.

---

## Index

| Sujet | Fichier | Quand le lire |
|---|---|---|
| Arborescence, placement, types | [`docs/architecture.md`](./docs/architecture.md) | Création de feature, nouveau fichier, type ou enum |
| Composants, code style, skeletons | [`docs/components.md`](./docs/components.md) | Création/édition de tout composant `.tsx` |
| Theming & design tokens | [`docs/theming.md`](./docs/theming.md) | Ajout de couleur, spacing, style de texte |
| Data fetching, gestion d'erreur | [`docs/data-fetching.md`](./docs/data-fetching.md) | Création de hook query/mutation, reducer, appel API |
| Navigation | [`docs/navigation.md`](./docs/navigation.md) | Ajout d'écran, stack, tab, navigation programmatique |
| Storage | [`docs/storage.md`](./docs/storage.md) | Lecture/écriture MMKV, persister TanStack |
| Listes, scroll, optimisation | [`docs/performance.md`](./docs/performance.md) | Création de liste, mémoïsation, perfs |
| i18n | [`docs/i18n.md`](./docs/i18n.md) | Ajout de string visible utilisateur |
| Conventions de nommage | [`docs/naming.md`](./docs/naming.md) | Tableau de référence à consulter au moindre doute |

---

## Règles non-négociables

À garder en tête en permanence, indépendamment du fichier consulté.

### Composants

- **Toujours `memo()`** sur tout composant
- **Jamais déstructurer les props** — toujours `props.xxx`
- **Pas de valeurs par défaut** sur les props (utiliser `?` pour optionnel)
- **Pas de styles inline** — `StyleSheet.create()` en bas du fichier
- **`export default` à la toute fin** du fichier

### Code

- **Accolades obligatoires** sur tout `if` / `else` / `for` / `while`
- **Early return** plutôt que `if/else` imbriqués, jamais d'`else` après un `return`
- **Pas de `any`** sauf `catch (error: any)`, **pas d'`as`** sauf cas justifié
- Le code doit **respirer** : lignes vides après imports, entre hooks non liés, avant `return`

### Imports

- Toujours via l'alias `~` (pointe vers `./app/`)
- Imports cross-features uniquement via l'`index.ts` de la feature, jamais par chemins internes

### Architecture

- **Tout le global vit dans `shared/`** (assets, components, constants, contexts, services, types, theme, utils)
- Critère de placement : **appartenance au domaine métier**, pas le nombre d'utilisateurs
- Un fichier = un composant / un type principal

### Performance

- Tout enfant `memo()` doit recevoir des **props à références stables** (`useMemo`, `useCallback` côté parent)
- **Animations via `react-native-reanimated`** uniquement (worklets UI thread)
- **Images via `react-native-fast-image`** (caching)
- **Mesurer avec Reactotron** avant d'optimiser

### Sécurité & qualité

- Storage = **MMKV chiffré** (clé Keychain), jamais AsyncStorage
- Toute erreur `console.error` + `crashlytics.recordError`
- Toute string visible utilisateur via `translate()`
