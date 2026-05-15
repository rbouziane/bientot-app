# Conventions de nommage

Tableaux de référence : fichiers, symboles, enums, constantes.

---

## Conventions de nommage

### Dossiers

**kebab-case**, tout en minuscules.

```
features/my-feature/
features/my-feature/components/
features/my-feature/enums/
```

### Fichiers

| Élément | Convention | Exemple |
|---|---|---|
| Composant | PascalCase | `ItemCard.tsx` |
| **Écran** | **kebab-case + suffixe `-screen`** | `catalog-screen.tsx` |
| Hook | camelCase, identique à la fonction | `useItemOptionsQuery.ts` |
| Fichier enum | PascalCase | `ItemOption.ts` |
| Fichier type | PascalCase | `ItemOptionData.ts` |
| Skeleton | préfixe `Skeleton` | `SkeletonItemCard.tsx` |
| API publique de feature | `index.ts` | `features/item/index.ts` |

> Les **écrans dérogent volontairement** à la règle PascalCase pour être visuellement distincts des composants dans l'arborescence.

### Symboles (fonctions, variables, types)

| Élément | Convention | Exemple |
|---|---|---|
| Composant | PascalCase | `ItemCard` |
| Hook | camelCase, commence par `use` | `useItemOptionsQuery` |
| Fonction API | camelCase + suffixe `Api` | `getItemOptionsApi` |
| Reducer | camelCase + suffixe `Reducer` | `itemOptionsReducer` |
| Type App | PascalCase | `ItemOption` |
| Type API | PascalCase + suffixe `Api` | `ItemOptionDataApi` |
| Type de params | PascalCase + suffixe `Params` | `UpdateItemParams` |
| Context | PascalCase + suffixe `Context` | `ItemModalContext` |

### Enums

**SCREAMING_SNAKE_CASE** pour le nom **et** les clés. Valeur string identique à la clé.

```ts
export enum SCREEN_NAME {
  ITEM_DETAIL = 'ITEM_DETAIL',
  CATALOG = 'CATALOG',
}

SCREEN_NAME.ITEM_DETAIL;
```

### Constantes (objets de constantes)

**SCREAMING_SNAKE_CASE** pour le nom **et** les clés.

```ts
export const CACHE_TIME = {
  HOUR_1: 1000 * 60 * 60,
  HOURS_6: 1000 * 60 * 60 * 6,
} as const;

CACHE_TIME.HOUR_1;
```
