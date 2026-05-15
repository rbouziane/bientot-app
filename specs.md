# Spec — App de compte à rebours (React Native)

> Document de référence pour Claude Design. Toutes les valeurs (couleurs, espacements, typographie, comportements) sont des points de départ — à itérer en design.

> 🚨 **Pour toute écriture de code** : lecture obligatoire et préalable du fichier `REACT-NATIVE.md` (et de ses sous-fichiers). Voir §2.0. Cette spec ne dispense jamais de respecter `REACT-NATIVE.md`.

---

## 1. Vision & positionnement

### 1.1 Concept
Une application mobile minimaliste qui permet à l'utilisateur de **suivre visuellement le temps qui le sépare de dates importantes** (anniversaires, concerts, rendez-vous, voyages, deadlines, etc.).

Le cœur de l'expérience est sur **l'écran d'accueil du téléphone** via des widgets natifs. L'app elle-même sert à créer, organiser et personnaliser les comptes à rebours.

**Contexte projet** : développement **solo** par Ronan. La spec et la roadmap tiennent compte de cette réalité (priorisation serrée, pas de complexité d'équipe, scope V1 ambitieux mais réaliste pour une personne).

### 1.2 Principes de design
- **Premium, propre, calme** — pas de gradients criards, pas d'effets gratuits
- **Restraint visuel** — beaucoup de blanc/espace, typographie soignée, ombres très discrètes
- **Personnalisable sans devenir le bazar** — l'utilisateur choisit couleur + icône, mais le système impose une cohérence (rule : icône toujours dans la même famille chromatique que le fond)
- **Le widget est le héros** — l'app doit valoriser ce qui se passe en dehors d'elle

### 1.3 Nom & langues
- **Nom validé : Bientôt** (FR). Universel, chaleureux, mémorable, dispo sur l'App Store.
- Storyline marketing : *"Bientôt. Le compte à rebours pour tout ce qui compte."*
- i18n dès le V1 : **français (par défaut)**, **anglais**, **espagnol**
- En EN/ES, le nom de l'app reste **Bientôt** (mot français adopté). Tous les autres textes passent par `translate()` (cf. §5quater)
- Utilisation de **react-native-localize** pour détecter la langue système au premier lancement

### 1.4 Monétisation
- **Achat unique à vie** : **4,99 €** (prix cible, positionnement premium accessible)
- **Prix de lancement** : **3,99 €** pendant les **4 premières semaines** après publication. Communiqué comme "Tarif de lancement" dans le paywall et les notes de version. Passe automatiquement à 4,99 € à J+28.
- Pas d'abonnement, pas de pub, pas de tier intermédiaire
- Version gratuite fonctionnellement limitée (voir §7)
- IAP via **react-native-iap** (StoreKit 2 + Play Billing v6)
- Le prix se gère côté App Store Connect / Play Console, **pas dans le code** — possibilité d'ajuster sans release après le launch

### 1.5 Règles métier critiques

#### 1.5.1 Progress bar — règle "fenêtre glissante 1 an"
La progress bar visualise la proximité à la date cible. Pour rester lisible quelle que soit l'échéance :

- **Si `targetDate - now > 365 jours`** : la barre reste à **0%** (l'event est trop loin pour que le remplissage soit perceptible)
- **Si `targetDate - now ≤ 365 jours`** : fill = `1 - (joursRestants / 365)`, donc :
  - À 365j : 0% (la barre commence à se remplir)
  - À 180j : ~50%
  - À 7j : ~98%
  - À 0j (jour J) : 100% + petite animation pulsation
- **Si `targetDate - now < 0`** (événement passé) :
  - Non-récurrent → la barre reste à 100% figée, l'event bascule dans l'onglet "Passés"
  - Récurrent → recalcul automatique de la prochaine occurrence, la barre se réinitialise

Cette règle garantit qu'un event créé 3 ans à l'avance ne paraît pas figé pendant 2 ans.

#### 1.5.2 Gestion du temps & des fuseaux horaires
- À la création, on stocke `targetDate` en **ISO 8601 avec fuseau horaire de création** (ex. `2026-12-25T00:00:00+01:00`)
- Champ "heure" **optionnel** : si l'utilisateur ne le renseigne pas, on met `00:00` dans le fuseau de création (cas anniversaire)
- L'affichage du compte à rebours utilise toujours **le fuseau horaire actuel du téléphone**, recalculé à chaque rendu
- Conséquence souhaitée : si l'user voyage à Tokyo, "12 jours" reste cohérent par rapport à minuit "heure de Paris" (la date de création garde le sens initial de l'event)
- Tous les calculs de durée se font via `date-fns` + `date-fns-tz` pour la gestion propre des DST

#### 1.5.3 Comportement à l'échéance & au-delà
- **Au moment du jour J** : notification (selon config), petite animation confetti dans l'app si l'user ouvre l'écran de détail
- **Après l'échéance** :
  - **Event non-récurrent** : reste visible mais bascule dans un onglet/filtre **"Passés"** (séparé de la liste principale). Affichage : `"Il y a X jours"`. L'utilisateur peut le supprimer manuellement.
  - **Event récurrent** : auto-reschedule transparent à la prochaine occurrence (ex. anniversaire → reset l'année d'après). Pas de trace dans "Passés", car la date est conceptuellement vivante.

#### 1.5.4 Limite de longueur du titre
- **40 caractères max** côté app (input bloqué au-delà)
- Affichage tronqué selon le contexte :
  - Liste : ~30 caractères (1 ligne)
  - Widget Small : ~18 caractères
  - Widget Medium : ~24 caractères
  - Widget Large : ~32 caractères
- Détail event : pas de troncature, le titre wrap sur 2 lignes max

---

## 2. Architecture technique

### 2.0 ⚠️ Règles de code obligatoires — `REACT-NATIVE.md`

**Avant toute écriture de code, le fichier `REACT-NATIVE.md` (et tous ses sous-fichiers référencés) doit être lu, compris et respecté intégralement.**

Ce fichier est la **source de vérité** pour :
- Les conventions du langage TypeScript (typage strict, naming, structure des types)
- Les bonnes pratiques React Native spécifiques au projet (hooks, composants, perf)
- L'organisation des fichiers et le découpage des features
- Les règles de style (formatting, ESLint, Prettier)
- Les patterns d'animations (Reanimated worklets, gesture handlers)
- Les patterns d'état (TanStack Query, sélecteurs, persistence)
- Les règles de tests (Jest, RNTL)
- Tout autre point que Ronan a déjà codifié

**Règles d'application** :
1. **Priorité maximale** : en cas de conflit entre cette spec et `REACT-NATIVE.md`, `REACT-NATIVE.md` gagne toujours pour tout ce qui concerne le code.
2. **Non négociable** : ce fichier ne peut pas être contourné, même pour gagner du temps. Si une règle semble bloquante, en discuter avec Ronan plutôt que de la contourner.
3. **Lecture obligatoire avant de commencer** une feature, et relecture des sous-fichiers concernés avant chaque nouveau module.
4. **Les sous-fichiers référencés** dans `REACT-NATIVE.md` ont le même statut obligatoire que le fichier principal. Ils doivent être ouverts et lus dès qu'ils sont mentionnés pour la zone de code concernée.
5. **Toute review de code** (humaine ou IA) vérifie la conformité à `REACT-NATIVE.md` en premier critère, avant de regarder la logique métier.

**Emplacement attendu** : à la racine du projet, à côté du `README.md`. Versionné dans le repo. Toute modification de ce fichier passe par une PR dédiée (pas mélangée avec du code feature).

> 💡 Pour Claude Design : la spec UI peut être conçue sans connaître ce fichier, mais **toute traduction de design en code** doit ensuite passer par sa relecture. Les composants RN produits doivent suivre ses conventions.

### 2.1 Stack
- **React Native CLI** (bare, **pas Expo**) + **New Architecture** (Fabric + TurboModules)
- **TypeScript** strict (cf. `REACT-NATIVE.md`)
- **TanStack Query v5** comme source unique de vérité pour les données events (queries + mutations + persister MMKV). Pas de Zustand, pas de Redux, pas de Context fourre-tout. Les events sont une **query persistée localement** ; les CRUD sont des **mutations avec optimistic updates** (cf. `data-fetching.md`)
- **react-native-reanimated v3+** pour toutes les animations (worklets UI thread, cf. `performance.md`)
- **react-native-gesture-handler** pour les interactions (et son `ScrollView` à utiliser systématiquement, jamais celui de `react-native`)
- **react-native-mmkv** avec **chiffrement Keychain** (pattern fallback → secure, cf. `storage.md`)
- **@shopify/flash-list v2** pour la liste home (cf. `performance.md`)
- **react-native-fast-image** pour toutes les images (caching)
- **react-native-keychain** pour stocker la clé de chiffrement MMKV
- **date-fns** + **date-fns-tz** pour calculs de dates + fuseaux horaires
- **i18n-js** + helper `translate()` maison (cf. `i18n.md`) — pas de `i18next` (plus lourd, on n'a pas besoin de plugins)
- **react-native-localize** pour la détection langue système
- **@notifee/react-native** pour les notifications locales
- **react-native-haptic-feedback** pour les retours haptiques
- **react-native-iap** pour l'achat unique (StoreKit 2 iOS + Play Billing v6 Android)
- **react-native-svg** pour illustrations & progress bars circulaires
- **react-native-skeleton-placeholder** pour les états de chargement
- **react-native-view-shot** pour le partage image (génération PNG d'une card)
- **@react-navigation/native** + **@react-navigation/native-stack** + **@react-navigation/bottom-tabs** (architecture nav cf. `navigation.md`)
- **Reactotron** en développement pour identifier re-renders et calculs coûteux

> ⚠️ Toute lib ajoutée doit être validée selon les critères définis dans `REACT-NATIVE.md` (maintenance, perf, taille bundle, compat New Architecture).

### 2.2 Architecture des dossiers
Structure conforme à `architecture.md` : un dossier par feature, code transverse dans `shared/`, alias `~` → `./app/`.

```
/app
  /api                                  # client HTTP (vestigial — pas d'API distante en V1)
  /features
    /events                             # CRUD countdowns
      assets/
      components/
        EventCard.tsx
        SkeletonEventCard.tsx
        EventForm.tsx
        ColorPicker.tsx
        IconPicker.tsx
      contexts/
      enums/                            # EVENT_STATUS, RECURRENCE, etc.
      hooks/                            # useTimeUntil, useEventProgress
      services/
        api.ts                          # lecture/écriture MMKV (joue le rôle d'API)
        hook.ts                         # useEventsQuery, useCreateEventMutation, etc.
        reducer.ts                      # EventApi → Event
        types.ts                        # EventApi, EventInputApi
      screens/
        events-list-screen.tsx
        event-detail-screen.tsx
        event-create-screen.tsx
        event-edit-screen.tsx
        events-passed-screen.tsx
      types/                            # Event, EventInput
      index.ts                          # API publique

    /groups                             # groupes (Premium)
      services/
      types/
      index.ts

    /widgets                            # config widget côté app
      components/
        WidgetPreview.tsx
        WidgetTutorial.tsx
      hooks/
        useWidgetSync.ts                # appel TurboModule à chaque mutation event
      services/
        bridge.ts                       # wrap du TurboModule natif
      screens/
        widgets-config-screen.tsx
      index.ts

    /paywall
      components/
        PaywallCard.tsx
      hooks/
        usePremiumQuery.ts              # query StoreKit/Play Billing
        usePurchasePremiumMutation.ts
        useRestorePurchaseMutation.ts
      services/
        api.ts                          # wrap react-native-iap
        hook.ts
        types.ts
      screens/
        paywall-screen.tsx
      types/
      index.ts

    /settings
      components/
      screens/
        settings-screen.tsx
      index.ts

    /about                              # page À propos (§5.9)
      screens/
        about-screen.tsx
      index.ts

    /help                               # page Dépannage & contact (§5.10)
      components/
        FaqAccordion.tsx
        ContactButton.tsx
      hooks/
        useDeviceMetadata.ts            # remplit auto les metadata du mailto
        usePublicRoadmapQuery.ts        # fetch JSON distant
      screens/
        help-screen.tsx
      index.ts

    /onboarding
      components/
        OnboardingSlide.tsx
      screens/
        onboarding-screen.tsx
      index.ts

  /navigators
    AppNavigator.tsx                    # root, gère TUNNEL_STACK vs CONNECTED_STACK (ici toujours connecté)
    TabNavigator.tsx                    # bottom tabs : Home / Widgets / Settings
    HomeStack.tsx                       # mini-stack onglet Home (1 écran racine)
    WidgetsStack.tsx
    SettingsStack.tsx
    DetailsStack.tsx                    # tous les écrans profonds (sans tab bar par construction)
    NavigatorUtils.ts                   # nav hors composants
    navigation-utilities.ts             # navigationRef
    screen-options.ts                   # factory ScreenOptions()

  /shared
    /assets
    /components                         # composants agnostiques (Button, Modal, Collapse, SkeletonText…)
    /constants
      Screen.ts                         # enum SCREEN_NAME, STACK_NAME
      Storage.ts                        # enum STORAGE_KEY
      QueryKey.ts                       # enum QUERY_KEY
      CacheTime.ts                      # CACHE_TIME.HOUR_1, etc.
      Palette.ts                        # palette d'event (donnée métier — voir §3)
      IconConcepts.ts                   # mapping concept → SF/Material
    /contexts
    /hooks                              # hooks transverses (useDebounce, useKeyboard, useAppState)
    /storage
      mmkv.ts                           # pattern fallback → secure (cf. storage.md)
      encryption.ts                     # clé Keychain
      persister.ts                      # clientPersister TanStack Query
    /services
      crashlytics.ts                    # wrapper recordError
      logger.ts                         # logError, conditionné __DEV__
    /types                              # types métier transverses
      /api                              # types API transverses (rares en V1, pas d'API distante)
    /theme                              # tokens sémantiques (cf. §3.4)
      index.ts                          # export agrégé
      colors.ts                         # colors sémantiques (background, surface, textPrimary…)
      spacing.ts                        # spacing + radius
      typography.ts
      style.ts                          # presets transverses (shadows…)
    /utils
      date.ts                           # timeUntil, progressFor, formatCountdown
      paletteResolver.ts                # ColorKey → { light, dark }
      iconResolver.ts                   # IconRef → composant natif

  /i18n
    translate.ts
    fr.json
    en.json
    es.json

/ios
  /Bientot                              # app principale (ASCII pour Xcode)
  /BientotWidget                        # extension widget (target séparée)
    BientotWidgetBundle.swift
    SingleEventWidget.swift             # Mode A
    GroupEventWidget.swift              # Mode B
    Provider.swift                      # TimelineProvider partagé
    SharedStore.swift                   # lecture du JSON depuis App Group
    Models.swift                        # mirror des types TS
  /Shared
    WidgetBridge.swift                  # TurboModule appelé depuis JS
    WidgetBridge.m                      # exposition Obj-C
  Bientot.xcodeproj
  Podfile

/android
  /app/src/main
    /java/com/bientot
      MainApplication.kt
      MainActivity.kt
      /widgets
        SingleEventWidget.kt            # Mode A — Glance
        GroupEventWidget.kt             # Mode B — Glance
        WidgetReceiver.kt
        SharedStore.kt                  # lecture SharedPreferences
        Models.kt
      /bridge
        WidgetBridgeModule.kt           # TurboModule
        WidgetBridgePackage.kt
    /res
      /xml
        widget_single_info.xml
        widget_group_info.xml
```

**Règles critiques** (cf. `architecture.md`) :
- Tout import cross-feature passe par l'**`index.ts`** de la feature ciblée. Jamais d'accès direct aux chemins internes.
- À l'intérieur d'une feature, imports relatifs ou alias internes — **pas** d'auto-référence via `~features/X`.
- Un fichier = un composant. Ordre dans le fichier : imports → `type Props` → composant → `StyleSheet.create()` → `export default`.
- Composants en `PascalCase.tsx`, écrans en `kebab-case-screen.tsx`, hooks en `useXxx.ts` (cf. `naming.md`).

### 2.3 Modèle de données

Conformément à `architecture.md`, on distingue les types **App** (camelCase, manipulés dans l'app) des types **Api** (snake_case, suffixe `Api`, utilisés pour la sérialisation widget natif et pour les futures syncs cloud). Un **reducer** fait le pont.

> En V1 il n'y a pas d'API distante : la "couche API" est le **stockage MMKV + le JSON partagé widget**. Le pattern reste cohérent pour la V2 (sync cloud).

#### Types App (manipulés partout dans l'app)

```ts
// features/events/types/IconRef.ts
export type IconRef =
  | { family: 'concept'; concept: IconConcept }
  | { family: 'emoji'; value: string };

// features/events/enums/RECURRENCE.ts
export enum RECURRENCE {
  NONE = 'NONE',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
}

// features/events/types/Event.ts
export type Event = {
  id: string;
  title: string;
  targetDate: string;              // ISO 8601 + tz
  createdAt: string;
  icon: IconRef;
  colorKey: ColorKey;
  recurrence: RECURRENCE;
  notes: string | null;
  notification: EventNotification | null;
  groupId: string | null;
};

export type EventNotification = {
  enabled: boolean;
  offsets: number[];               // minutes avant l'événement
};

// features/groups/types/Group.ts
export type Group = {
  id: string;
  name: string;
  colorKey: ColorKey;
};
```

#### Types Api (utilisés pour le JSON partagé widget)

```ts
// features/events/services/types.ts
export type EventApi = {
  id: string;
  title: string;
  target_date: string;
  created_at: string;
  icon: IconRefApi;
  color_key: string;
  recurrence: string;
  notes: string | null;
  notification: EventNotificationApi | null;
  group_id: string | null;
};

export type IconRefApi =
  | { family: 'concept'; concept: string }
  | { family: 'emoji'; value: string };

export type EventNotificationApi = {
  enabled: boolean;
  offsets: number[];
};
```

#### Reducer

```ts
// features/events/services/reducer.ts
export const eventReducer = (data: EventApi): Event => {
  if (data.id == null || data.title == null || data.target_date == null) {
    throw new Error('Invalid event payload');
  }

  return {
    id: data.id,
    title: data.title,
    targetDate: data.target_date,
    createdAt: data.created_at,
    icon: data.icon,
    colorKey: data.color_key as ColorKey,
    recurrence: data.recurrence as RECURRENCE,
    notes: data.notes,
    notification: data.notification,
    groupId: data.group_id,
  };
};

export const eventsReducer = (data: EventApi[]): Event[] => data.map(eventReducer);
```

**Note** : les champs absents arrivent en `null` (jamais `undefined`/optionnel), conformément à `architecture.md`.

### 2.4 Stockage & accès aux données

#### Architecture en couches

```
┌─────────────────────────────────────────────────────────┐
│  Composants / écrans                                    │
│  ↓ utilisent les hooks                                  │
│  Hooks (services/hook.ts)                               │
│  ↓ wrapper TanStack Query / Mutation                    │
│  api.ts (lecture/écriture MMKV) + reducer.ts            │
│  ↓                                                       │
│  ┌──────────────────────┐    ┌────────────────────────┐ │
│  │ MMKV chiffré         │    │ App Group / SharedPref │ │
│  │ (clé Keychain)       │ →  │ (en clair, accessible  │ │
│  │ Source de vérité     │    │ par les widgets natifs)│ │
│  └──────────────────────┘    └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### MMKV chiffré côté app
Pattern **fallback → secure** conforme à `storage.md` :
1. Au boot, instance MMKV **non chiffrée** (`fallback-mmkv`) disponible immédiatement
2. En parallèle, récupération de la clé Keychain (256 bits, générée à la première ouverture) via `react-native-keychain`
3. Création de l'instance **chiffrée** (`secure-mmkv`)
4. Migration transparente des données du fallback vers le chiffré
5. À partir de là, `getMMKV()` retourne l'instance chiffrée

Les composants utilisent `getMMKV()` de manière synchrone sans se soucier de l'attente — le fallback assure que ça marche dès le premier render.

#### App Group / SharedPreferences en clair pour le widget

> **Décision architecturale** : les events sont écrits en clair dans le stockage partagé widget (App Group iOS / SharedPreferences Android). Justification : les events ne sont pas des données sensibles (pas de PII, pas d'identifiants, pas de tokens) ; le widget natif tourne dans un process séparé qui ne peut pas accéder transparentement au Keychain de l'app. Le compromis sécurité est minime et permet un widget fonctionnel sans contournement complexe.

À chaque mutation event :
1. La mutation TanStack écrit la nouvelle liste dans MMKV chiffré (source de vérité)
2. Un sélecteur de synchro déclenche `WidgetBridge.syncCountdowns(payload)` avec le JSON sérialisé (types `Api`)
3. Le module natif écrit ce JSON dans le App Group / SharedPreferences en clair
4. Le widget natif lit ce JSON dans son `TimelineProvider` et rafraîchit

Tout autre stockage (futurs tokens d'auth si V2, paramètres sensibles) reste exclusivement dans MMKV chiffré, jamais dans le App Group.

#### TanStack Query persisté

Le cache TanStack Query est persisté via le `clientPersister` MMKV avec **versioning du cache** (`MODEL_VERSION`) selon `storage.md`. Conséquence : les queries (liste d'events, statut Premium, etc.) restent disponibles offline au cold start, et l'app affiche les données immédiatement avant même que les mutations rejouent.

#### Schéma des clés MMKV

```ts
// shared/constants/Storage.ts
export enum STORAGE_KEY {
  EVENTS = 'EVENTS',                          // JSON.stringify(EventApi[])
  GROUPS = 'GROUPS',                          // JSON.stringify(GroupApi[])
  USER_PREFERENCES = 'USER_PREFERENCES',      // langue forcée, thème, etc.
  ONBOARDING_COMPLETED = 'ONBOARDING_COMPLETED',
  PREMIUM_UNLOCKED = 'PREMIUM_UNLOCKED',      // cache local (source de vérité = StoreKit/Billing)
  LAUNCH_DATE = 'LAUNCH_DATE',                // pour détecter la fin du tarif promo
}
```

Le cache TanStack Query utilise son propre namespace géré par le persister, séparé de ces clés métier.

---

## 3. Système de couleurs

### 3.0 Deux univers distincts (palette vs theme)

Conformément à `theming.md` qui exige des tokens sémantiques, on sépare strictement :

- **Palette** = **donnée métier** que l'utilisateur sélectionne (couleur d'un event). Tokens **nommés par valeur** car le sens vient de l'utilisateur, pas du système. Stockée dans `shared/constants/Palette.ts`.
- **Theme** = **tokens sémantiques** pour toute l'UI globale (fond app, surface, texte, bordures, erreurs). Tokens **nommés par rôle**. Stocké dans `shared/theme/colors.ts`.

Cette séparation permet de respecter la règle "noms sémantiques" du theme tout en gardant la flexibilité métier pour les events.

### 3.1 Palette des events (donnée — `shared/constants/Palette.ts`)
Chaque couleur a une variante **light** (fond) et **dark** (icône, texte d'accent, progress fill).

Les **7 premières sont disponibles en Free**, les **14 suivantes sont Premium**.

```ts
// shared/constants/Palette.ts
export const PALETTE = {
  // — Free (7) —
  blue:       { light: '#DFEEFF', dark: '#1E4D80', tier: 'free' },
  green:      { light: '#E5F9EB', dark: '#2A6B3D', tier: 'free' },
  purple:     { light: '#ECE4F7', dark: '#5E3F8F', tier: 'free' },
  orange:     { light: '#FCE8DC', dark: '#A05A2C', tier: 'free' },
  pink:       { light: '#FFE7E7', dark: '#B8383E', tier: 'free' },
  yellow:     { light: '#FFF9E2', dark: '#8A6D1F', tier: 'free' },
  gray:       { light: '#EDE7DF', dark: '#5C544A', tier: 'free' },

  // — Premium (14) —
  mint:       { light: '#E2F4EE', dark: '#2F6B5C', tier: 'premium' },
  sky:        { light: '#E4F0F7', dark: '#2E5F7A', tier: 'premium' },
  lavender:   { light: '#EBE7F5', dark: '#574A85', tier: 'premium' },
  rose:       { light: '#FBE6EF', dark: '#A8466C', tier: 'premium' },
  peach:      { light: '#FCEAE0', dark: '#A85B3A', tier: 'premium' },
  sand:       { light: '#F5EBDC', dark: '#8B6A3D', tier: 'premium' },
  sage:       { light: '#E8EDDE', dark: '#5E6B3D', tier: 'premium' },
  terracotta: { light: '#F2DDD0', dark: '#9B4D33', tier: 'premium' },
  cream:      { light: '#FAF3E8', dark: '#7A6948', tier: 'premium' },
  indigo:     { light: '#E2E4F5', dark: '#3D4685', tier: 'premium' },
  lilac:      { light: '#F0E4F2', dark: '#7A4080', tier: 'premium' },
  forest:     { light: '#DEEAE0', dark: '#2E5A3D', tier: 'premium' },
  coral:      { light: '#FCDFDA', dark: '#A04438', tier: 'premium' },
  slate:      { light: '#E4E7EC', dark: '#475569', tier: 'premium' },
} as const;

export type ColorKey = keyof typeof PALETTE;
```

**Résolution runtime** via un utilitaire dédié :

```ts
// shared/utils/paletteResolver.ts
export const resolvePalette = (colorKey: ColorKey) => PALETTE[colorKey];
```

**Affichage dans le picker (Free user)** :
- Les 7 Free sont pleinement interactives
- Les 14 Premium sont affichées mais avec un overlay subtil (opacité 0.5 + petit cadenas en surimpression)
- Tap sur une couleur Premium → ouvre le paywall

### 3.2 Theme sémantique (UI globale — `shared/theme/colors.ts`)

Conformément à `theming.md` : tokens **sémantiques**, pas descriptifs. Permet de changer la palette sans casser le code.

```ts
// shared/theme/colors.ts
export const colors = {
  // Fonds
  background: '#FAFAF7',           // fond global app
  backgroundGradientEnd: '#F5F3EE',
  surface: '#FFFFFF',              // cards, sheets, modals
  surfaceMuted: '#F5F3EE',         // sections settings, etc.

  // Texte
  textPrimary: '#1A1A1A',          // titres, contenu principal
  textSecondary: '#1A1A1A99',      // sous-titres (55% opacity)
  textInverted: '#FFFFFF',         // sur fond sombre (bouton primaire)

  // Surfaces interactives
  primary: '#1A1A1A',              // bouton principal (paywall, CTA)
  primaryPressed: '#000000',
  border: '#E5E5E5',
  divider: '#EDEDED',

  // États sémantiques
  error: '#B8383E',                // mêmes tonalités que la palette pink dark
  errorSurface: '#FFE7E7',
  success: '#2A6B3D',
  successSurface: '#E5F9EB',
  warning: '#8A6D1F',
  warningSurface: '#FFF9E2',

  // Skeletons
  skeletonBase: '#EDE7DF',
  skeletonHighlight: '#F7F2EA',
} as const;
```

### 3.3 Règles d'usage

- **Sur les cards d'events** : utiliser exclusivement la `PALETTE` résolue par `ColorKey` (donnée). Le texte principal sur card est `colors.textPrimary` (du theme).
- **Sur l'UI hors-event** (settings, paywall, onboarding, about, help) : exclusivement le `theme`.
- **Texte sur un fond `light` de la palette** : toujours `colors.textPrimary` (`#1A1A1A`), jamais le `dark` de la famille (réservé aux accents).
- **Progress bar fill** : `palette.dark` à 18% d'opacité, overlay sur le `light`.

### 3.4 Spacing, radius, typography (`shared/theme/`)

Conformément à `theming.md` : multiples de 4, noms sémantiques.

```ts
// shared/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  card: 20,           // cards events
  widget: 22,         // alignement WidgetKit
  pill: 999,
} as const;
```

```ts
// shared/theme/typography.ts
export const typography: Record<string, TextStyle> = {
  // Hero countdown (écran détail)
  heroCountdown: { fontSize: 72, fontWeight: '600', lineHeight: 80, letterSpacing: -1, fontVariant: ['tabular-nums'] },

  // Titres
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 30 },

  // Card list
  cardTitle: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  cardCounter: { fontSize: 28, fontWeight: '700', lineHeight: 34, fontVariant: ['tabular-nums'] },

  // Body
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },

  // Action
  buttonLabel: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
};
```

```ts
// shared/theme/index.ts
import { colors } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';
import { style } from './style';

export const theme = { colors, spacing, radius, typography, style } as const;
```

Usage dans les composants : exclusivement `theme.xxx`, jamais de valeur en dur.

```ts
// ✅
const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
  },
});
```

---

## 4. Typographie & espacements — résumé visuel

> Définitions techniques exhaustives dans **§3.4**. Cette section sert de référence rapide pour le design.

### 4.1 Typo (résumé)
- **Display / titres de countdown** : `Inter` ou `SF Pro Display` — **chiffres tabulaires obligatoires** (`fontVariant: ['tabular-nums']`) pour que les compteurs ne dansent pas
- **Corps** : `Inter` regular
- Échelle visuelle (toutes définies dans `theme.typography`) :
  - Hero countdown (détail) — `heroCountdown` (72/600)
  - Card title — `cardTitle` (17/600)
  - Number widget Small — équivalent `cardCounter` (28/700)
  - Number widget Medium — 44/700
  - Body — `body` (15/400)
  - Caption — `caption` (13/400, opacity via `colors.textSecondary`)

### 4.2 Espacements
Échelle 4-pt via `theme.spacing` : `xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)`.
- Padding card : `theme.spacing.lg` (24, modulable)
- Gap entre cards : `theme.spacing.sm + xs` (12)
- Marge écran : `theme.spacing.md` (16) horizontal, `safe-area-top + spacing.md` vertical

### 4.3 Radius & ombres
- Cards : `theme.radius.card` (20)
- Widgets : `theme.radius.widget` (22, alignement WidgetKit)
- Ombre cards : `0 2 8 rgba(0,0,0,0.04)` — quasi invisible (`theme.style.shadowSoft`)
- Pas de border par défaut

---

## 5. Écrans de l'app

### 5.1 Liste (Home)
**Layout** : scroll vertical, cards empilées avec gap 12.

**Chaque card affiche** :
- Icône (28pt) en haut à gauche, dans une pastille `dark` à 12% d'opacité
- Titre (17pt, 600)
- Compteur principal (28pt, 700) : `"Dans 12 jours"` / `"Aujourd'hui"` / `"Il y a 3 jours"`
- Sous-ligne (13pt, 0.55) : date formatée localisée `"jeudi 25 décembre"`
- **Progress bar horizontale** en bas de la card : remplit la card avec le `dark` à 18% d'opacité, de gauche à droite, de `createdAt` → `targetDate`. La card a l'air littéralement de se remplir.

**Header** :
- Titre app à gauche
- Bouton `+` à droite (cercle, fond `dark` neutre)
- Bouton filtre/tri à côté (Premium)

**Empty state** : illustration calme + CTA "Créer ma première date".

**Tri / regroupement** :
- Par date la plus proche (défaut)
- Par groupe (Premium)
- Par couleur

### 5.2 Détail d'un countdown
Plein écran, fond = `light` de la couleur choisie.
- Icône XL (64pt) centrée en haut
- Titre (24pt, 600)
- Hero countdown (72pt, 600, tabular) : `12 jours, 4 heures`
- Sous-titre : date complète + heure si applicable
- Progress bar circulaire ou linéaire grande
- Notes (si présentes) en carte blanche en bas
- Boutons bas : `Modifier`, `Ajouter au widget`, `Partager` (image-card générée), `Supprimer`

### 5.3 Création / édition
Sheet modale en plein écran.
- Champ titre (auto-focus)
- Date + heure (pickers natifs)
- Récurrence : pills à cocher (Aucune / Annuelle / Mensuelle / Hebdo)
- **Picker icône** : grille scrollable + recherche + sélection par catégories. Stratégie **100% natif** :
  - **iOS** : SF Symbols via [`react-native-sfsymbols`](https://github.com/birkir/react-native-sfsymbols) (juste un wrapper de rendu, les symbols viennent du système Apple — pas de lib externe à embarquer)
  - **Android** : Material Symbols via `react-native-vector-icons/MaterialIcons` (police système, légère)
  - **Mapping par concept** : on définit une liste d'**IconConcept** (ex. `birthday`, `flight`, `heart`, `gift`, `calendar`, `cake`, `briefcase`, `home`...) et chaque concept référence son SF Symbol et son Material Symbol équivalent.

```typescript
// /app/shared/ui/icons/concepts.ts
export const iconConcepts = {
  // === Free (20) ===
  birthday:  { sf: 'birthday.cake.fill',   md: 'cake',                  tier: 'free' },
  gift:      { sf: 'gift.fill',            md: 'card_giftcard',         tier: 'free' },
  heart:     { sf: 'heart.fill',           md: 'favorite',              tier: 'free' },
  star:      { sf: 'star.fill',            md: 'star',                  tier: 'free' },
  calendar:  { sf: 'calendar',             md: 'event',                 tier: 'free' },
  clock:     { sf: 'clock.fill',           md: 'schedule',              tier: 'free' },
  flight:    { sf: 'airplane',             md: 'flight',                tier: 'free' },
  car:       { sf: 'car.fill',             md: 'directions_car',        tier: 'free' },
  home:      { sf: 'house.fill',           md: 'home',                  tier: 'free' },
  work:      { sf: 'briefcase.fill',       md: 'work',                  tier: 'free' },
  school:    { sf: 'graduationcap.fill',   md: 'school',                tier: 'free' },
  music:     { sf: 'music.note',           md: 'music_note',            tier: 'free' },
  sport:     { sf: 'figure.run',           md: 'directions_run',        tier: 'free' },
  food:      { sf: 'fork.knife',           md: 'restaurant',            tier: 'free' },
  coffee:    { sf: 'cup.and.saucer.fill',  md: 'local_cafe',            tier: 'free' },
  bell:      { sf: 'bell.fill',            md: 'notifications',         tier: 'free' },
  flag:      { sf: 'flag.fill',            md: 'flag',                  tier: 'free' },
  sun:       { sf: 'sun.max.fill',         md: 'wb_sunny',              tier: 'free' },
  medical:   { sf: 'cross.case.fill',      md: 'medical_services',      tier: 'free' },
  person:    { sf: 'person.2.fill',        md: 'group',                 tier: 'free' },

  // === Premium (~60+) — exemples non exhaustifs, à compléter ===
  // Famille étendue
  baby:        { sf: 'figure.and.child.holdinghands', md: 'child_friendly',  tier: 'premium' },
  pets:        { sf: 'pawprint.fill',                 md: 'pets',            tier: 'premium' },
  wedding:     { sf: 'sparkles',                      md: 'celebration',     tier: 'premium' },
  // Verticales loisirs
  gaming:      { sf: 'gamecontroller.fill',           md: 'sports_esports',  tier: 'premium' },
  camera:      { sf: 'camera.fill',                   md: 'photo_camera',    tier: 'premium' },
  book:        { sf: 'book.fill',                     md: 'menu_book',       tier: 'premium' },
  movie:       { sf: 'film.fill',                     md: 'movie',           tier: 'premium' },
  art:         { sf: 'paintbrush.fill',               md: 'palette',         tier: 'premium' },
  // Voyage avancé
  train:       { sf: 'tram.fill',                     md: 'train',           tier: 'premium' },
  boat:        { sf: 'ferry.fill',                    md: 'directions_boat', tier: 'premium' },
  mountain:    { sf: 'mountain.2.fill',               md: 'landscape',       tier: 'premium' },
  beach:       { sf: 'beach.umbrella.fill',           md: 'beach_access',    tier: 'premium' },
  tent:        { sf: 'tent.fill',                     md: 'cabin',           tier: 'premium' },
  // Lifestyle & santé
  gym:         { sf: 'dumbbell.fill',                 md: 'fitness_center',  tier: 'premium' },
  yoga:        { sf: 'figure.yoga',                   md: 'self_improvement',tier: 'premium' },
  plant:       { sf: 'leaf.fill',                     md: 'eco',             tier: 'premium' },
  // Pro avancé
  chart:       { sf: 'chart.line.uptrend.xyaxis',     md: 'trending_up',     tier: 'premium' },
  lightbulb:   { sf: 'lightbulb.fill',                md: 'lightbulb',       tier: 'premium' },
  target:      { sf: 'target',                        md: 'crisis_alert',    tier: 'premium' },
  rocket:      { sf: 'paperplane.fill',               md: 'rocket_launch',   tier: 'premium' },
  // Fêtes & saisons
  christmas:   { sf: 'tree.fill',                     md: 'celebration',     tier: 'premium' },
  fireworks:   { sf: 'sparkles',                      md: 'celebration',     tier: 'premium' },
  halloween:   { sf: 'moon.stars.fill',               md: 'dark_mode',       tier: 'premium' },
  // ... ~35 autres à curer ensemble lors du design
} as const;

export type IconConcept = keyof typeof iconConcepts;
```

**Logique des 20 Free** :
- *Émotionnel* : `heart`, `birthday`, `gift`, `star`
- *Logistique / deadline* : `calendar`, `clock`, `bell`, `flag`
- *Voyage* : `flight`, `car`, `sun`
- *Quotidien* : `home`, `work`, `school`, `medical`
- *Social / sorties* : `food`, `coffee`, `music`, `sport`, `person`

Couvre ~95% des usages courants. Les cas plus spécifiques (mariage, naissance, voyage en train, gym...) basculent en Premium → vraie raison de payer sans frustrer l'utilisateur Free.

  - Le composant `<EventIcon concept="birthday" color="..." />` choisit la bonne family selon `Platform.OS`
  - **Catégories** dans le picker : Personnes, Voyage, Travail, Loisirs, Fêtes, Santé, Maison, Symboles, **Emoji** (catégorie spéciale, voir plus bas)
  - **Cadenas** sur les icônes Premium tant que l'utilisateur n'a pas acheté
  - **Bonus : option "emoji libre"** — l'utilisateur peut taper son propre emoji depuis le clavier système (🎂🎸🏖️) au lieu d'une icône système. Stockage : `{ family: 'emoji', value: '🎂' }`. Gratuit, infini, et personnel. Côté widget natif, on rend l'emoji comme texte (les emojis sont des glyphes Unicode supportés nativement par WidgetKit et Glance).
- **Picker couleur** : grille 7 × 3 de pastilles. Animation : pastille sélectionnée se zoome de 1.1 avec spring.
- Notifications : toggle + multi-select des offsets (`1 semaine`, `1 jour`, `1 heure`, `Le jour même`)
- Groupe (Premium) : sélecteur
- Notes (Premium) : champ multilignes 280 char

### 5.4 Configuration widget (dans l'app)
Section dédiée :
- Liste des comptes à rebours existants
- Pour chaque, indicateur "Affiché sur widget : oui/non"
- Aperçu live des widgets (S / M / L) avec preview iOS-like
- Bouton "Comment ajouter à l'écran d'accueil ?" → tutoriel illustré (différent iOS / Android)

### 5.5 Settings
Organisation en sections (groupes visuels iOS-style avec headers discrets) :

**Apparence**
- Langue (auto / fr / en / es)
- Premier jour de la semaine (lundi / dimanche / samedi)
- Thème (System / Light / Dark — Dark en V1.1)

**Notifications**
- Notifications globales (toggle master)
- Rappel par défaut (Free : verrouillé sur jour J / Premium : multi-offsets configurables)

**Données**
- **Exporter mes dates** (voir §5.8)
- Supprimer toutes mes données (avec double confirmation — droit à l'oubli RGPD)

**Achats**
- Statut Premium (badge "Premium ✓" si débloqué, sinon CTA "Passer Premium")
- Restaurer mes achats

**Aide & contact** (voir §5.10)
- Centre d'aide & dépannage
- Suggérer une fonctionnalité
- Signaler un bug

**À propos** (voir §5.9)
- À propos de Bientôt
- Mentions légales
- Politique de confidentialité
- Conditions d'utilisation
- Version (numéro + build, tap 5 fois = mode debug pour dev)

### 5.6 Onboarding (premier lancement)
- **Détection langue** silencieuse via `react-native-localize` — aucun écran de choix au démarrage
- **3 écrans skippables** :
  1. *Concept* — illustration calme + "Suivez le temps qui vous sépare des moments importants"
  2. *Exemple visuel* — mockup d'un widget posé sur un écran d'accueil, avec un compte à rebours en cours
  3. *Action* — bouton "Créer ma première date" qui ouvre directement la modale de création (premier event)
- Bouton **"Passer"** discret en haut à droite sur chaque écran
- Stockage du flag `hasOnboarded` dans MMKV pour ne pas le rejouer
- **Permission notifications** : jamais demandée à l'onboarding. Demandée uniquement à la première activation du toggle "Me notifier" sur un event (contextuelle, taux d'acceptation bien meilleur)

### 5.7 Empty states & états d'erreur

#### Empty states
- **Liste principale vide** : illustration calme + CTA "Créer ma première date" → ouvre la modale de création
- **Onglet "Passés" vide** : message bienveillant `"Aucune date passée. Profitez du moment présent."` (pas de CTA)
- **Groupe vide** (Premium) : `"Ajoutez une date à ce groupe"` + CTA
- **Aucun widget posé** sur l'écran de config widgets : tutoriel illustré pas-à-pas (différent iOS / Android), avec captures d'écran de l'opération
- **Recherche dans le picker icônes sans résultat** : `"Aucune icône trouvée. Essayez un autre mot."`

#### États d'erreur
- **Achat IAP échoué** : message clair `"Le paiement n'a pas abouti. Aucun montant n'a été débité."` + bouton "Réessayer" + lien "Restaurer mes achats"
- **Restauration sans achat antérieur** : message neutre `"Aucun achat précédent trouvé sur ce compte."` (pas alarmant)
- **Permission notifs refusée** : fallback gracieux. Toggle "Me notifier" affiché mais désactivé visuellement avec petit texte `"Activez les notifications dans les Réglages système"` + lien direct vers les Settings de l'OS
- **MMKV corrompu / lecture échouée** : reset propre + log Crashlytics, message utilisateur `"Une erreur est survenue, vos dates ont été restaurées depuis la dernière sauvegarde."`
- **Widget bridge inaccessible** : silencieux côté user (l'app fonctionne), log Crashlytics

### 5.8 Export des données
Bouton dans Settings → "Exporter mes dates" qui ouvre une feuille de choix :

- **Format JSON** (`bientot-export-YYYYMMDD.json`) : structure complète et lisible, ré-importable dans une future version de l'app
- **Format iCal** (`.ics`) : standard universel, importable directement dans Apple Calendar, Google Calendar, Outlook. Chaque event devient un événement `VEVENT` avec récurrence si applicable

Implémentation : génération en mémoire → écriture dans le dossier temp → `Share` API native (sheet système) pour AirDrop / Mail / Drive / etc. Pas de cloud, pas de serveur, 100% local.

Disponible **en Free** (transparence et confiance).

### 5.9 Page "À propos de Bientôt"

Cette page est un **levier de confiance** majeur pour une app indie premium. Elle humanise le produit et différencie Bientôt des apps anonymes du store.

#### Structure visuelle
Page scrollable au design éditorial (pas de liste système, vraie mise en page) :

**1. Hero**
- Logo Bientôt (taille moyenne, centré)
- Tagline : `"Le compte à rebours pour tout ce qui compte."`
- Sous-tagline (15pt, opacité 0.6) : `"Conçu et développé avec soin par une seule personne."`

**2. Le développeur**
- Petite photo ou illustration personnelle (optionnel — si Ronan préfère rester en mode "studio indie", remplacer par un mark/symbole)
- Court paragraphe à la première personne, ton chaleureux :
  > *"Salut, je suis Ronan. J'ai créé Bientôt parce que je voulais une app de compte à rebours vraiment belle, calme, et qui respecte ses utilisateurs. Pas de pub, pas de tracking, pas d'abonnement caché. Juste un outil simple pour visualiser ce qui arrive. Si Bientôt vous plaît, parlez-en autour de vous — c'est ce qui aide le plus une app indé comme celle-ci à exister."*
- Liens vers les réseaux pro (optionnel) : Twitter/X, Bluesky, site perso. Boutons sobres avec icônes système.

**3. La philosophie**
3 cards visuelles, format identique à celles du paywall, avec petites icônes :
- 🔒 **Vos données vous appartiennent** — "Tout est stocké localement sur votre appareil. Aucun serveur, aucun cloud, aucun envoi de vos dates."
- ✨ **Aucun abonnement, aucune pub** — "Bientôt s'achète une seule fois et fonctionne pour toujours."
- 🛠 **Fait à la main, mise à jour avec soin** — "Pas de course aux fonctionnalités. Chaque update est pensée pour ne pas casser ce qui marche."

**4. Crédits & remerciements**
Section sobre listant :
- Tech : "Construit avec React Native, SwiftUI et Kotlin"
- Inspirations : "Pretty Progress, Things 3, Sablier" — citer ouvertement tes inspirations renforce la crédibilité indie
- Bêta-testeurs (Premium qui ont aidé pendant le développement) — section "Merci à" remplie au moment du launch
- Polices : "Inter (Rasmus Andersson)" si tu utilises Inter

**5. Stats vivantes** (optionnel mais malin)
Si tu veux montrer la vie du projet :
- Nombre total de countdowns créés par l'ensemble des utilisateurs (compteur mis à jour 1×/jour via Firebase, anonyme)
- Date de la dernière mise à jour
- Nombre de langues supportées

**6. Pied de page**
- Version exacte (`v1.0.0 — Build 42`)
- Lien "Mentions légales", "Confidentialité", "CGU"
- Copyright : `"© 2026 Ronan [Nom]. Tous droits réservés."`

#### Ton & contraintes
- **Première personne** ("je", "j'ai créé") — pas de "nous" corporate ni de "l'équipe"
- **Pas de fausse modestie** ni de fausse grandiloquence — direct, honnête
- **Pas de "buy me a coffee"** ni de pourboires — tu vends une app à 4,99 €, ne mendie pas en plus
- **i18n complète** : fr / en / es. Le texte du dev est traduit (ou adapté légèrement) dans chaque langue
- **Lien direct vers la page de l'App Store** : bouton "Laisser un avis" (utilise `SKStoreReviewController` iOS / `In-App Review API` Android) — vital pour grimper dans le ranking

### 5.10 Page "Dépannage & contact"

Centre d'aide intégré qui sert à la fois de **FAQ**, **canal de contact**, et **boîte à idées**.

#### Structure

**1. FAQ rapides**
6 à 10 questions les plus fréquentes en accordéon (tap pour déplier). Exemples :
- "Comment ajouter un widget à mon écran d'accueil ?" → tutoriel illustré iOS / Android
- "Mon widget ne se met pas à jour, que faire ?" → checklist (mode économie d'énergie, redémarrer, etc.)
- "J'ai acheté Premium sur un autre appareil, comment le restaurer ?" → guide pas-à-pas
- "Comment changer la langue de l'app ?" → renvoi Settings
- "Mes dates ont disparu, comment les retrouver ?" → vérification export, restauration sauvegarde
- "Comment supprimer mon compte / mes données ?" → renvoi Settings → Supprimer toutes mes données
- "Bientôt est-il disponible sur Apple Watch / Mac ?" → "Pas encore, mais c'est dans la roadmap."
- "Mes notifications ne s'affichent pas" → checklist permissions OS

**2. Contact direct — 3 boutons distincts**

Chaque bouton ouvre un **mail pré-rempli** via `Linking.openURL('mailto:...')` avec :
- Destinataire : `hello@bientot.app` (ou ton adresse choisie)
- Sujet pré-rempli selon le bouton
- Corps pré-rempli avec **métadonnées techniques** auto-remplies (très utile pour toi pour debug rapide)

**Bouton 1 : `📧 J'ai besoin d'aide`** — pour le support
```
Sujet : [Support] {nom de l'utilisateur ou "Utilisateur"}
Corps :
Bonjour Ronan,

[Décrivez votre problème ici]

---
Informations techniques (ne pas supprimer)
App : Bientôt v1.0.0 (Build 42)
Appareil : iPhone 15 Pro
OS : iOS 18.2
Langue : Français
Premium : Oui / Non
Nombre de dates : 12
```

**Bouton 2 : `💡 Suggérer une fonctionnalité`** — pour les idées
```
Sujet : [Idée] {brève description}
Corps :
Bonjour Ronan,

J'aimerais voir cette fonctionnalité dans Bientôt :

[Décrivez votre idée ici]

Cas d'usage / pourquoi ce serait utile :
[Optionnel]

---
App : Bientôt v1.0.0
```

**Bouton 3 : `🐞 Signaler un bug`** — pour les bugs précis
```
Sujet : [Bug] {brève description}
Corps :
Bonjour Ronan,

J'ai rencontré un bug :

Ce qui devrait se passer :
[Décrivez]

Ce qui se passe en réalité :
[Décrivez]

Comment reproduire :
1.
2.
3.

---
App : Bientôt v1.0.0 (Build 42)
Appareil : iPhone 15 Pro
OS : iOS 18.2
```

**3. Roadmap publique (optionnel mais super effet)**
Petite section en bas : `"Sur quoi je travaille en ce moment"` avec 2-3 items courts depuis une URL distante (JSON hébergé sur le site, modifiable sans release). Exemples :
- *"Mode sombre"* — En cours
- *"Live Activities iOS"* — Prévu
- *"Sync iCloud"* — Étudié

Crée du lien, montre que l'app est vivante, et désamorce les "manque ça, manque ça" dans les reviews négatives.

**4. Pied de section**
- Temps de réponse indicatif : `"Je réponds personnellement à chaque mail, en général sous 48h."`
- Lien vers les réseaux pro pour suivre l'évolution
- **Pas de chatbot, pas de système de tickets** — Bientôt est petit, le contact direct mail est sa force

#### Implémentation technique
- Page React Native classique (pas de WebView)
- FAQ stockée dans les fichiers i18n (`fr/faq.json`, `en/faq.json`, `es/faq.json`) — modifiable par release ou via fichier distant
- Roadmap publique : `fetch('https://bientot.app/roadmap.json')` au mount, cache 24h, fallback silencieux si pas de réseau
- Mails pré-remplis via `Linking.openURL` avec encodage URL des sauts de ligne (`%0A`)
- Si l'utilisateur n'a pas d'app mail configurée : message gracieux `"Aucune app email détectée. Écrivez à hello@bientot.app"` + bouton copier l'adresse

---

## 5bis. Navigation

> Conformément à `navigation.md`. Toute navigation hors composant écran passe par `NavigatorUtils`.

### 5bis.1 Hiérarchie des stacks

Bientôt n'a pas d'auth (toujours "connecté"). On garde quand même la convention des 3 niveaux pour respecter `navigation.md` et permettre l'ajout futur d'un compte cloud.

```
AppNavigator (root stack)
└── CONNECTED_STACK
    ├── TAB_NAVIGATOR
    │   ├── HomeTab     → HomeStack    → HOME           (liste events)
    │   ├── WidgetsTab  → WidgetsStack → WIDGETS_CONFIG (preview + tuto)
    │   └── SettingsTab → SettingsStack → SETTINGS
    └── DETAILS_STACK                                   (pas de tab bar par construction)
        ├── EVENT_DETAIL
        ├── EVENT_CREATE
        ├── EVENT_EDIT
        ├── EVENTS_PASSED                               (onglet "Passés")
        ├── PAYWALL
        ├── ONBOARDING                                  (présenté plein écran au 1er lancement)
        ├── ABOUT
        └── HELP
```

**Règles d'ajout d'écran** (cf. `navigation.md`) :
- Écran racine d'un onglet → mini-stack de l'onglet
- Écran de détail / sous-page accessible depuis n'importe où → `DETAILS_STACK`
- Pas d'écran de détail dans le tab navigator

### 5bis.2 ParamList typés

Chaque stack exporte son `XxxParamList` typé avec les enums `SCREEN_NAME` en computed properties.

```ts
// shared/constants/Screen.ts
export enum SCREEN_NAME {
  HOME = 'HOME',
  WIDGETS_CONFIG = 'WIDGETS_CONFIG',
  SETTINGS = 'SETTINGS',
  EVENT_DETAIL = 'EVENT_DETAIL',
  EVENT_CREATE = 'EVENT_CREATE',
  EVENT_EDIT = 'EVENT_EDIT',
  EVENTS_PASSED = 'EVENTS_PASSED',
  PAYWALL = 'PAYWALL',
  ONBOARDING = 'ONBOARDING',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
}

export enum STACK_NAME {
  HOME = 'HOME_STACK',
  WIDGETS = 'WIDGETS_STACK',
  SETTINGS = 'SETTINGS_STACK',
  TAB = 'TAB_NAVIGATOR',
  DETAILS = 'DETAILS_STACK',
  CONNECTED = 'CONNECTED_STACK',
}
```

### 5bis.3 Navigation hors composants — `NavigatorUtils`

Tout appel `navigate()` / `goBack()` depuis un service, un hook utilitaire, un callback natif passe par **`NavigatorUtils`** (cf. `navigation.md`). Pas de `useNavigation()` en dehors d'un composant écran.

```ts
// Exemple : depuis le callback de notification Notifee
import NavigatorUtils from '~navigators/NavigatorUtils';

NavigatorUtils.navigate(SCREEN_NAME.EVENT_DETAIL, { eventId: notification.eventId });
```

### 5bis.4 Configuration des écrans
`ScreenOptions({ title, showBackButton, showHelpButton })` exposé par `AppNavigator.tsx`, réutilisé par tous les stacks. Pour cacher le header ou appliquer le style standard : `themeScreen.hideHeader` / `themeScreen.headerStyle` depuis `~shared/theme`.

---

## 5ter. Pattern de données events (TanStack Query sur MMKV)

> Conformément à `data-fetching.md`. La couche "API" est ici le MMKV local — mais le pattern reste strict (`api.ts` + `reducer.ts` + `hook.ts`) pour préparer la sync cloud V2 sans rien casser.

### 5ter.1 `api.ts` — lecture/écriture MMKV

```ts
// features/events/services/api.ts
import { getMMKV } from '~shared/storage/mmkv';
import { STORAGE_KEY } from '~shared/constants/Storage';
import { EventApi } from './types';

export const getEventsApi = async (): Promise<EventApi[]> => {
  const raw = getMMKV().getString(STORAGE_KEY.EVENTS);

  if (raw == null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as EventApi[];

    if (!Array.isArray(parsed)) {
      throw new Error('EVENTS payload is not an array');
    }

    return parsed;
  } catch (error: any) {
    throw new Error(`Failed to parse events: ${error.message}`);
  }
};

export const setEventsApi = async (events: EventApi[]): Promise<void> => {
  getMMKV().set(STORAGE_KEY.EVENTS, JSON.stringify(events));
};
```

### 5ter.2 `reducer.ts` — pont Api → App

Déjà défini en §2.3. Pure function, jamais d'async, jamais de side effect.

### 5ter.3 `hook.ts` — queries & mutations

```ts
// features/events/services/hook.ts
export const useEventsQuery = () => {
  const {
    data: events,
    isPending: isEventsPending,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: [QUERY_KEY.EVENTS],
    queryFn: async () => {
      const response = await getEventsApi();

      try {
        return eventsReducer(response);
      } catch (error: any) {
        console.error(`[Error] eventsReducer: ${error.message}`);
        crashlytics.recordError(error, '[Error] eventsReducer');
        throw new Error(translate('error.events.parse'));
      }
    },
    staleTime: CACHE_TIME.INFINITY,   // donnée locale, jamais stale
    gcTime: CACHE_TIME.INFINITY,
  });

  return {
    events,
    isEventsPending,
    eventsError,
    refetchEvents,
  };
};
```

```ts
// Mutation avec optimistic update + sync widget
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  const { syncWidgets } = useWidgetSync();

  const {
    mutateAsync: createEventMutate,
    isPending: isCreateEventPending,
  } = useMutation({
    mutationFn: async (params: CreateEventParams) => {
      const currentEvents = await getEventsApi();
      const newEvent: EventApi = eventInputToApi(params.input);
      const nextEvents = [...currentEvents, newEvent];

      await setEventsApi(nextEvents);
      await syncWidgets(nextEvents);

      return newEvent;
    },

    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.EVENTS] });

      const previousEvents: Event[] | undefined = queryClient.getQueryData([QUERY_KEY.EVENTS]);
      const optimisticEvent = eventInputToApp(params.input);

      queryClient.setQueryData([QUERY_KEY.EVENTS], [
        ...(previousEvents ?? []),
        optimisticEvent,
      ]);

      return { previousEvents };
    },

    onError: (_error, _params, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData([QUERY_KEY.EVENTS], context.previousEvents);
      }
    },
  });

  return {
    createEventMutate,
    isCreateEventPending,
  };
};
```

Pattern identique pour `useUpdateEventMutation` et `useDeleteEventMutation`.

### 5ter.4 Synchro widget

Le hook `useWidgetSync` est appelé à chaque mutation pour propager les changements vers le widget natif. Il vit dans `features/widgets/` et expose une fonction unique `syncWidgets(events)` qui :
1. Sérialise les events en `EventApi[]` (snake_case)
2. Empaquette dans le format JSON versionné (`{ version, lastSync, events, groups }`)
3. Appelle le TurboModule `WidgetBridge.syncCountdowns(payload)` qui écrit dans l'App Group / SharedPreferences en clair

Cette séparation rend la logique de synchro testable indépendamment et évite de polluer le mutationFn de chaque feature.

### 5ter.5 Constantes

```ts
// shared/constants/QueryKey.ts
export enum QUERY_KEY {
  EVENTS = 'EVENTS',
  GROUPS = 'GROUPS',
  PREMIUM_STATUS = 'PREMIUM_STATUS',
  PUBLIC_ROADMAP = 'PUBLIC_ROADMAP',
}

// shared/constants/CacheTime.ts
export const CACHE_TIME = {
  MINUTE_1: 1000 * 60,
  HOUR_1: 1000 * 60 * 60,
  HOURS_6: 1000 * 60 * 60 * 6,
  DAY_1: 1000 * 60 * 60 * 24,
  INFINITY: Infinity,
} as const;
```

---

## 5quater. i18n

> Conformément à `i18n.md`. Toujours `translate()`, jamais de string littérale dans le JSX.

### 5quater.1 Localisation
```
/app/i18n
  translate.ts       # helper
  fr.json            # default
  en.json
  es.json
```

### 5quater.2 Détection de langue
- `react-native-localize` détecte la langue système au boot
- Si la langue système est `fr`, `en` ou `es` → on l'utilise
- Sinon → fallback `fr`
- L'utilisateur peut forcer une langue dans Settings → stockée dans `STORAGE_KEY.USER_PREFERENCES`

### 5quater.3 Structure des clés (camelCase)

```json
{
  "common": {
    "confirm": "Valider",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "loading": "Chargement…",
    "retry": "Réessayer"
  },

  "error": {
    "events": {
      "parse": "Impossible de charger vos dates",
      "create": "Impossible de créer la date",
      "update": "Impossible de mettre à jour la date",
      "delete": "Impossible de supprimer la date"
    },
    "paywall": {
      "purchaseFailed": "Le paiement n'a pas abouti. Aucun montant n'a été débité.",
      "noRestoredPurchase": "Aucun achat précédent trouvé sur ce compte."
    },
    "widgets": {
      "syncFailed": "La synchronisation du widget a échoué"
    }
  },

  "success": {
    "events": {
      "created": "Date créée",
      "updated": "Date mise à jour",
      "deleted": "Date supprimée"
    }
  },

  "events": {
    "listTitle": "Mes dates",
    "passedTitle": "Passées",
    "emptyTitle": "Aucune date pour l'instant",
    "emptyAction": "Créer ma première date",
    "countdown": {
      "today": "Aujourd'hui",
      "inDays": "{count, plural, one {Dans # jour} other {Dans # jours}}",
      "inHours": "{count, plural, one {Dans # heure} other {Dans # heures}}",
      "passedDays": "{count, plural, one {Il y a # jour} other {Il y a # jours}}"
    },
    "compact": {
      "today": "Auj.",
      "tomorrow": "J-1",
      "days": "{count}j",
      "months": "{count}m",
      "years": "{count}a"
    }
  },

  "settings": {
    "title": "Réglages",
    "appearance": "Apparence",
    "notifications": "Notifications",
    "data": "Données",
    "purchases": "Achats",
    "help": "Aide & contact",
    "about": "À propos"
  },

  "paywall": {
    "title": "Tout débloquer, pour toujours",
    "subtitle": "Un paiement unique. Aucun abonnement.",
    "ctaPrice": "Débloquer pour {price}",
    "launchPrice": "🎉 Tarif de lancement",
    "restorePurchases": "Restaurer mes achats"
  },

  "about": {
    "title": "À propos",
    "tagline": "Le compte à rebours pour tout ce qui compte.",
    "intro": "Conçu et développé avec soin par une seule personne."
  },

  "help": {
    "title": "Aide & contact",
    "faqTitle": "Questions fréquentes",
    "needHelp": "J'ai besoin d'aide",
    "suggestFeature": "Suggérer une fonctionnalité",
    "reportBug": "Signaler un bug"
  }
}
```

### 5quater.4 Pluriel
Format ICU via `i18n-js`. Toujours préférer ICU aux conditions JS.

```ts
translate('events.countdown.inDays', { count: 12 });
// → "Dans 12 jours"
```

### 5quater.5 Variables
Référencer avec `{name}`, passer un objet en deuxième argument :

```ts
translate('paywall.ctaPrice', { price: '3,99 €' });
```

---



## 6. Widgets natifs — le cœur de l'app

> **Important** : les widgets ne peuvent pas être écrits en React Native. iOS impose **SwiftUI + WidgetKit**, Android impose **Kotlin + Glance (Jetpack Compose)**. L'app RN écrit les données dans un stockage partagé, les widgets natifs lisent et rendent.

### 6.1 Périmètre V1
**Deux modes** uniquement au lancement :
- **Mode A — Single event** : 1 countdown en plein cadre
- **Mode B — Group view** : jusqu'à 3 countdowns d'un même groupe (réponse au cas "4 enfants")

Modes C (stack) et D (timeline) → reportés en V1.2.

### 6.2 Tailles supportées

**iOS (WidgetKit)** — Swift, target `/ios/CountdownWidget/`
- `systemSmall` → Mode A uniquement
- `systemMedium` → Mode A ou Mode B (configurable)
- `systemLarge` → Mode A ou Mode B (configurable, agrandi)
- `accessoryCircular` (Lock Screen) → Mode A
- `accessoryRectangular` (Lock Screen) → Mode A
- `accessoryInline` (Lock Screen) → Mode A

**Android (Glance)** — Kotlin, dans `/android/app/src/main/java/.../widgets/`
- 2×2 (small) → Mode A uniquement
- 4×2 (medium) → Mode A ou Mode B
- 4×4 (large) → Mode A ou Mode B (agrandi)

### 6.3 Mode A — Single event (détail visuel)
- Fond = `light` de la couleur de l'event
- Icône (24pt small, 32pt medium+) en haut à gauche, dans pastille `dark` à 12% d'opacité
- Titre (15pt, 600) sous l'icône, tronqué sur 1 ligne
- Grand chiffre central tabular (`28pt` small, `52pt` medium, `72pt` large) : nombre + unité auto-adaptée (`12` + `jours`, `3` + `heures`, `45` + `min`)
- Date complète en bas (13pt, opacité 0.55) : `"jeu. 25 déc."`
- Progress bar fine en bas (2pt hauteur), fill = `dark` à 18% d'opacité, de gauche à droite, calculée sur `createdAt → targetDate`
- Tap → deep link vers le détail du countdown

### 6.4 Mode B — Group view (détail visuel)
- Fond = neutre (`cream` ou `sand` light) pour ne pas être dominé
- Header (14pt, 600) : nom du groupe + petite icône groupe à gauche
- Liste de **3 lignes max**, chacune :
  - Pastille couleur 8pt à gauche (couleur de l'event)
  - Titre tronqué (14pt) au milieu
  - Compteur compact (14pt, 600, tabular) aligné à droite : `12j` / `3m` / `1a` / `J-1` / `Auj.`
- Si > 3 events dans le groupe : ligne pied `+2 autres` (13pt, opacité 0.55)
- Tri interne : par date la plus proche
- Tap sur une ligne → deep link vers le détail de cet event

### 6.5 Refresh & timeline

**iOS** :
- `TimelineProvider` génère des entrées à :
  - Minuit chaque jour (pour décrémenter le compteur en jours)
  - 1h, 30min, 5min avant chaque event (pour passer en mode "heures/minutes")
  - À l'instant `targetDate` (pour basculer en mode "passé" si non récurrent, ou recalculer la prochaine occurrence si récurrent)
- Policy : `.after(nextRefreshDate)`

**Android** :
- `GlanceAppWidget` mis à jour via `WorkManager` toutes les heures (contrainte Doze mode rend le minutage précis impossible)
- Force update au lancement de l'app et à chaque modif d'event via `GlanceAppWidgetManager.update()`

**Granularité** : le countdown se met à jour 1×/jour quand `> 24h`, 1×/heure quand `< 24h`, 1×/minute uniquement le jour J (et seulement côté iOS via Live Activities en V1.2 — en V1 on accepte que le widget Android soit moins frais le jour J).

### 6.6 Pont app ↔ widget

#### Stockage partagé

**iOS** :
- Activer un **App Group** : `group.fr.<bundle>.shared`
- Le widget et l'app lisent/écrivent dans `UserDefaults(suiteName: "group.fr.<bundle>.shared")`
- Format : un seul JSON sous la clé `"countdowns"`, contenant la liste sérialisée des events + le mapping des groupes
- Pour les images d'icônes custom (si on en ajoute en V2), utiliser `FileManager.containerURL(forSecurityApplicationGroupIdentifier:)`

**Android** :
- `SharedPreferences` avec nom partagé `"countdown_shared"` en `MODE_PRIVATE` (le widget tourne dans le même UID que l'app)
- Format JSON identique à iOS (mêmes clés, mêmes types) pour pouvoir partager le code de sérialisation côté TS

#### TurboModule `WidgetBridge`

Interface TypeScript exposée à JS :
```typescript
// /app/shared/native/WidgetBridge.ts
export interface Spec extends TurboModule {
  syncCountdowns(payload: string): Promise<void>;       // JSON.stringify de l'état
  reloadAllWidgets(): Promise<void>;                    // force refresh
  isWidgetInstalled(kind: string): Promise<boolean>;    // pour le tutoriel
}
```

**Côté iOS (Swift)** :
```swift
@objc(WidgetBridge)
class WidgetBridge: NSObject {
  @objc func syncCountdowns(_ payload: String, resolver: ..., rejecter: ...) {
    let defaults = UserDefaults(suiteName: "group.fr.<bundle>.shared")
    defaults?.set(payload, forKey: "countdowns")
    WidgetCenter.shared.reloadAllTimelines()
    resolver(nil)
  }
}
```

**Côté Android (Kotlin)** :
```kotlin
@ReactModule(name = "WidgetBridge")
class WidgetBridgeModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
  @ReactMethod
  fun syncCountdowns(payload: String, promise: Promise) {
    val prefs = reactApplicationContext.getSharedPreferences("countdown_shared", Context.MODE_PRIVATE)
    prefs.edit().putString("countdowns", payload).apply()
    // Force update via GlanceAppWidgetManager
    val manager = GlanceAppWidgetManager(reactApplicationContext)
    runBlocking {
      manager.getGlanceIds(SingleEventWidget::class.java).forEach { id ->
        SingleEventWidget().update(reactApplicationContext, id)
      }
      manager.getGlanceIds(GroupEventWidget::class.java).forEach { id ->
        GroupEventWidget().update(reactApplicationContext, id)
      }
    }
    promise.resolve(null)
  }
}
```

#### Schéma JSON partagé

Sérialisation unique sous la clé `"countdowns"`. Format versionné pour permettre les migrations futures sans casser les widgets installés.

```json
{
  "version": 1,
  "lastSync": "2026-05-15T09:30:00Z",
  "events": [
    {
      "id": "uuid-1",
      "title": "Anniversaire Léa",
      "targetDate": "2026-12-25T00:00:00+01:00",
      "createdAt": "2026-01-10T14:22:00+01:00",
      "icon": { "family": "concept", "concept": "birthday" },
      "colorKey": "pink",
      "recurrence": "yearly",
      "groupId": "group-children"
    }
  ],
  "groups": [
    {
      "id": "group-children",
      "name": "Enfants",
      "colorKey": "lavender"
    }
  ]
}
```

**Règle de migration** : si un widget natif lit un JSON avec un `version` supérieur à celui qu'il connaît, il affiche un état fallback `"Mettez à jour Bientôt"` au lieu de crasher. Les nouveaux champs sont toujours optionnels côté lecteur natif.

#### Flux de synchro

À chaque mutation (création, édition, suppression d'event ou de groupe) :
1. La mutation TanStack Query exécute son `mutationFn` : écriture dans MMKV chiffré (source de vérité) + sérialisation du payload
2. Le hook `useWidgetSync` est invoqué dans le `mutationFn` et appelle `WidgetBridge.syncCountdowns(payload)` (TurboModule)
3. Le module natif écrit le JSON dans le App Group (iOS) / SharedPreferences (Android) en clair
4. Côté iOS, `WidgetCenter.shared.reloadAllTimelines()` est appelé ; côté Android, `GlanceAppWidgetManager.update()`
5. Les widgets posés sur le home screen rafraîchissent leur rendu

### 6.7 Configuration du widget par l'utilisateur

**iOS** : `AppIntentConfiguration` (iOS 17+) ou `IntentConfiguration` (iOS 16). Quand l'utilisateur appuie longuement sur le widget posé, il peut :
- Choisir l'event à afficher (Mode A) — liste fournie via `AppEntityQuery` qui lit le App Group
- Choisir le groupe à afficher (Mode B)
- Sur Medium/Large : choisir le mode (A ou B)

**Android** : Configuration activity déclarée dans le manifest, lancée par le launcher quand l'utilisateur pose le widget. UI Compose native dans l'activity, lit `SharedPreferences`, écrit le choix dans le `glanceState` du widget.

### 6.8 Limites & gotchas à anticiper
- **iOS widget memory** : ~30 Mo max — décoder un JSON de plusieurs centaines d'events, pas de souci, mais éviter de charger des images
- **iOS timeline** : `TimelineProvider` doit retourner rapidement (< quelques secondes), donc la lecture du JSON doit être synchrone et compacte
- **Android Doze mode** : les widgets ne se mettent pas à jour quand l'écran est éteint depuis longtemps — c'est normal, ne pas chercher à contourner
- **Glance limitations** : pas tous les composants Compose, pas de Canvas custom. La progress bar est faite avec `Box` + `background` color + fraction width
- **Tests** : impossible de tester un widget en JS — il faut Xcode (iOS) et l'émulateur Android avec home screen pour valider visuellement

---

## 7. Free vs Premium

### Free (par défaut)
- **3 comptes à rebours max** actifs (le 4e ouvre le paywall)
- **1 widget actif** maximum, **Mode A uniquement**, taille Small uniquement
- **Palette : 7 couleurs Free** (blue, green, purple, orange, pink, yellow, gray)
- **20 icônes** (sélection curée des plus universelles : anniversaire, voyage, cœur, étoile, calendrier, cadeau, travail, maison, fête, etc.)
- **Notifications : jour J uniquement** (non configurable, fixe à l'heure de l'event ou 9h00 si event sans heure)
- **Export** : disponible (JSON + iCal)
- Pas de notes
- Pas de récurrence
- Pas de groupes (donc pas de Mode B même en preview)
- Pas de partage image
- Pas de Lock Screen widget
- Pas de thème sombre

### Premium (4,99 € à vie, paiement unique — 3,99 € au lancement)
- **Countdowns illimités**
- **Tous les widgets** : Modes A + B, toutes tailles (Small, Medium, Large), Lock Screen iOS
- **Palette complète** : les 21 couleurs
- **Toutes les icônes** : 80+ icônes, ajout régulier dans les updates
- **Notifications avancées** : multi-offsets configurables (1 semaine avant, 3 jours, 1 jour, 1 heure, 15 min, jour J — multi-select)
- **Notes** (280 caractères) sur chaque event
- **Récurrence** (annuelle / mensuelle / hebdomadaire)
- **Groupes** illimités (nécessaire pour le widget Mode B)
- **Partage image** : générer une carte PNG pour Stories / iMessage / WhatsApp
- **Tri & filtres avancés** (par groupe, par couleur)
- **Thème sombre**

### Paywall — déclencheurs
- 4e tentative de création de countdown
- Tap sur une couleur Premium dans le picker
- Tap sur une icône Premium dans le picker
- Tap sur "Activer la récurrence"
- Tap sur "Créer un groupe"
- Tap sur "Ajouter au widget Medium/Large"
- Tap sur le bouton "Partager" du détail
- Bouton "Passer Premium" dans Settings

### Paywall — design
- Sheet plein écran, fond `linear-gradient(150deg, #FAFAF7 0%, #F5F3EE 100%)`
- Titre fort en haut (28pt, 600) : `"Tout débloquer, pour toujours"`
- Sous-titre (15pt, 0.6) : `"Un paiement unique. Aucun abonnement."`
- 3 ou 4 cards visuelles (pas de bullet list) montrant : *Countdowns illimités*, *Tous les widgets*, *Toutes les couleurs & icônes*, *Partage & notes*
- Bouton plein large bas : `"Débloquer pour [PRIX] €"` (fond `#1A1A1A`, texte blanc) — le prix vient dynamiquement de StoreKit / Play Billing (jamais hardcodé)
- **Pendant les 4 premières semaines** : badge discret au-dessus du bouton `"🎉 Tarif de lancement"` + petit texte barré `4,99 €` à côté du `3,99 €` actif. Pas de countdown agressif. Pas de pop-up "plus que X jours".
- Lien discret dessous : `"Restaurer mes achats"`
- Aucun timer faux/manipulateur, aucune barre "X% off" criarde — le badge "Tarif de lancement" doit rester sobre, dans l'esprit calme de l'app

---

## 8. Animations & micro-interactions

Toutes en `react-native-reanimated v3` (worklets natifs).

- **Card tap** : scale 0.97 (spring damping 18)
- **Création countdown** : sheet slide-up (spring), backdrop fade
- **Suppression** : swipe gauche révèle bouton rouge soft (`#FFE7E7` fond, `#B8383E` texte) puis card slide-out + fade
- **Progress bar** : `withTiming` 600ms easing out-cubic quand la card apparaît, pour qu'on voie la barre se remplir jusqu'à sa valeur actuelle
- **Picker couleur** : pastille sélectionnée scale 1.1 + ring `dark` à 30%
- **Number countdown** : `Reanimated.useDerivedValue` + `Reanimated.Text` pour interpoler le nombre sans flicker (chiffres tabulaires obligatoires)
- **Confetti / célébration le jour J** : très discret, pastilles de la couleur de l'event qui flottent 2s sur le détail uniquement, jamais sur la liste

---

## 9. Notifications

- **Notifications locales uniquement** (`expo-notifications` ou `notifee`) — pas de push serveur
- Programmées à la création de l'event selon les offsets configurés
- Reprogrammées automatiquement pour les récurrences
- Texte localisé : `"C'est aujourd'hui : Anniversaire de Léa 🎉"`
- Pas de son par défaut (premium = calme)

---

## 10. Idées en plus (à valider ou garder pour V2)

À mon sens, ce qui mérite d'être discuté maintenant :

1. **Compte à rebours "depuis" (since)** — pas seulement "jusqu'à". Permet de tracker "1 an que j'ai arrêté de fumer", "3 mois depuis le déménagement". Implémentation gratuite (juste un flag sur l'event), grosse valeur perçue.

2. **Import depuis le calendrier système** — picker qui propose des événements iCal/Google déjà dans le calendrier. Gros gain UX, Premium probable.

3. **Partage en carte image** — générer un PNG du countdown (background coloré + grand chiffre + titre) pour Stories / iMessage. Très bon vecteur de croissance organique. Premium.

4. **Apple Watch complication** — pas urgent mais alignement parfait avec la philosophie widget-first. V2.

5. **iMessage extension** (iOS) — envoyer un countdown live dans un fil iMessage. Très geek mais effet wow. V2 ou V3.

6. **Mode "shared event"** — deux personnes partagent un même countdown via lien (mariage, voyage à deux). Demande un backend léger → V2.

À mon avis **éviter** au lancement :
- Catégories d'événements pré-faites avec emoji par défaut (ça vieillit mal et alourdit l'app)
- Modes sombres élaborés type AMOLED noir pur (pas dans l'identité poudrée)
- Sons / vibrations custom (over-engineering)

---

## 10bis. Identité visuelle & logo

### Pistes à explorer en design
Trois directions à mettre sur la table avec Claude Design, ordre de préférence :

1. **Cercle progressif** (favori) — un cercle aux 3/4 rempli sur fond pastel. Reprend la métaphore de la progress bar de l'app. Très moderne, fonctionne bien à toutes les tailles, reconnaissable instantanément. Variantes : rempli à 75% ou avec un point lumineux en bout d'arc.

2. **Sablier géométrique** — deux triangles inversés stylisés, jouant sur deux couleurs de la palette (ex. pink → purple). Renvoie au temps de manière universelle. Risque : connoté "minuteur de cuisine" si pas assez travaillé.

3. **Page calendrier minimaliste** — feuille de calendrier avec un point coloré, à la Things 3 / Fantastical. Très "App Store premium". Risque : se confond avec les apps calendrier classiques.

Pistes complémentaires à considérer :
- **Goutte / forme organique qui se remplit** — moins évident mais plus poétique
- **Lever de soleil** — proposé initialement, trop connoté wellness/méditation, à éviter
- **Lettre B stylisée** — initiale "Bientôt", monogramme premium, mais moins évocateur fonctionnellement

### Contraintes techniques
- Format : SVG vectoriel pour génération de toutes les tailles
- **iOS** : 1024×1024 PNG sans alpha (App Store), + variantes Light / Dark / Tinted iOS 18
- **Android** : 512×512 PNG (Play Store) + Adaptive Icon (foreground + background séparés) pour Android 8+
- Fond : préférer un des `light` de la palette (`pink`, `lavender`, ou `peach`) pour cohérence avec l'app
- Pas de dégradé criard, pas d'ombre portée — l'icône doit respirer la même retenue que l'app

### Splash screen
- Fond identique au gradient global de l'app (`linear-gradient(150deg, #FAFAF7 0%, #F5F3EE 100%)`)
- Logo centré, taille modérée
- Aucun texte (le nom apparaît juste dans le système)
- Durée : aussi court que possible (juste le temps que React Native initialise)

---

## 10ter. Observabilité & analytics

**Stratégie** : tracking minimal, anti-intrusif, respectueux du positionnement premium/calme.

### Outils
- **Firebase Crashlytics** (iOS + Android) — crash reporting uniquement, c'est tout ce dont on a besoin
- Pas de Google Analytics, pas de Mixpanel, pas d'Amplitude, pas de Segment
- Pas de breadcrumbs intrusifs, pas de session replay

### Évènements à logger côté Crashlytics (custom keys sur les crashs)
- `app_version`, `os_version`, `locale`, `is_premium` (boolean), `events_count` (entier) — uniquement attachés aux crashs, pour les diagnostiquer
- Aucune donnée personnelle : pas de titres d'events, pas de noms de groupes, pas de dates

### Compteurs via les stores
- Installs, désinstallations, achats : via App Store Connect et Play Console nativement (gratuit, déjà dispo)
- Pas besoin d'un produit tiers pour ça

### Privacy
- **Pas de pop-up ATT** (App Tracking Transparency iOS) — on ne track personne en dehors de l'app
- Pas de cookie consent — pas de web component, pas de tracker tiers
- Privacy Manifest iOS rempli a minima : "data collected for app functionality only"

---

## 10quater. Tests

> Choix calibré pour un dev solo : Detox écarté volontairement. Detox demande un setup CI lourd (simulateurs orchestrés, app builds dédiés, flakiness à gérer) qui coûte plus de temps qu'il n'en fait gagner sur un projet à une seule paire de bras. Les flows critiques sont couverts par des tests unitaires forts (`utils`, `hooks`, `reducers`) + tests de composants + snapshot widgets natifs.

### Stack
- **Jest** — unit tests pour la logique pure (utils, reducers, hooks de calcul)
- **React Native Testing Library** — tests de composants (rendu, interactions, accessibility queries)
- **Reactotron** — observation des re-renders et calculs coûteux en dev (cf. `performance.md`)
- **XCTest** côté iOS pour les widgets natifs (snapshot tests sur les vues SwiftUI)
- **Robolectric** côté Android pour les widgets Glance (snapshot tests Compose)

### Couverture cible

**Unit / utils** (priorité critique — base de la fiabilité de l'app) :
- `timeUntil(targetDate)` : tous les cas (futur lointain, proche, jour J, passé, < 1h, > 1 an)
- `progressFor(createdAt, targetDate)` : règle fenêtre glissante 1 an, edge cases (event créé < 365j, event créé > 365j, event passé)
- Calcul de prochaine occurrence pour `RECURRENCE.YEARLY` / `MONTHLY` / `WEEKLY` (incluant années bissextiles, fin de mois)
- Sérialisation/désérialisation : `eventReducer` round-trip (Event → JSON → EventApi → Event)
- Formatage compteur compact (`12j`, `3m`, `J-1`, `Auj.`) avec i18n
- `paletteResolver` et `iconResolver`
- Calcul de quota Free (compte des events actifs vs 3)

**Hooks** (priorité haute) :
- `useEventsQuery` : retour bien typé, états pending/error
- `useCreateEventMutation` : déclenche le sync widget, optimistic update propre, rollback en cas d'erreur
- `usePremiumQuery` : lit le statut depuis le cache local puis confirme via StoreKit/Billing

**Composants** (priorité moyenne) :
- `EventCard` avec différents états (futur lointain, proche, jour J, passé, récurrent)
- `ColorPicker` et `IconPicker` (interaction + état Premium verrouillé déclenchant le paywall)
- `PaywallCard` (rendu, bouton acheter, badge "Tarif de lancement" conditionnel)

**Snapshot widgets natifs** (priorité haute) :
- 3 scénarios par mode (jour J, dans 30j, dans 1 an) × 2 modes (A, B) × 3 tailles (S, M, L) = **18 snapshots iOS** + **18 Android**
- Permet de détecter visuellement toute régression sur le rendu widget sans avoir à les tester manuellement à chaque build

### Pourquoi pas de E2E

Trois raisons assumées :
1. **Coût/bénéfice** : Detox prend ~1-2 semaines à mettre en place proprement et exige une maintenance constante. Mieux investi sur du test unitaire serré.
2. **Validation humaine compense** : en dev solo, tu touches à l'app tous les jours. Les régressions visibles arrivent rarement aux mains des utilisateurs si le test manuel est rigoureux.
3. **TestFlight + Play Internal** : tes early users servent de E2E de fait, avec une UX plus fluide pour eux et un feedback direct vers toi via la page Dépannage.

Si la base utilisateurs grossit fortement et que les flows critiques se multiplient (sync cloud V2, partage, etc.), réintégrer Detox en V2. Pas avant.

### Commandes
```
yarn test                # tous les tests Jest
yarn test:watch          # mode watch (dev)
yarn test:coverage       # rapport de couverture (cible : 80% sur utils, 60% global)
yarn test:ios:widget     # XCTest sur l'extension widget iOS
yarn test:android:widget # Robolectric sur le widget Glance
```

---

## 10quinquies. Accessibilité

### iOS
- **VoiceOver** : chaque card a un label complet `"Anniversaire de Léa, dans 12 jours, le 25 décembre"`. Widgets idem.
- **Dynamic Type** : tous les textes scalent sauf les chiffres du compteur (sinon ça casse les layouts widgets). Tailles fixées avec `UIFontMetrics` pour les autres.
- **Reduce Motion** : désactive les confettis et l'animation d'apparition de la progress bar (passe en `withTiming` 0ms)
- **Increase Contrast** : si activé, on switch automatiquement le texte principal du noir doux `#1A1A1A` vers `#000000` pur

### Android
- **TalkBack** : équivalent VoiceOver
- **Font Scale system** : même logique que Dynamic Type
- **Animator durations off** : respect du paramètre dev/accessibilité Android

### Contrastes — à valider
- Tous les `dark` de la palette doivent passer **WCAG AA** (ratio ≥ 4.5) sur leur `light` correspondant pour le texte
- Petite ombre d'opacité 0.04 sur les cards pour les utilisateurs Increase Contrast
- À auditer une fois en design avec un outil type Stark ou Contraste

---

## 10sexies. CI / Release

> **Contexte** : Ronan développe seul sur Bientôt. La CI est dimensionnée en conséquence — automatiser ce qui fait gagner du temps réel, pas reproduire une infra d'équipe.

### Stack
- **Fastlane** — orchestration iOS + Android (priorité absolue, c'est ce qui te fait économiser des heures à chaque release)
- **GitHub Actions** — runners pour les builds (macOS pour iOS, Ubuntu pour Android). Optionnel au démarrage : tu peux très bien builder en local au début et migrer vers GitHub Actions quand le projet aura grossi.
- **App Store Connect API key** pour TestFlight & release iOS
- **Service account JSON** pour Google Play Console
- **Firebase App Distribution** comme canal de bêta interne (toi + cercle proche)

### Lanes Fastlane principales

**iOS** :
- `lane :beta` → build, signe, upload sur Firebase App Distribution (testeurs internes Ronan + cercle proche)
- `lane :testflight` → build, signe, upload sur TestFlight (bêta externe ~50 testeurs)
- `lane :release` → build, signe, upload sur App Store Connect en draft (review manuelle ensuite)

**Android** :
- `lane :beta` → build APK, upload sur Firebase App Distribution
- `lane :internal` → build AAB, upload sur la Internal track de Play Console
- `lane :production` → build AAB, upload en Production avec rollout staged 10% → 50% → 100%

### Versioning
- **Semver** strict : `MAJOR.MINOR.PATCH` (ex. `1.0.0`, `1.1.0`, `1.1.1`)
- `build number` iOS : auto-incrémenté à chaque build via Fastlane
- `versionCode` Android : auto-incrémenté de la même façon
- Changelog généré depuis les commits (convention `feat:`, `fix:`, `chore:`)

### Git workflow allégé (dev solo)
- **Branche `main`** comme branche principale, déployable à tout moment
- **Branches `feat/...` ou `fix/...`** pour les chantiers en cours, merge dans `main` via squash quand c'est prêt
- Pas besoin de PR review formelle (tu es seul). Mais utiliser les PR GitHub quand même pour bénéficier de la trace + des checks CI automatiques (lint, tests, typecheck)
- Tags Git sur chaque release (`v1.0.0`, `v1.0.1`...) — utile pour retrouver le commit exact d'une version sur les stores
- Pas de `develop`, pas de gitflow complexe — over-engineering pour un dev solo

---

## 10septies. Légal & conformité

### Documents obligatoires pour les stores
- **Politique de confidentialité** — page web statique hébergée (Vercel / Cloudflare Pages gratuit). Contenu : "Bientôt ne collecte aucune donnée personnelle. Toutes vos dates sont stockées localement sur votre appareil. Firebase Crashlytics collecte uniquement les rapports de plantage anonymes."
- **CGU / Terms of Service** — courtes, claires. Template iubenda ou rédaction sur-mesure (préférable, ton de l'app oblige).
- **Mentions légales** — éditeur, contact, hébergeur de la page web.

### Conformité stores
- **App Store** :
  - Privacy Nutrition Labels remplis (catégorie "Data Not Collected" pour tout sauf Crashlytics qui rentre dans "Diagnostics")
  - Privacy Manifest (`PrivacyInfo.xcprivacy`) avec les Required Reason API déclarés
  - Age rating : 4+
- **Play Store** :
  - Data Safety form rempli (mêmes infos)
  - Target API niveau actuel exigé par Google
  - Age rating : Everyone

### RGPD
- Bannière de consentement : **pas nécessaire** puisqu'on ne track pas
- Mais : ajouter dans Settings un bouton "Supprimer toutes mes données" qui efface MMKV + le App Group + reset l'app (pour la conformité au "droit à l'oubli", même si techniquement tout est local)

---

## 11. Roadmap suggérée

> **Estimations calibrées pour un dev solo** (Ronan). Comptent un effort soutenu mais sans crunch — temps incluant design, dev, tests, debug, et apprentissage Swift/Kotlin pour les widgets natifs.

**V1.0 — Lancement** (~10-14 semaines en solo, vs 6-8 en équipe)
- CRUD countdowns avec règle "fenêtre 1 an" pour la progress bar
- Palette complète (7 Free + 14 Premium) + 80 icônes (20 Free + 60 Premium) + emoji libre
- Liste + détail + création + onglet "Passés"
- Onboarding 3 écrans skippables
- **Page À propos** (philosophie indie, le développeur, crédits, lien avis store)
- **Page Dépannage & contact** (FAQ, 3 boutons mailto pré-remplis avec metadata, roadmap publique)
- **Widgets iOS** (Small/Medium/Large modes A & B) écrits en SwiftUI
- **Widgets Android** (2×2 / 4×2 / 4×4 modes A & B) écrits en Kotlin/Glance
- TurboModule `WidgetBridge` (iOS + Android) avec schéma JSON versionné
- Notifications locales via Notifee (jour J Free / multi-offsets Premium)
- Paywall + IAP 4,99 € (3,99 € en tarif de lancement 4 semaines) — StoreKit 2 + Play Billing v6
- Export JSON + iCal
- i18n fr / en / es
- Thème clair uniquement
- Firebase Crashlytics
- Suite de tests Jest + RNTL + snapshot widgets natifs
- Fastlane (TestFlight / Play Internal / Firebase App Distribution)
- Privacy policy + CGU + Data Safety / Privacy Labels

### Découpage suggéré V1.0 par sprints solo (~2 semaines chacun)

1. **Setup & fondations** : init RN CLI bare, TS strict, ESLint/Prettier selon `REACT-NATIVE.md`, MMKV chiffré + Keychain, TanStack Query + persister, navigation 3 niveaux, i18n. Mise en place CI/Fastlane minimale.
2. **Design system & écrans core** : palette, typo, composants UI (Card, Button, Picker), liste home, détail event, création event (formulaire complet).
3. **Widgets iOS** : extension Xcode, App Group, TurboModule bridge, Mode A + Mode B sur les 3 tailles. C'est le sprint le plus risqué — réserver du buffer pour l'apprentissage SwiftUI.
4. **Widgets Android** : équivalent côté Glance/Kotlin. Plus court que iOS car tu commences avec l'expérience du bridge déjà en place.
5. **Paywall, IAP, free/premium** : intégration StoreKit + Play Billing, paywall, déclencheurs partout dans l'app, gestion des cas d'erreur.
6. **Polish, tests, légal, store assets** : onboarding final, screenshots App Store / Play Store, privacy policy hébergée, tests unitaires sur les flows critiques, soumission stores.

**Conseil dev solo** : ne pas chercher la perfection à chaque sprint. Avancer en MVP fonctionnel sur tout le scope, puis polir en dernier sprint. Tu auras toujours le réflexe de vouloir tout peaufiner — résiste.

**V1.1** (~2-3 semaines après)
- Mode "since" (compte à rebours inversé)
- Partage en carte image (Stories / iMessage)
- Récurrences (annuelle/mensuelle/hebdo)
- Thème sombre

**V1.2**
- Mode C (Stack) + Mode D (Timeline) sur widget Large
- Live Activities iOS + Dynamic Island
- Lock Screen widgets iOS (`accessoryCircular`, `accessoryRectangular`, `accessoryInline`)

**V2**
- Import depuis le calendrier système
- Sync iCloud / Google Drive
- Apple Watch complication
- Mode shared event (backend léger)

---

## 12. Points à valider avec Ronan avant de coder

Résolu :
- ✅ Nom : **Bientôt**
- ✅ **Code régi par `REACT-NATIVE.md` + sous-fichiers (cf. §2.0) — lecture obligatoire avant tout dev**
- ✅ Pas d'Expo — RN CLI bare
- ✅ V1 = modes widgets A + B uniquement
- ✅ **4,99 € one-shot** (3,99 € pendant 4 semaines en tarif de lancement), freemium limité à 3 events, 7 couleurs, 20 icônes
- ✅ Couleurs et icônes verrouillées en Premium au-delà du quota Free
- ✅ Icônes : SF Symbols (iOS) + Material Symbols (Android) via mapping par concept, **+ emojis libres** comme option
- ✅ Liste des 20 icônes Free définie
- ✅ Mode sombre reporté (V1.1 ou après)
- ✅ Règle progress bar : fenêtre glissante 1 an
- ✅ Onglet "Passés" pour events non-récurrents échus ; récurrents auto-rescheduled
- ✅ Timezone : stockée à la création, affichée dans le fuseau actuel
- ✅ Notifications Free = jour J / Premium = multi-offsets
- ✅ Export : JSON + iCal au choix
- ✅ Onboarding 3 écrans skippables, langue silencieuse, permission notifs contextuelle
- ✅ Crashlytics seul tracking, pas d'analytics
- ✅ Tests Jest + RNTL + snapshot widgets natifs (Detox volontairement écarté, justifié pour dev solo)
- ✅ Fastlane + GitHub Actions + Firebase App Distribution
- ✅ Logo : 3 directions à explorer en design (cercle progressif, sablier, calendrier)
- ✅ **État global : TanStack Query v5 avec persister MMKV** (pas de Zustand, pas de Redux)
- ✅ **Storage : MMKV chiffré avec clé Keychain** côté app + **App Group en clair pour les events lus par le widget** (cf. §2.4)
- ✅ **Architecture par features** stricte selon `architecture.md` (events, widgets, paywall, settings, about, help, onboarding, groups)
- ✅ **Navigation 3 niveaux** : root → tab navigator (écrans racines) + details stack (écrans profonds), `NavigatorUtils` hors composants
- ✅ **Couleurs : palette (donnée) vs theme (UI sémantique)** strictement séparés
- ✅ **i18n** : `i18n-js` + helper `translate()` maison, structure `common.*` / `error.[domaine].*` / `success.[domaine].*` / `[feature].*`

À trancher avant le démarrage tech :
- [ ] **Bundle ID iOS** (proposition : `fr.bientot.app`)
- [ ] **App Group identifier** iOS (proposition : `group.fr.bientot.shared`)
- [ ] **Package Android** (proposition : `fr.bientot.app`)
- [ ] **Domaine pour la privacy policy** (`bientot.app`, `bientot.fr`, autre ?)
- [ ] **Adresse mail de contact** pour la page Dépannage (proposition : `hello@bientot.app`)
- [ ] **Photo / illustration du dev** ou symbole pour la page À propos (à toi de choisir)
- [ ] **Texte personnel** du dev sur la page À propos (à écrire avec ta voix)
- [ ] **Compléter la liste Premium** des ~60 icônes restantes (en design avec mood board)
- [ ] **Logo finalisé** (en design avec Claude Design, à partir des 3 directions)
