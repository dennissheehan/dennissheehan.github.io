// Power-Up client.js version 1.3 - stable with truncation + safe Promises

const GRAY_ICON = 'https://a.trellocdn.com/prgb/dist/images/directory/icons/customIcon.87d05cbf7f7f7d4965e8.png';

// Safely get full card details
function getCardName(t) {
  return t.card("all").then((data) => {
    sessionStorage.setItem("storedCardID", encodeURI(data.id));
    sessionStorage.setItem("storedCardName", encodeURIComponent(data.name));
    sessionStorage.setItem("storedShortID", encodeURI(data.shortLink));
    return true; // Return something to satisfy Promise.all
  });
}

// Get board ID
function getBoardID(t) {
  return t.board("id").then((data) => {
    sessionStorage.setItem("storedBoardID", encodeURI(data.id));
    return true;
  });
}

// Get Trello username
function getMember(t) {
  return t.member("username").then((data) => {
    sessionStorage.setItem("storedMemberUsername", encodeURI(data.username));
    return true;
  });
}

// Initialize Power-Up
window.TrelloPowerUp.initialize({
  'card-back-section': function (t, options) {
    return Promise.all([
      getCardName(t),
      getBoardID(t),
      getMember(t)
    ]).then(() => {
      // Read and validate parameters
      const cardID = sessionStorage.getItem("storedCardID") || "";
      const boardID = sessionStorage.getItem("storedBoardID") || "";
      const shortID = sessionStorage.getItem("storedShortID") || "";
      const username = sessionStorage.getItem("storedMemberUsername") || "";

      let rawCardName = sessionStorage.getItem("storedCardName") || "Untitled";
      console.log("⚠️ Raw storedCardName:", rawCardName);

      let cardName = decodeURIComponent(rawCardName);

      // Truncate if needed
      if (cardName.length > 100) {
        cardName = cardName.substring(0, 97) + "...";
      }

      cardName = encodeURIComponent(cardName);

      // Clear session for safety
      sessionStorage.clear();

      // Debug log
      console.log("✅ PowerUp debug params:", {
        cardID, boardID, shortID, username, cardName: decodeURIComponent(cardName)
      });

      // Construct PowerApps link
      const baseUrl = "https://apps.powerapps.com/play/c62e6a59-12d2-432c-ae16-46ad74bc1157?tenantId=4e9dbbfb-394a-4583-8810-53f81f819e3b";
      const constructedUrl = `${baseUrl}&cardId=${cardID}&boardId=${boardID}&idShort=${shortID}&username=${username}&cardName=${cardName}`;

      return {
        title: "Time Tracking",
        icon: GRAY_ICON,
        content: {
          type: 'iframe',
          url: t.signUrl(constructedUrl),
          height: 500
        }
      };
    });
  }
});
