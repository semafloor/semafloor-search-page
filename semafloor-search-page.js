  var _notafulldate = new Date();
  var _notayear = _notafulldate.getFullYear();
  var _notamonth = _notafulldate.getMonth();
  var _notadate = _notafulldate.getDate();
  var _time = _notafulldate.toTimeString().slice(0, 5);
  var _sitesArray = ['Any Site','KLB - Tower 5','KLB - Tower 2A','SUITE'];
  var _floorsArray = ['Any Floor','Level 1','Level 2','Level 3','Level 3A','Level 5','Level 6',
    'Level 7','Level 8','Level 9','Level 10','Level 11','Level 12',];
  var _typesArray = ['ar','pb','pca','pcv','pj','pcf','pf','spf','sb','tp','tv','wg'];
  var _typesResult = [0,0,0,0,0,0,0,0,0,0,0,0];
  var _bodyTarget;
  var _roomTypes = ['Adjoining Room (Operable Wall)','Panaboard','Polycom CX100 (Audio)',
    'Polycom CX5000 (Video Conferencing)','Projector','Projector Cable Faulty',
    'Projector Faulty','Screen Projector Faulty','SmartBoard 800',
    'Telepresence','TV','Writing Glass Board'];
  var _floorsCode = ['','01level','02level','03level','04level','05level','06level',
    '07level','08level','09level','10level','11level','12level'];

  Polymer({

  is: 'semafloor-search-page',

  properties: {
    uid: {
      type: String,
      value: 'google:9999'
    },

    _searchUrl: {
      type: String,
      value: 'https://semafloor-webapp.firebaseio.com'
    },

    _allDayToggle:  {
      type: Boolean,
      value: false
    },
    _capacity: {
      type: Number,
      value: 1
    },
    _allFloors: {
      type: Array,
      value: function() {
        return [1];
      }
    },
    _allSites: {
      type: Array,
      value: function() {
        return [1];
      }
    },
    _inputFloor: {
      type: String,
      value: 'Any Floor'
    },
    _floor: {
      type: String,
      value: 'Any Floor'
    },
    _floors: {
      type: String,
      value: ''
    },
    _inputSite: {
      type: String,
      value: 'Any Site'
    },
    _site: {
      type: String,
      value: 'Any Site'
    },
    _sites: {
      type: String,
      value: ''
    },
    _inputCap: Number,
    _totalCap: {
      type: Array,
      value: function() {
        return _.fill(Array(99), 1);
      }
    },
    _toDate: {
      type: String,
      value: function() {
        return [_notayear, ('0' + (_notamonth+1)).slice(-2), _notadate].join('-');
      }
    },
    _toTime: {
      type: String,
      value: function() {
        return _time;
      }
    },
    _fromDate: {
      type: String,
      value: function() {
        return [_notayear, ('0' + (_notamonth+1)).slice(-2), _notadate].join('-');
      }
    },
    _fromTime: {
      type: String,
      value: function() {
        return _time;
      }
    },
    _types: String,
    _emptyRoomResult: Object,
    _resultSites: Array,
    // _resultFloors: Array,
    _selectedSiteTab: {
      type: Number,
      value: 0
    },
    _selectedFloorTab: {
      type: Number,
      value: 0
    },
    _floorsOfSites: Array,
    _roomsOfFloors: Array,
    _loadSearchResult: {
      type: Number,
      value: 0
    },
    _selectedRoomInfo: Object,
    _tapRipple: {
      type: Boolean,
      value: false
    },
    _roomIdx: Number,
    _reserveRoomMsg: String,
    _hideSiteToolbar: {
      type: Boolean,
      value: false
    },
    _skipComputeSelected: Boolean,
    _prevFloor: String,

    _selectedRoom: Object,

    _isLoading: Boolean,
    _roomReserved: Boolean,
  },

  observers: [
    '_hideTime(_allDayToggle)',
    '_showFloorsInTab(_emptyRoomResult, _selectedSiteTab)',
    '_setPrevFloor(_selectedFloorTab)',
    '_showRoomsInTab(_emptyRoomResult, _selectedSiteTab, _selectedFloorTab)',
    '_updateSearchUrl(uid)',
    '_closeRoomDialogAfterLoading(_roomReserved)',
    '_proceedToReserveRoom(_isLoading)'
  ],

  // Element Lifecycle

  ready: function() {
  // `ready` is called after all elements have been configured, but
  // propagates bottom-up. This element's children are ready, but parents
  // are not.
  //
  // This is the point where you should make modifications to the DOM (when
  // necessary), or kick off any processes the element wants to perform.
  },

  attached: function() {
    // `attached` fires once the element and its parents have been inserted
    // into a document.
    //
    // This is a good place to perform any work related to your element's
    // visual state or active behavior (measuring sizes, beginning animations,
    // loading resources, etc).
    var _dialog = this.$.optionsDialog;
    _dialog.animationConfig = {
      'entry': {
        name: 'transform-animation',
        node: _dialog,
        transformFrom: 'translateY(100%)',
        transformTo: 'translateY(0)'
      },
      'exit': {
        name: 'transform-animation',
        node: _dialog,
        transformFrom: 'translateY(0)',
        transformTo: 'translateY(100%)'
      }
    };
    this.fire('search-page-attached');
  },

  detached: function() {
  // The analog to `attached`, `detached` fires when the element has been
  // removed from a document.
  //
  // Use this to clean up anything you did in `attached`.
  },

  // Element Behavior

  /**
  * The `semafloor-search-page-lasers` event is fired whenever `fireLasers` is called.
  *
  * @event semafloor-search-page-lasers
  * @detail {{sound: String}}
  */

  _onFirebaseValue: function(ev) {
    console.log(ev.detail.val());
  },

  _addPerson: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      this.$.addPersonDialog.open();
    }
    _target = null;
  },
  _updateCapacity: function(ev) {
    this.set('_capacity', this._inputCap);
  },

  _addSite: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      // dynamically generate sites inside dialog.
      if (this._allSites.length === 1) {
        this.set('_allSites', _sitesArray);
      }
      // open dialog then notifyResize it async-ly.
      this.$.addSiteDialog.open();
      this.async(function() {
        this.$.addSiteDialog.notifyResize()
      });
    }
    _target = null;
  },
  _updateSite: function() {
    var _site = _.indexOf(_sitesArray, this._inputSite);
    if (_site < 0) {
      this.set('_floor', 'Any Floor');
      this.set('_floors', '');
      this.set('_inputFloor', 'Any Floor');
      this.set('_sites', '');
      this.set('_site', 'Any Site');
      return;
    }

    var _siteCode = ['', 'alpha', 'beta', 'gamma'][_site];
    var _floor = (_siteCode === '' || _siteCode === 'alpha') ? 'Any Floor' :
    _siteCode === 'suite' ? 'Level 1' : 'Level 3';
    // automatically update `floors` when `sites` is updated.
    this.set('_floor', _floor);
    this.set('_floors', _floor === 'Any Floor' ? '' : _floor);
    this.set('_inputFloor', _floor);
    // update `site`.
    this.set('_sites', _siteCode);
    this.set('_site', this._inputSite);
  },

  _addFloor: function(ev) {
    var _target = ev.target;
    if (_target && _target.tagName === 'PAPER-BUTTON') {
      // generate floors inside dialog dynamically.
      if (this._allFloors.length === 1) {
        this.set('_allFloors', _floorsArray);
      }
      // open dialog then async-ly notifyResize dialog.
      this.$.addFloorDialog.open();
      this.async(function() {
        this.$.addFloorDialog.notifyResize();
      });
    }
    _target = null;
  },
  _updateFloor: function() {
    var _floor = _.indexOf(_floorsArray, this._inputFloor);
    if (_floor < 0) {
      this.set('_floors', '');
      this.set('_floor', 'Any Floor');
      return;
    }

    this.set('_floors', _floorsCode[_floor]);
    this.set('_floor', this._inputFloor);
  },

  _isDisabled: function(_site, _item) {
    function _updateMenu(_site) {
      // set `floors` on first time use;
      var _floor = _site === 'any' ? 'Any Floor' :
      (_site === 'suite' ? 'Level 1' : 'Level 3');
      if (_site === 'any') {
        this.set('_floor', 'Any Floor');
        this.set('_floors', '');
        this.set('_inputFloor', 'Any Floor');
        return _item !== 'Any Floor';
      }else {
        var _disabled = _item === _floor || _item === 'Any Floor';
        if (_disabled) {
          this.set('_floor', _floor);
          this.set('_inputFloor', _floor);
          this.set('_floors', _floor);
        }
        return !_disabled;
      }
    }

    switch (_site) {
      case 'KLB - Tower 2A':
        return _updateMenu.call(this, '2atower');
      break;
      case 'SUITE':
        return _updateMenu.call(this, 'suite');
      break;
      case 'Any Site':
        return _updateMenu.call(this, 'any');
      default:
        //  console.log('any floor for any site.');
        return false;
    }
  },

  _addFromDate: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      this.$.fromDate.open();
    }
    _target = null;
  },
  _addToDate: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      this.$.toDate.open();
    }
    _target = null;
  },
  _addFromTime: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      this.$.fromTime.open();
    }
    _target = null;
  },
  _addToTime: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-BUTTON') {
      this.$.toTime.open();
    }
    _target = null;
  },

  _hideTime: function(_toggle) {
    this.toggleClass('all-day-hide-time', _toggle, this.$.fromTimeButton);
    this.toggleClass('all-day-hide-time', _toggle, this.$.toTimeButton);
  },

  // get which `paper-checkbox` being checked or unchecked.
  _getWhatBeingChecked: function(ev) {
    var _target = ev.target;

    if (_target && _target.tagName === 'PAPER-CHECKBOX') {
      if (_target.hasAttribute('data-checked')) {
        var _chk = _target.getAttribute('data-checked');
        var _toggle = _target.checked;
        var _typeIdx = _.indexOf(_typesArray, _chk);
        var _typesBin, _typesHex;

        // modify value on corresponding index.
        _typesResult[_typeIdx] = +_toggle;

        // convert array into binary String then into HEX.
        _typesBin = _typesResult.join('');
        _typesHex = parseInt(_typesBin, 2).toString(16);

        // save final result.
        this._types = _typesHex;
      }
    }
  },

  // aggregate all inputs before sending it out as request.
  _sendParams: function(ev) {
    var _params = '';
    var _fromTime = this._fromTime;
    var _toTime = this._toTime;// body...

    if (this._allDayToggle) {
      _fromTime = '08:00';
      _toTime = '23:30';
    }

    //  console.log(this['_fromDate']);
    //  console.log(this._toDate);
    //  console.log(this._fromTime);
    //  console.log(this._toTime);
    //  console.log(this._allDayToggle);
    //  console.log(this._capacity);
    //  console.log(this._sites);
    //  console.log(this._floors);
    //  console.log(this._types);
    _params = 'startDate=' + encodeURIComponent(this._fromDate) + '&' +
      'endDate=' + encodeURIComponent(this._toDate) + '&' +
      'tStart=' + encodeURIComponent(_fromTime) + '&' +
      'tEnd=' + encodeURIComponent(_toTime) + '&' +
      'capacity=' + encodeURIComponent(this._capacity) + '&' +
      'site=' + encodeURIComponent(this._sites) + '&' +
      'floor=' + encodeURIComponent(this._floors) + '&' +
      'types=' + encodeURIComponent(this._types);

    console.log(_params);
    this.$.searchEmptyRoom.body = _params;
    this.$.searchEmptyRoom.generateRequest();
    // Reset _isLoading here is much safer before opening the responseDialog.
    this.set('_isLoading', false);
    // Reset _roomReserved here is much safer before opening the responseDialog.
    if (this._roomReserved) {
      this.set('_roomReserved', false);
    }
    this.$.responseDialog.open();
  },

  _onResponse: function(ev) {
    // check if return result is empty OR contains no room (totoalEmptyRooms : 0);
    var _isEmpty = this._isEmptyResultEmpty(this._emptyRoomResult);
    this.set('_skipComputeSelected', _isEmpty);
    this._hideSiteToolbar = _isEmpty;
    this._loadSearchResult = _isEmpty ? 2 : 1;
    // workaround: stop document scrolling;
    document.body.style.overflow = 'hidden';
  },

  _isEmptyResultEmpty: function(_emptyRoomResult) {
    return _.isEmpty(_emptyRoomResult) || _emptyRoomResult.totalEmptyRooms === 0;
  },

  _closeResponseDialog: function(ev) {
    // workaround: resume document scrolling;
    document.body.style.overflow = '';
    // reset _selectedSiteTab, _selectedFloorTab when closing responseDialog;
    this.set('_selectedSiteTab', 0);
    this.set('_selectedFloorTab', 0);
    // reset _loadSearchResult, _emptyRoomResult when closing responseDialog;
    this.set('_loadSearchResult', 0);
    this.set('_emptyRoomResult', null);
    this.$.responseDialog.close();
  },

  _computeSites: function(_emptyRoomResult) {
    var _siteKeys = _.keys(_emptyRoomResult);
    var _keysName = ['', 'alpha', 'beta', 'gamma'];
    _siteKeys = _siteKeys.filter(function(_key) {
      return _key === 'alpha' || _key === 'beta' || _key === 'gamma';
    });
    this._computeFloors(_siteKeys, _emptyRoomResult);
    _siteKeys = _siteKeys.map(function(_key) {
      return _sitesArray[_keysName.indexOf(_key)];
    });
    this.set('_resultSites', _siteKeys);
    return _siteKeys;
  },

  _computeFloors: function(_siteKeys, _emptyRoomResult) {
    var _floorKeys = [];
    for (var i = 0; i < _siteKeys.length; i++) {
      _floorKeys.push(_.keys(_emptyRoomResult[_siteKeys[i]]));
    }
    this.set('_resultFloors', _floorKeys);
  },

  _setPrevFloor: function(_selectedFloorTab) {
    if (this._selectedSiteTab === 0) {
      this.set('_prevFloor', _selectedFloorTab);
    }
  },

  _showFloorsInTab: function(_emptyRoomResult, _selectedSiteTab) {
    // skip this function if return result is empty;
    if (this._isEmptyResultEmpty(_emptyRoomResult)) {
      return;
    }

    var _floorsNumber = [
    '', '1', '2', '3', '3A', '5', '6', '7', '8', '9', '10', '11', '12'];
    var _siteKeys = _.keys(_emptyRoomResult);
    var _newFloors = _.keys(_emptyRoomResult[_siteKeys[_selectedSiteTab]]);
    var _newFloors = _newFloors.map(function(n) {
      return _floorsNumber[_floorsCode.indexOf(n)];
    });
    // workaround: to fix #selectionBar of paper-tabs to show properly;
    // notifyResize() on site tabs and floor tabs;
    if (_selectedSiteTab === 0) {
      this.set('_selectedFloorTab', this._prevFloor);
    }else {
      this.set('_selectedFloorTab', 0); // for beta and gamma, only 1 floor.
    }
    this.debounce('resizeTabs', function() {
      this.$.siteTabs.notifyResize();
      this.$.floorTabs.notifyResize();
    }, 1);

    this.set('_floorsOfSites', _newFloors);
  },

  _showRoomsInTab: function(_emptyRoomResult, _selectedSiteTab, _selectedFloorTab) {
    // skip this function if return result is empty;
    if (this._isEmptyResultEmpty(_emptyRoomResult)) {
      return;
    }

    var _newSite = _.keys(_emptyRoomResult)[_selectedSiteTab];
    var _newFloor = _.keys(_emptyRoomResult[_newSite])[_selectedFloorTab];
    _newFloor = _emptyRoomResult[_newSite][_newFloor];
    // workaround: to fix #selectionBar of paper-tabs to show properly;
    // notifyResize() on site tabs and floor tabs;
    this.debounce('resizeTabs', function() {
      this.$.siteTabs.notifyResize();
      this.$.floorTabs.notifyResize();
    }, 1);

    this.set('_roomsOfFloors', _newFloor);
  },

  _onDownRoom: function(ev) {
    console.log(ev);
    var _target = ev.target;
    while (_target && _target.tagName !== 'DIV') {
      _target = _target.parentElement;
    }
    if (_target) {
      this.set('_tapRipple', true);
      // compute and save room info;
      this.set('_roomIdx', _target.getAttribute('room-idx'));
      // this._computeRoomBasedOnIdx(_target.getAttribute('room-idx'));
      this.set('_selectedRoomInfo', ev.model.item);
    }
  },

  // _computeRoomBasedOnIdx: function(_idx) {
  //   var _err = this._emptyRoomResult;
  //   var _selectedSite = _.keys(_err)[this._selectedSiteTab];
  //   var _selectedFloor = _.keys(_err[_selectedSite])[this._selectedFloorTab];
  //   var _selectedRoom = _err[_selectedSite][_selectedFloor][_idx];
  //
  //   // save room info;
  //   this.set('_selectedRoomInfo', _selectedRoom);
  // },

  _onUpRoom: function(ev) {
    if (this._disableTap) {
      this.set('_disableTap', false);
      this.set('_tapRipple', false);
      return;
    }

    this.$.roomDialog.open();
    // workaround: to display backdrop in nested dialog;
    document.body.querySelector('iron-overlay-backdrop').style.zIndex = 103;
  },

  _onScroll: function(ev) {
    if (!this._tapRipple) {
      return;
    }

    //  console.log('scrolling...');
    // End ripple animation loop during scrolling...
    this.set('_disableTap', true);
    this.$$('#roomRipple' + this._roomIdx).upAction();
  },

  _onVertTap: function(ev) {
    console.log(ev);
    var _target = ev.target;
    while (_target && _target.tagName !== 'PAPER-ICON-BUTTON') {
      _target = _target.parentElement;
    }
    this.set('_roomIdx', _target.getAttribute('room-idx'));
    this.set('_selectedRoomInfo', ev.model.item);
    this.$.optionsDialog.open();
  },

  /* jshint ignore:start */
  /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
  _reserveRoom: function(ev) {
    console.log(this._selectedRoomInfo);
    console.log(this._fromDate, this._toDate, this._fromTime, this._toTime, this._allDayToggle);
    this._forceCloseOptions();

    // Set _isLoading to block further user interaction while loading Firebase.
    // Then the Observer will trigger method _transactionWithReservations once _isLoading is truthy.
    this.set('_isLoading', true);
  },
  // 0800 0830 | 0830 0900 | 0900 0930 | 0930 1000
  //    1    X |    1    X |    1    X |    1    X
  // 0800 0830 0900 | 0900 0930 1000 |
  //    1    1    X |    1    1    X |
  // 0800 0830 0900 0930 | 0930 1000 1030 1100 |
  //    1    1    1    X |    1    1    1    X |
  _computeTimeDec: function(_fromTime, _toTime, _allDayToggle) {
    var _timeBin;
    // if it's all day, all is 1s.
    if (_allDayToggle) {
      _timeBin = _.fill(Array(32), 1).join('');
      return parseInt(_timeBin, 2).toString(10);
    }
    // convert time string into index.
    function _timeToIdx(_timeInMin) {
      return Math.floor((_timeInMin - 480) / 30);
    }
    // convert time into minutes.
    function _timeToMin(_time, _isToTime) {
      var _hours = parseInt(_time.slice(0, 2));
      var _minutes = parseInt(_time.slice(-2));
      return _isToTime ? (_hours * 60 + _minutes - 1) : (_hours * 60 + _minutes);
    }

    var _fromTimeInMin = _timeToMin(_fromTime);
    var _toTimeInMin = _timeToMin(_toTime, true);
    var _startPos = _timeToIdx(_fromTimeInMin);
    var _timeLength = _timeToIdx(_toTimeInMin) + 1;
    _timeBin = _.fill(_.fill(Array(32), 0), 1, _startPos, _timeLength).join('');

    return parseInt(_timeBin, 2).toString(10);
  },
  _transactionWithReservations: function(_fromDate, _toDate, _timeDec, _selectedRoomInfo) {
    // TODO: Steps:
    // X) update room time.
    // b) update global reservation list so that current reservations will be updated.
    // c) update user's reservation list.

    var _monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'];
    var _fd = _fromDate;
    var _td = _toDate;
    var _totalDays = (+new Date(_td) - +new Date(_fd)) / 86400000 + 1;
    var _sd = new Date(_fromDate);
    var _sdfy = _sd.getFullYear();
    var _sdm = _sd.getMonth();
    var _sdd = _sd.getDate();
    // Get week number from date.
    function getWeek(_date) {
      var _now = new Date(_date);
      _now = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate() - _now.getDay() + 4);
      var onejan = new Date(_now.getFullYear(), 0, 1);
      return Math.ceil(((_now - onejan) / 86400000 + 1) / 7);
    }
    // Compute AND-ed or OR-ed timeHex and return the result to Firebase.
    function _updateData(_timeHex, _maskDec) {
      var _timeDec = parseInt(_timeHex, 16).toString(10);
      var _result = parseInt((_timeDec | _maskDec) >>> 0, 10).toString(16);

      return _result;
    }
    // siteNameToCode
    function _siteNameToCode(_siteName) {
      var _siteIdx = _sitesArray.indexOf(_siteName);
      return ['', 'alpha', 'beta', 'gamma'][_siteIdx];
    }
    // floorNameToCode
    function _floorNameToCode(_floorName) {
      var _floorIdx = _floorsArray.indexOf(_floorName);
      return _floorsCode[_floorIdx];
    }

    var _datesArray = [];
    // Date array.
    // X - TODO: To update room time for one or more dates.
    // Firebase ref to a room, KLB - Tower 5, Level 1, Taipei 101 on 2016-01-29:
    // ref - https://polymer-semaphore.firebaseio.com/mockMessages/
    // year - /2016
    // month - /00january
    // week - /week05
    // day - /29
    // site, level, room - /site/alpha/01level/taipei101
    // time - /time
    //
    // given params to compute date and time:
    // fromDate - this._fromDate
    // toDate - this._toDate
    // tStart - this._fromTime
    // tEnd - this._toTime
    // allDayToggle - this._allDayToggle (08:00 - 23:30)
    // site - this._sites (not needed as at this point it's empty)
    // floor - this._floors (not needed as at this point it's empty)
    // capacity - this._capacity (not needed)
    // types - this._types (not needed)
    //
    // To compute date array and strip all weekends:
    for (var i = 0, _cd, _cdfy, _cdm, _cdm1, _cdd, _cdw, _cday; i < _totalDays; i++) {
      _cd = new Date(_sdfy, _sdm, _sdd + i);
      _cday = _cd.getDay();
      if (_cday > 0 && _cday < 6) {
        _cdfy = _cd.getFullYear();
        _cdm1 = _cd.getMonth();
        _cdm = ('0' + _cdm1).slice(-2) + _monthNames[_cdm1];
        _cdd = ('0' + _cd.getDate()).slice(-2);
        _cd = [_cdfy, _cdm1 + 1, _cdd].join('-');
        _cdw = getWeek(_cd);
        _cdw = 'week' + ('0' + _cdw).slice(-2);
        _datesArray.push({
          y: _cdfy,
          m: _cdm,
          w: _cdw,
          d: _cdd,
          day: _cday
        });
      }
    }
    // console.log(_datesArray);
    // Dates array with URL.
    // capacity: 4
    // floor: "01level"
    // room: "twin towers"
    // site: "alpha"
    // time: "0"
    // types: "803"
    // Now new url will be:
    //
    // ref - https://polymer-semaphore.firebaseio.com/mockMessages/
    // year - /2016
    // month - /00january
    // week - /week05
    // day - /29
    // site, level, room - /site/alpha/01level/taipei101
    // time - /time
    var _ref = 'https://polymer-semaphore.firebaseio.com/mockMessages';
    var _siteToCode = _siteNameToCode(_selectedRoomInfo.site);
    var _floorToCode = _floorNameToCode(_selectedRoomInfo.floor);
    var _site = ['site', _siteToCode, _floorToCode, _selectedRoomInfo.room].join('/');
    var _retryDates = [];
    var _that = this;

    var _datesArrayWithPromise = _datesArray.map(function(_date) {
      var _eachRef = new Firebase([_ref, _date.y, _date.m, _date.w, _date.d, _site].join('/'));
      console.log(_eachRef);
      return _eachRef.child('time').once('value').then(function(_snapshot) {
        return _eachRef.child('time').transaction(function(_data) {
          if (_data === null) {
            console.warn("Firebase Promise's status: pending");
            return parseInt(_timeDec, 10).toString(16);
          }else {
            var _dataDec = parseInt(_data, 16).toString(10);
            var _slotNotTakenYet = ((_dataDec & _timeDec) >>> 0) === 0;
            if (_slotNotTakenYet) {
              return _updateData(_data, _timeDec);
            }
            return;
          }
        });
      });
    });
    // Return results of all Promises of all dates.
    Promise.all(_datesArrayWithPromise).then(function(snapshot) {
      console.log(snapshot);
      var _allCommitted = snapshot.every(function(n) {
        console.log('Added is committed: ', n.committed);
        console.log('committed value: ', n.snapshot.val());
        return n.committed === true;
      });
      // If one of them is not committed, retry is needed.
      // TODO: Retry failed Promise.
      if (!_allCommitted) {
        snapshot.forEach(function(n, idx) {
          // Push ref of uncommitted dates.
          if (!n.committed) {
            var snapref = n.snapshot.ref();
            _retryDates.push(snapref);
          }
        });
        console.log(_retryDates);
      }

      return _allCommitted;
    }).then(function(_allCommitted) {
      // If all requests have committed, set _roomReserved to trigger Observer to close dialog.
      if (_allCommitted) {
        // TODO: Before setting _roomReserved to trigger closing dialogs.
        // Show dialog to ask user to change reservations details, eg title, objectives, etc.
        // This is required for subsequent operation to save all these committed reservations into
        // global reserve list which is needed for current reservation!
        _that.set('_roomReserved', true);
      }else {
        // TODO: Revert all committed changes in Firebase once failed.
        // _that._revertCommittedChanges()
      }

    }).catch(function(error) {
      console.error(error);
    });

    // TODO: Close responseDialog after reserving and show toast for successful operation.
  },
  /* jshint ignore:end */
  /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

  _showRoomInfo: function(ev) {
    console.log(ev, this._selectedRoomInfo);
    this._forceCloseOptions();
    // this._computeRoomBasedOnIdx(this._roomIdx);
    this.$.roomDialog.open();
  },

  _decodeTypes: function(_types) {
    var _hexTypes = _.padStart(parseInt(_types, 16).toString(2), 12, 0);
    var _str2arr = _hexTypes.split('').map(Number);
    var _filtered = [];
    _.filter(_str2arr, function(el, idx) {
      if (el === 1) _filtered.push(_roomTypes[idx]);
    });
    _hexTypes = null; _str2arr = null;
    return _filtered;
  },

  _onIronOverlayOpened: function(ev) {
    // workaround to iron-resize and refit dialog with paper-checkbox inside it;
    this.$.roomDialog.notifyResize();
  },

  _forceCloseOptions: function() {
    if (this.$.optionsDialog.opened) {
      this.$.optionsDialog.close();
    }
  },

  _onPaperRadioGroupChanged: function(ev) {
    var _target = ev.target;
    while (_target && _target.tagName !== 'PAPER-DIALOG') {
      _target = _target.parentElement;
    }

    if (_target && _target.hasAttribute('site')) {
      this._updateSite();
    }else {
      this._updateFloor();
    }
    _target.close();
  },

  _updateSearchUrl: function(_uid) {
    console.log(_uid);
    var _newUrl = 'https://semafloor-webapp.firebaseio.com/users/google/' + this.uid +
      '/reservations/allreservations';
    this.set('_searchUrl', _newUrl);
  },

  _closeRoomDialogAfterLoading: function(_roomReserved) {
    // Observer keeps observing on the value change of _roomReserved.
    // However, we only interested in when the value is truthy.
    if (_roomReserved) {
      // Close roomDialog and responseDialog immediately.
      this.$.roomDialog.close();
      this.$.responseDialog.close();
      // Reset document body overflow scrolling.
      console.log(document.body.style.overflow);
      document.body.style.overflow = '';
      // After 250ms of debounce rate, setting up the toast.
      this.debounce('closeResponseDialog', function() {
        var _toast = this.$.reserveRoomToast;
        // this._computeRoomBasedOnIdx(this._roomIdx);
        var _capitalizedRoomName = _.map(_.words(this._selectedRoomInfo.room), function(n) {
          return _.capitalize(n);
        }).join(' ');
        var _msg = _capitalizedRoomName + ' has been reserved successfully!';
        if (_toast.opened) {
          _toast.close();
        }
        this.set('_reserveRoomMsg', _msg);

        // Async-ly open toast.
        this.async(function() {
          _toast.open();
        }, 1);
      }, 250);
    }
  },

  _proceedToReserveRoom: function(_isLoading) {
    if (_isLoading) {
      // Proceed to reserve room.
      if (!this.$.roomDialog.opened) {
        this.$.roomDialog.open();
      }

      this.debounce('transactionWithReservations', function() {
        // TODO: This can only be completed once roomify-create in Node is completed!
        var _timeDec = this._computeTimeDec(this._fromTime, this._toTime, this._allDayToggle);
        
        this._transactionWithReservations(this._fromDate, this._toDate, _timeDec, this._selectedRoomInfo);
      }, 250);
    }
  },

});
