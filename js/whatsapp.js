function simulateMouseEvents(element, eventName) {
    var mouseEvent= document.createEvent('MouseEvents');
    mouseEvent.initEvent(eventName, true, true);
    element.dispatchEvent(mouseEvent);
}

var looper = looper || 0;
var selectConversation = function() {
  return new Promise(function(resolve, reject) {
    if ( conversation_title == '/' || conversation_title == '' ) {
      resolve();
    }
      else if ( conversation_title == 'unread' ) {
          var $conversation = jQuery('[dir=auto][title]').parent().parent().parent().parent().toArray().filter(t=>$(t).children(":eq(1)").children(":eq(1)").children(":eq(1)").text()).map(t=>$(t));
          if (!$conversation || !$conversation.length) {
              resolve();
          }
          var conversation = $conversation[looper++ % $conversation.length][0];
          conversation.click();
          simulateMouseEvents( conversation , 'mousedown');
          resolve();
      }
    else {
      // also checking .ellipsify as Group Members will also be shown with title attribute
      var $conversation = jQuery('[dir=auto][title^="' + conversation_title + '"]');
      // fallback to "any substring" if a conversation starting with the arg is not found
      var conversation = $conversation.length ? $conversation[0] : jQuery('[dir=auto][title*="' + conversation_title + '"]')[0];
      conversation.click();
      simulateMouseEvents( conversation , 'mousedown');
      resolve();
    }
  });
};

var insertMessage = function() {
  return new Promise(function(resolve, reject) {
    var $element = jQuery("div.copyable-text.selectable-text").text(message);
    const event = new Event('input', { bubbles: true })
    $element[0].dispatchEvent(event)
    resolve();
  });
};

var sendMessage = function() {
  return new Promise(function(resolve, reject) {
    var sendButton = $("[data-icon=send]").parent();
    sendButton.click();
    resolve();
  });
};

selectConversation().then(function() {
  if( $.trim(message) != '' ) {
    msgs = '';
    insertMessage().then(function() {
      sendMessage().then(function() {});
    });
  }
  else {
    msgs = jQuery("[data-pre-plain-text]").slice(-5)
             .toArray().map( function(j) {
               return j.dataset.prePlainText +
                 j.innerText.replace( /\d+:\d+\n/, '' )
             }).join('');
  }
});
