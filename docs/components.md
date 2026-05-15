# Composants, code style & skeletons

Règles d'écriture des composants React Native, style général du code, et skeletons de chargement.

---

## Composants

### Règles obligatoires

- Toujours `memo()`, y compris pour les composants feuilles
- **Pas de comparateur custom dans `memo()`** — si les props ne sont pas stables, c'est au parent de les stabiliser (`useMemo`, `useCallback`)
- Props typées via un `type Props = { ... }` local
- **Jamais déstructurer les props** — toujours `props.xxx` pour la traçabilité
- **Pas de valeurs par défaut sur les props** — props optionnelles avec `?` uniquement
- `StyleSheet.create()` en bas du fichier — **jamais de styles inline statiques**
- Valeurs de thème uniquement depuis `~shared/theme/theme`
- `export default` à la **toute fin** du fichier

### Styles inline pour valeurs dynamiques

La règle "pas de styles inline" cible les **objets de style entiers en dur**. Quand une valeur dépend d'une prop ou du state (couleur tirée de la palette, taille calculée, position…), il est attendu de la passer inline **sur un composant natif RN** (`<View>`, `<Text>`, `<Pressable>`, `<ScrollView>`…) ou sur un composant qui accepte `style: StyleProp<...>`.

Le pattern canonique est l'array `[styles.foo, { propDynamique }]` : la base statique reste dans `StyleSheet`, seule la valeur variable est inline.

```tsx
// ✅ Dynamique sur composant natif : autorisé
<View style={[styles.card, { backgroundColor: color.light }]} />
<Text style={[styles.title, { color: themedColor }]}>{props.label}</Text>

// ❌ Style entier en dur inline
<View style={{ padding: 16, borderRadius: 8, backgroundColor: '#FFF' }} />
```

Pour un composant **custom** (non-natif), n'expose un prop `style` que si nécessaire. Préférer typer un prop sémantique (`tone`, `variant`, `color`) plutôt que laisser passer un style brut.

### Ordre des props

Dans le `type Props` **et** dans l'utilisation du composant, les props sont ordonnées :

1. **Données** (id, index, label, items…)
2. **État** (isLoading, isDisabled, isVisible…)
3. **Callbacks** (onPress, onChange, onSubmit…) — **toujours en dernier**

```ts
// ✅ Définition
type Props = {
  index: number;
  label: string;
  isDisabled?: boolean;
  onPress: () => void;
};
```

```tsx
// ✅ Utilisation
<ExampleComponent
  index={1}
  label="Valider"
  isDisabled={false}
  onPress={handlePress}
/>
```

### Children

Typer explicitement avec `ReactNode` :

```ts
type Props = {
  title: string;
  children: ReactNode;
};
```

### Un fichier = un composant (et ses sous-composants privés)

Règle générale : **un fichier exporte un seul composant public**. Le `export default` à la fin du fichier est ce composant.

**Exception autorisée** : des sous-composants `memo()` peuvent vivre dans le même fichier **uniquement** s'ils sont :

1. Utilisés exclusivement par le composant exporté (jamais consommés ailleurs).
2. Suffisamment petits pour ne pas mériter un fichier à part.
3. Au service de la lisibilité du composant principal (ex : décomposer une cellule de liste, isoler un sous-bloc visuel qui se répète localement).

Dès qu'un sous-composant est consommé ailleurs ou grossit (> ~50 lignes, plusieurs hooks, logique propre), il sort dans son propre fichier.

#### Ordre dans le fichier quand il y a des sous-composants

Quand le fichier contient des sous-composants, **le composant principal est en bas, juste avant `export default`**. Les sous-composants sont déclarés au-dessus, dans leur ordre d'utilisation. Raison : on lit le fichier de haut en bas, et le composant principal compose les briques définies au-dessus — on n'a pas besoin de "remonter" pour comprendre une référence.

```tsx
// ✅
type RowProps = { /* … */ };

const Row = memo((props: RowProps) => {
  return <View />;
});

type Props = { /* … */ };

const MyList = memo((props: Props) => {
  return (
    <View>
      <Row {...} />
    </View>
  );
});

const styles = StyleSheet.create({ /* … */ });

export default MyList;
```

```tsx
// ❌ parent en haut, sous-composant en bas
const MyList = memo((props: Props) => {
  return <Row />;
});

const Row = memo(() => <View />);

export default MyList;
```

### Pattern type

```ts
type Props = {
  userId: number;
  label: string;
  isDisabled?: boolean;
  onPress: () => void;
};

const ExampleComponent = memo((props: Props) => {
  const handlePress = useCallback(() => {
    props.onPress();
  }, [props.onPress]);

  const formattedLabel = props.label.toUpperCase();

  return (
    <View style={styles.container}>
      <Text>{formattedLabel}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
});

export default ExampleComponent;
```

### Fonctions dans le composant

- Toujours définies **avant le `return`**
- Wrappées dans `useCallback` **si** la fonction est prop d'un enfant `memo()`, dépendance d'un hook, ou passée à une liste (`renderItem`, `keyExtractor`). Pas de `useCallback` sur les fonctions utilisées uniquement en local. Voir [`docs/performance.md`](./performance.md#usecallback) pour les règles complètes.

```ts
// ✅
const handlePress = useCallback(() => {
  props.onPress(props.userId);
}, [props.onPress, props.userId]);

return <Pressable onPress={handlePress} />;
```

### Logique hors JSX

Extraire la logique dans des variables ou des fonctions **avant le `return`**. Le JSX doit rester déclaratif. Éviter les ternaires imbriqués et les calculs inline.

```tsx
// ✅
const isHighlighted = props.isSelected && !props.isDisabled;
const displayLabel = props.label || translate('common.noLabel');

return (
  <View style={isHighlighted ? styles.highlighted : styles.container}>
    <Text>{displayLabel}</Text>
  </View>
);

// ❌
return (
  <View style={props.isSelected && !props.isDisabled ? styles.highlighted : styles.container}>
    <Text>{props.label || translate('common.noLabel')}</Text>
  </View>
);
```

### Anti-patterns

```ts
// ❌ Déstructuration
const ExampleComponent = memo(({ title }: Props) => <Text>{title}</Text>);

// ✅
const ExampleComponent = memo((props: Props) => <Text>{props.title}</Text>);
```

```ts
// ❌ Valeur par défaut
const ExampleComponent = memo((props: Props) => {
  const label = props.label ?? 'Default';
  // ...
});

// ✅ Prop optionnelle, le composant gère l'absence
type Props = {
  label?: string;
};
```

```ts
// ❌ Fonction inline dans le JSX
return <Pressable onPress={() => props.onPress(props.id)} />;

// ✅ useCallback avant le return
const handlePress = useCallback(() => {
  props.onPress(props.id);
}, [props.onPress, props.id]);

return <Pressable onPress={handlePress} />;
```

---

## Code style

### Accolades obligatoires

Toujours des accolades sur `if`, `else`, `for`, `while`. **Pas de single-line**.

```ts
// ✅
if (value == null) {
  return null;
}

// ❌
if (value == null) return null;
```

### Early return

Préférer les early returns aux `if/else` imbriqués. **Pas de `else` après un `return`**.

```ts
// ✅
if (!item) {
  return null;
}

return <Profile item={item} />;

// ❌
if (user) {
  return <Profile item={item} />;
} else {
  return null;
}
```

### Déclarations

- `const` par défaut
- `let` uniquement si réassignation
- **Jamais `var`**

### Égalité

- `===` et `!==` par défaut
- `== null` autorisé pour check `null` + `undefined` simultanément

```ts
// ✅
if (value === 0) { ... }
if (value == null) { ... }   // null OR undefined

// ❌
if (value == 0) { ... }
```

### Espacement horizontal

- Espace après les mots-clés (`if`, `for`, `while`, `return` suivis d'une parenthèse)
- Espace autour des opérateurs (`=`, `===`, `+`, `&&`, etc.)
- Espace après chaque virgule

```ts
// ✅
if (value) { ... }
const x = 1 + 2;
foo(a, b, c);

// ❌
if(value){ ... }
const x=1+2;
foo(a,b,c);
```

### Espacement vertical

Le code doit **respirer**. Lignes vides obligatoires aux endroits suivants :

1. **Après les imports**, avant le premier `type` / `const`
2. **Après `type Props`**, avant le composant
3. **Entre des hooks non liés** dans un composant (regrouper les hooks liés, séparer le reste)
4. **Avant `return`**
5. **Entre les blocs logiques** d'une fonction (déclarations / transformations / retour)
6. **Avant et après `StyleSheet.create()`**

**Pas de ligne vide entre les imports.** Tous les `import` sont collés les uns aux autres, peu importe leur origine (externe, alias `~`, relatif). Le bloc imports est compact, suivi d'une seule ligne vide avant le code.

**Pas de ligne vide à l'intérieur du JSX.** Les éléments frères dans un `return (...)` sont collés. Pas de saut de ligne entre deux `<View>`, entre une condition `{cond && (...)}` et le bloc suivant, etc. La structure visuelle vient de l'indentation, pas des blancs.

```ts
import { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '~shared/theme/theme';

type Props = {
  userId: number;
  onPress: () => void;
};

const ExampleComponent = memo((props: Props) => {
  const { data } = useQuery(...);
  const { mutate } = useMutation(...);

  const [isOpen, setIsOpen] = useState(false);

  const handlePress = useCallback(() => {
    props.onPress();
  }, [props.onPress]);

  return (
    <View style={styles.container}>
      <Text>{data?.name}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
});

export default ExampleComponent;
```

---

## Skeletons

### Localisation

Même règle que pour les composants (cf. section 1) : le critère est l'**appartenance au domaine métier**.

- **Skeleton métier** (mirror d'un composant de feature) → vit **à côté de son composant** dans la feature
  - `features/item/components/ItemCard.tsx`
  - `features/item/components/SkeletonItemCard.tsx`
- **Skeleton générique** (primitive réutilisable) → `shared/components/`
  - `shared/components/SkeletonText.tsx`
  - `shared/components/SkeletonAvatar.tsx`
  - `shared/components/SkeletonCircle.tsx`

Avantage : un skeleton de feature reste collé à son composant — si on modifie la card, on voit immédiatement le skeleton juste à côté.

### Règles

- Préfixe **`Skeleton`** sur le fichier et le composant
- `SkeletonPlaceholder` avec `width` / `height` **explicites** (jamais `flex: 1` seul)
- Couleurs depuis `~shared/theme/theme` (`colors.gray_200`, `colors.placeholder_hightlight`)
- Suit toutes les règles composants (cf. section 2) : `memo()`, pas de déstructuration, `StyleSheet` en bas, `export default` à la fin

### Pattern

```ts
import { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '~shared/theme/theme';

const SkeletonItemCard = memo(() => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      speed={2000}
      backgroundColor={colors.gray_200}
      highlightColor={colors.placeholder_hightlight}
    >
      <SkeletonPlaceholder.Item width={120} height={16} borderRadius={2} />
    </SkeletonPlaceholder>
  );
});

export default SkeletonItemCard;
```
