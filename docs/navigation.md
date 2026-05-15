# Navigation

React Navigation : structure des stacks, typage des params, écrans, tabs, utilitaire centralisé.

---

## Navigation

### Localisation

- **Navigators** → `app/navigators/` (PascalCase, ex : `AppNavigator.tsx`, `ItemsStack.tsx`)
- **Écrans** → `features/X/screens/screen-name.tsx` (kebab-case + suffixe `-screen`)
- Constantes de noms d'écrans/stacks → `~shared/constants/Screen` (enums `SCREEN_NAME`, `STACK_NAME`)

### Règles générales

- Chaque stack/navigator est un composant `memo()` avec `export default` à la fin
- Naming :
  - Navigator racine → suffixe `Navigator` (ex : `AppNavigator`)
  - Sous-stacks → suffixe `Stack` (ex : `ItemsStack`)
- Navigation hors composant écran → **`NavigatorUtils`** (voir ci-dessous), jamais `useNavigation()`

### Typage des params (ParamList)

Chaque navigator **exporte son `XxxParamList`**. Les clés sont les valeurs de l'enum `SCREEN_NAME` / `STACK_NAME` (computed properties). Sans param → `undefined`. Avec params → objet typé inline.

```ts
export type ItemsStackParamList = {
  [SCREEN_NAME.ITEMS]: undefined;
  [SCREEN_NAME.ITEM_DETAIL]: {
    itemId: string;
  };
};

const Stack = createNativeStackNavigator<ItemsStackParamList>();
```

### Stack typique

```tsx
import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { themeScreen } from '~shared/theme/theme';
import { SCREEN_NAME } from '~shared/constants/Screen';
import { translate } from '~i18n/translate';
import { ScreenOptions } from './AppNavigator';
import ItemsScreen from '~features/items/screens/items-screen';
import ItemDetailScreen from '~features/items/screens/item-detail-screen';

export type ItemsStackParamList = {
  [SCREEN_NAME.ITEMS]: undefined;
  [SCREEN_NAME.ITEM_DETAIL]: {
    itemId: string;
  };
};

const Stack = createNativeStackNavigator<ItemsStackParamList>();

const ItemsStack = memo(() => {
  return (
    <Stack.Navigator initialRouteName={SCREEN_NAME.ITEMS}>
      <Stack.Group screenOptions={themeScreen.headerStyle}>
        <Stack.Screen
          name={SCREEN_NAME.ITEMS}
          options={ScreenOptions({
            title: translate('items.title'),
            showHelpButton: true,
          })}
          component={ItemsScreen}
        />
        <Stack.Screen
          name={SCREEN_NAME.ITEM_DETAIL}
          options={ScreenOptions({
            title: translate('items.detail'),
            showBackButton: true,
          })}
          component={ItemDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
});

export default ItemsStack;
```

### `screenOptions` centralisés

Factory `ScreenOptions({ title, showBackButton, showHelpButton })` exposée par `AppNavigator.tsx` et réutilisée par tous les stacks. Pour cacher le header / appliquer le style standard, utiliser `themeScreen.hideHeader` et `themeScreen.headerStyle` depuis `~shared/theme/theme`.

### Hiérarchie : auth, tabs, écrans profonds

Trois principes structurent toute la navigation :

1. **Séparation par état d'authentification** au niveau root (`TUNNEL_STACK` non connecté vs `CONNECTED_STACK` connecté)
2. **Tab navigator = écrans racines uniquement**. Chaque onglet est un mini-stack avec **un seul** écran (l'écran racine de l'onglet)
3. **Stack de détails séparée**, placée au même niveau que le tab navigator. Elle contient **tous** les écrans profonds. Conséquence : ils ne voient pas la tab bar **par construction** (pas besoin de la masquer manuellement)

```
AppNavigator (root stack)
├── TUNNEL_STACK              (utilisateur non connecté)
│   ├── LOGIN
│   ├── SIGNUP
│   └── ...
│
└── CONNECTED_STACK           (utilisateur connecté)
    ├── TAB_NAVIGATOR         (uniquement les écrans racines)
    │   ├── HomeTab     → HomeStack     → HOME
    │   ├── ItemsTab    → ItemsStack    → ITEMS
    │   └── AccountTab  → AccountStack  → ACCOUNT
    │
    └── DETAILS_STACK         (écrans profonds, sans tab bar par construction)
        ├── ITEM_DETAIL
        ├── ITEM_EDIT
        └── ...
```

**Règle stricte** : aucun écran de détail dans le tab navigator ou dans les mini-stacks d'onglet. Quand un nouvel écran est créé, choisir son emplacement selon ces règles :

- C'est l'écran racine d'un onglet → mini-stack de l'onglet
- C'est un écran de détail / sous-page accessible depuis n'importe où → `DETAILS_STACK`
- C'est un écran lié à l'auth (login, signup, mot de passe oublié) → `TUNNEL_STACK`

### Récupération des params dans un écran

Typage strict via `RouteProp` sur le `ParamList` du stack et la clé d'écran.

```tsx
import { useRoute, RouteProp } from '@react-navigation/native';

type ItemDetailRouteProp = RouteProp<
  ItemsStackParamList,
  SCREEN_NAME.ITEM_DETAIL
>;

const ItemDetailScreen = memo(() => {
  const route = useRoute<ItemDetailRouteProp>();
  const itemId = route.params.itemId;

  return <View />;
});
```

### `useNavigation` typé dans un écran

```tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ItemDetailNavigationProp = NativeStackNavigationProp<
  ItemsStackParamList,
  SCREEN_NAME.ITEM_DETAIL
>;

const navigation = useNavigation<ItemDetailNavigationProp>();
```

Hors d'un écran (services, hooks utilitaires, callbacks profonds) → utiliser **`NavigatorUtils`** (voir ci-dessous), jamais `useNavigation()`.

### Utilitaire de navigation centralisé

Toute navigation **hors composant écran** passe par une classe utilitaire `NavigatorUtils` qui wrappe le `navigationRef`. Ça permet :

- d'appeler `navigate()` / `goBack()` depuis n'importe où (services, reducers, hooks non-React, callbacks de libs natives)
- de centraliser les checks de sécurité (`isReady()`, `canGoBack()`)
- d'éviter les crashs si la navigation est appelée trop tôt (avant que le navigator soit monté)

```ts
// ~navigators/NavigatorUtils.ts
import { navigationRef } from '~navigators/navigation-utilities';

class NavigatorUtils {
  /**
   * Navigate to a screen by name with optional params.
   */
  static navigate(name: string, params?: Record<string, unknown>) {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.navigate({ name, params, merge: true } as never);
  }

  /**
   * Go back to the previous screen.
   */
  static goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }
}

export default NavigatorUtils;
```

Usage :

```ts
import NavigatorUtils from '~navigators/NavigatorUtils';

// ✅ Depuis un service, un hook, un callback natif…
NavigatorUtils.navigate(SCREEN_NAME.ITEM_DETAIL, { itemId: 'abc' });
NavigatorUtils.goBack();
```

Étendre la classe avec d'autres méthodes au besoin (`reset`, `popToTop`, `replace`…).

### Reset, popToTop, goBack

| Cas | Méthode |
|---|---|
| Retour à l'écran précédent | `goBack()` |
| Retour à la racine du stack courant | `popToTop()` |
| Réinitialiser la stack (ex : après login/logout) | `reset()` |

`reset()` empêche le retour en arrière — à utiliser après un changement d'état d'authentification ou de flow critique.
