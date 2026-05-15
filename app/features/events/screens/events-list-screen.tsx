import { memo } from 'react';

import PlaceholderScreen from '~shared/components/PlaceholderScreen';
import { translate } from '~i18n/translate';

const EventsListScreen = memo(() => {
  return <PlaceholderScreen title={translate('events.title')} />;
});

export default EventsListScreen;
