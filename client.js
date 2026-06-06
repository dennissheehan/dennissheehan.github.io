// Power-Up client.js version 1.4
// Removes sessionStorage to avoid intermittent blank / Untitled launches

const GRAY_ICON = 'https://a.trellocdn.com/prgb/dist/images/directory/icons/customIcon.87d05cbf7f7d4965e8.png';

const POWERAPP_BASE_URL =
  'https://apps.powerapps.com/play/c62e6a59-12d2-432c-ae16-46ad74bc1157?tenantId=4e9dbbfb-394a-4583-8810-53f81f819e3b';

function truncateText(value, maxLength) {
  if (!value) return '';
  return value.length > maxLength ? value.substring(0, maxLength - 3) + '...' : value;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

window.TrelloPowerUp.initialize({
  'card-back-section': function (t, options) {
    return Promise.all([
      t.card('id', 'name', 'shortLink'),
      t.board('id'),
      t.member('username')
    ])
      .then(function ([card, board, member]) {
        const cardIDRaw = card?.id || '';
        const boardIDRaw = board?.id || '';
        const shortIDRaw = card?.shortLink || '';
        const usernameRaw = member?.username || '';
        const cardNameRaw = truncateText(card?.name || '', 100);

        console.log('✅ PowerUp debug params:', {
          cardID: cardIDRaw,
          boardID: boardIDRaw,
          shortID: shortIDRaw,
          username: usernameRaw,
          cardName: cardNameRaw
        });

        const hasValidContext =
          hasValue(cardIDRaw) &&
          hasValue(boardIDRaw) &&
          hasValue(shortIDRaw) &&
          hasValue(usernameRaw) &&
          hasValue(cardNameRaw) &&
          cardNameRaw !== 'Untitled';

        if (!hasValidContext) {
          console.warn('⚠️ Missing Trello context. PowerApps not loaded.', {
            cardID: cardIDRaw,
            boardID: boardIDRaw,
            shortID: shortIDRaw,
            username: usernameRaw,
            cardName: cardNameRaw
          });

          return {
            title: 'Time Tracking',
            icon: GRAY_ICON,
            content: {
              type: 'iframe',
              url: t.signUrl('about:blank'),
              height: 100
            }
          };
        }

        const constructedUrl =
          POWERAPP_BASE_URL +
          '&cardId=' + encodeURIComponent(cardIDRaw) +
          '&boardId=' + encodeURIComponent(boardIDRaw) +
          '&idShort=' + encodeURIComponent(shortIDRaw) +
          '&username=' + encodeURIComponent(usernameRaw) +
          '&cardName=' + encodeURIComponent(cardNameRaw);

        return {
          title: 'Time Tracking NEW VERSION 6/6/2026',
          icon: GRAY_ICON,
          content: {
            type: 'iframe',
            url: t.signUrl(constructedUrl),
            height: 500
          }
        };
      })
      .catch(function (error) {
        console.error('❌ Error loading Time Tracking:', error);

        return {
          title: 'Time Tracking',
          icon: GRAY_ICON,
          content: {
            type: 'iframe',
            url: t.signUrl('about:blank'),
            height: 100
          }
        };
      });
  }
});
