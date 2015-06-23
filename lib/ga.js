AnalyticsTester = {
  accounts: {},

  clearAllAccountsEvents: function() {
    for (var key in this.accounts) {
      this.accounts[key].clearEvents();
    }
  },

  getTrackerAndEvent: function(value) {
    var trackerAction = value[0].split(".");
    var action, params;

    if (trackerAction.length == 1) {
      return { tracker: "main", action: value.shift(), params: value };

    } else {
      value.shift();
      return { tracker: trackerAction[0], action: trackerAction[1], params: value }
    }
  },

  trackerTemplate: {
    clearEvents: function() {
      this.events = [];
    },
    _getAccount: function() {
      return this.ua;
    },
    _getName: function() {
      return this.trackerName;
    }
  },

  trackerInit: function(trackerName) {
    var tracker = Object.create(this.trackerTemplate);
    tracker.events = [];
    tracker.trackerName = trackerName;
    this.accounts[trackerName] = tracker;

    return tracker;
  },

  loadGaCommand: function(gaCommand) {
    var account = this.loadTracker(gaCommand.tracker);

    switch(gaCommand.action) {
    case "_setAccount":
        account.ua = gaCommand.params[0];
        break;

    case "_setCookiePath":
        account.cookiePath = gaCommand.params[0];
        break;

    case "_setDomainName":
        account.domainName = gaCommand.params[0];
        break;

    case "_trackPageview":
    case "_trackEvent":
        var event = { action: gaCommand.action, params: gaCommand.params };
        account.events.push(event);
        break;

    default:
        console.log("unkown how to process event: ", gaCommand);
    }
  },

  loadTracker: function(tracker) {
    return this.accounts[tracker] || this.trackerInit(tracker);
  }
};

window._gaqFake = {
  push: function(value) {
    var gaCommand = AnalyticsTester.getTrackerAndEvent(value);
    AnalyticsTester.loadGaCommand(gaCommand);
  }
}

if (_gaq !== undefined && Array.isArray(_gaq)) {
  for (var index in _gaq) {
    _gaqFake.push(_gaq[index]);
  }
}

window._gaq = _gaqFake;

window._gat = {
  _getTrackers: function() {
    return AnalyticsTester.accounts;
  }
}
