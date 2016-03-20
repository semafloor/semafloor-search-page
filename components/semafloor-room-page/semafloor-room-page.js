var _alphaFloors = [
  'level 1','level 2','level 3','level 3A','level 5','level 6',
  'level 7','level 8','level 9','level 10','level 11','level 12'];
var _alphaFloorsCode = [
  '01level','02level','03level','04level','05level','06level',
  '07level','08level','09level','10level','11level','12level'];
var _siteNames = ['KLB - Tower 5', 'KLB - Tower 2A', 'SUITE'];
var _roomTypes = [
  'Adjoining Room (Operable Wall)','Panaboard','Polycom CX100 (Audio)',
  'Polycom CX5000 (Video Conferencing)','Projector','Projector Cable Faulty',
  'Projector Faulty','Screen Projector Faulty','SmartBoard 800','Telepresence',
  'TV','Writing Glass Board'];

Polymer({

  is: 'semafloor-room-page',

  behaviors: [
    Polymer.NeonSharedElementAnimatableBehavior,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    url: {
      type: String,
      // TODO: To change to new Firebase reference URL soon.
      value: 'https://polymer-semaphore.firebaseio.com/mockMessages/2016/01february/week07/17/site'
    },

    // normally vertical view and all cards are centered.
    // view=horizontal to display horizontal view with wrapping cards.
    view: String,

    // By default, all animations are enabled.
    noAnimation: Boolean,

    animationConfig: {
      type: Object,
      value: function() {
        return {
          'entry': [{
            name: 'cascaded-animation',
            animation: 'slide-from-bottom-animation',
            timing: {
              delay: 550
            }
          }],
          'dialogEntry': [{
            name: 'cascaded-animation',
            animation: 'slide-from-bottom-animation',
            timing: {
              delay: 550
            }
          }]
        };
      }
    },

    _allSiteCards: {
      type: Array,
      value: function() {
        return _siteNames;
      }
    },
    _allFloorCards: Array,
    _isDataReady: {
      type: Boolean,
      value: !1
    },

    imagesList: {
      type: Array,
      value: function() {
        var _images = [
          'https://c4.staticflickr.com/8/7209/6891647325_29b124ebe4_b.jpg',
          'https://wallpaperscraft.com/image/dubai_uae_buildings_skyscrapers_night_96720_2560x1440.jpg',
          'https://wallpaperscraft.com/image/kln_germany_bridge_weser_reflection_architecture_hdr_47748_2560x1440.jpg',
          'https://wallpaperscraft.com/image/twin_towers_new_york_world_trade_center_skyscrapers_river_bridge_night_city_manhattan_59434_1920x1080.jpg',
          'https://wallpaperscraft.com/image/skyscrapers_city_night_lights_91888_1920x1080.jpg',
          'https://wallpaperscraft.com/image/london_england_city_night_lights_river_thames_uk_tower_bridge_lantern_58386_1920x1080.jpg',
          'https://wallpaperscraft.com/image/tokyo_japan_city_night_lights_63139_1920x1080.jpg'
        ];
        return _images;
      }
    },

    _isLoadingCard: {
      type: Boolean,
      value: !0
    },
    _page: String,
    _exploringSiteIdx: Number,
    _floorInfoTitle: String,
    _isRoom: {
      type: Boolean,
      value: !1
    },

  },

  observers: [
    '_applyAnimationConfigToNodes(_isDataReady)',
    '_noAnimationChanged(noAnimation)'
  ],

  listeners: {
    'neon-animation-finish': '_cardAnimationDone'
  },

  // Element Lifecycle

  ready: function() {
    // `ready` is called after all elements have been configured, but
    // propagates bottom-up. This element's children are ready, but parents
    // are not.
    //
    // This is the point where you should make modifications to the DOM (when
    // necessary), or kick off any processes the element wants to perform.

    // if (window.opr || window.chrome) {
    //   _noAnimation = !0;
    //   // for (var key in navigator) {
    //   //   if (key.indexOf('webkit') < 0) {
    //   //     _noAnimation = !1;
    //   //     break;
    //   //   }
    //   // }
    // }

    // Enable WebAnimations only for Chrome and Opera!
    var _noAnimation = !!(window.opr || window.chrome);
    if (!_noAnimation) {
      this.set('noAnimation', !0);
    }

    // Remove dialog's animation if noAnimation is set.
    if (this.noAnimation) {
      var _dialog = Polymer.dom(this.root).querySelectorAll('paper-dialog')[0];
      _dialog.animationConfig = {};
    }
  },

  attached: function() {
    // `attached` fires once the element and its parents have been inserted
    // into a document.
    //
    // This is a good place to perform any work related to your element's
    // visual state or active behavior (measuring sizes, beginning animations,
    // loading resources, etc).
    this.async(function() {
      this.fire('room-page-attached');
    });
  },

  detached: function() {
    // The analog to `attached`, `detached` fires when the element has been
    // removed from a document.
    //
    // Use this to clean up anything you did in `attached`.
  },

  _onFirebaseValue: function(ev) {
    console.log('on-firebase-value', ev.detail.val());
    // set _currentReservations when data is fetched.
    this.set('_roomInfo', ev.detail.val());
    // unhide iron-list and hide progress bar.
    this.set('_isDataReady', !0);

    this.fire('room-info-ready');
  },

  _computeSiteIcon: function(_index) {
    return ['language', 'trending-up', 'group-work'][_index];
  },
  _computeSiteImage: function(_imagesList) {
    // To randomize the imagesList and splice the randomize index from the imagesList.
    // To ensure site image will always be different through randomization.
    var _randomIdx = _.random(0, _imagesList.length - 1);
    var _removed = this.splice('imagesList', _randomIdx, 1);
    return _removed;
  },

  _decodeTypes: function(_types) {
    var _hexTypes = _.padStart(parseInt(_types, 16).toString(2), 12, 0);
    var _str2arr = _hexTypes.split('').map(Number);
    var _filtered = [];

    _.forEach(_str2arr, function(el, idx) {
      if (el === 1) {
        _filtered.push(_roomTypes[idx]);
      }
    });
    _hexTypes = null; _str2arr = null;
    return _filtered;
  },
  _isRestricted: function(_access) {
    return _access ? 'PUBLIC' : 'RESTRICTED';
  },

  // Re-randomize thumbnail of selected paper-card.
  _rollThumbnail: function(ev) {
    var _rollIdx = ev.model.index;
    var _ironImages = Polymer.dom(this.root).querySelectorAll('iron-image');
    var _currentThumbnail = _ironImages[_rollIdx].src;

    this.push('imagesList', _currentThumbnail[0]);
    _ironImages[_rollIdx].src = this._computeSiteImage(this.imagesList);
  },
  _exploreSite: function(ev) {
    this.debounce('rippleEnd', function() {
      var _exploreItem = ev.model.item;
      var _siteIdx = _siteNames.indexOf(_exploreItem);
      var _siteCode = ['alpha', 'beta', 'gamma'][_siteIdx];
      var _floors = _alphaFloors;

      if (_siteCode === 'beta') {
        _floors = ['level 3'];
      }else if (_siteCode === 'gamma') {
        _floors = ['level 1'];
      }

      // this.set('_allSiteCards', _floors);
      this.set('_floorInfoTitle', this._idxToName(_siteIdx));
      this.set('_allFloorCards', _floors);
      this.set('_exploringSiteIdx', _siteIdx);

      this.async(function() {
        this.$.floorInfo.open();

        // _setAnimationConfigToCards here with opening dialog.
        // _setAnimationConfigToCards when overlay is opened is way too slow in running the animation.
        if (!this.noAnimation) {
          this._setAnimationConfigToCards(this.$.floorInfo, 'dialogEntry', null);
        }
      }, 350);
    }, 1);
  },
  _exploreFloor: function(ev) {
    // If at floor level...
    var _item = ev.model.item;

    if (this._floorInfoTitle.indexOf('level') >= 0) {
      // X - TODO: After clicking on a room, what to do with _exploreFloor function?
      var _roomInfo = this._allRoomsCards[0][_item];
      _roomInfo['name'] = _item;

      this.set('_isRoom', !0);
      this.set('_allFloorCards', [_roomInfo]);
    }else {
      // if at room level...
      var _floorIdx = _alphaFloors.indexOf(_item);
      var _floorCode = _alphaFloorsCode[_floorIdx];
      var _roomInfo = this._roomInfo;
      var _exploringSiteIdx = ev.model._exploringSiteIdx;
      var _siteCode = ['alpha', 'beta', 'gamma'][_exploringSiteIdx];
      var _rooms = _roomInfo[_siteCode][_floorCode];

      this.set('_allRoomsCards', [_rooms, _item]);
      this.set('_allFloorCards', _.keys(_rooms));
    }

    this.set('_floorInfoTitle', _item);

    if (!this.noAnimation) {
      this.async(function() {
        this._setAnimationConfigToCards(this.$.floorInfo, 'dialogEntry', null);
      }, 1);
    }else {
      // When animation is disabled completely, ASYNC-ly toggle collapse at room level.
      if (this._floorInfoTitle.indexOf('level') < 0) {
        this.async(function() {
          this._cardAnimationDone();
        }, 1);
      }
    }
  },
  _exploreRoom: function(ev) {
    var _scroller = this.$.infoCardContainer

    // Toggle collapse and transform arrow down icon button.
    this._toggleCollapse(!this.$$('#infoCollapse').opened);
  },

  _rotateArrowDown: function(_node, _opened) {
    var _transformCollapse = _opened ? 'rotateZ(0deg)' : 'rotateZ(-180deg)';
    this.transform(_transformCollapse, _node);
  },
  _setAnimationConfigToCards: function(_node, _animationName, _page) {
    var _cardsList = Polymer.dom(_node).querySelectorAll('paper-card');

    // Scroll to page top when it's inside dialog which in this case _page is null;
    if (!_page) {
      // Reset scrollTop to 0 for every moving back and forth.
      var _scroller = this.$.infoCardContainer;

      if (_scroller.scrollTop > 0) {
        _scroller.scrollTop = 0;
      }
    }

    // Apply animationConfig to all cards inside _node.
    this.animationConfig[_animationName][0].nodes = _cardsList;
    // Play animation on all cards.
    this.playCardAnimation(_animationName, _page);
  },
  playCardAnimation: function(_animationName, _page) {
    // play card animation and set the iron-pages from loading to card.
    this.cancelAnimation();
    this.playAnimation(_animationName);

    if (!!_page) {
      this.set('_page', _page);
    }
  },

  _applyAnimationConfigToNodes: function(_isDataReady) {
    if (_isDataReady) {
      this.set('_isLoadingCard', !1);

      if (!this.noAnimation) {
        this.async(function() {
          this._setAnimationConfigToCards(this.$.pages, 'entry', 'card');
        }, 1);
      }else {
        this.set('_page', 'card');
      }
    }
  },

  _manipulateDocumentScrolling: function(ev) {
    var _overflow = ev.type.indexOf('closed') < 0 ? 'hidden' : '';
    document.body.style.overflow = _overflow;
  },

  _idxToName: function(_exploringSiteIdx) {
    return ['KLB - Tower 5', 'KLB - Tower 2A', 'SUITE'][_exploringSiteIdx];
  },

  _computeFloorInfoIcon: function(_floorInfoTitle) {
    if (_floorInfoTitle.indexOf('KLB') >= 0 || _floorInfoTitle.indexOf('SUITE') >= 0) {
      return 'close';
    }
    return 'arrow-back';
  },
  _floorInfoIconAction: function(ev) {
    if (!this.$.floorInfo.opened) {
      return;
    }

    var _target = Polymer.dom(ev).localTarget;

    if (_target) {
      var _icon = _target.icon;

      if (_icon.indexOf('close') >= 0) {
        this.$.floorInfo.close();

        // After closing dialog, playCardAnimation on 'entry'.
        if (!this.noAnimation) {
          this.async(function() {
            this._setAnimationConfigToCards(this.$.pages, 'entry', null);
          }, 1);
        }
      }else {
        var _items = _alphaFloors;
        var _title = 'KLB - Tower 5';

        if (!this.noAnimation) {
          // The dom-repeat maynot be fast enough to update new cards.
          // Hence from room to floor, only the first card has animation configured.
          this.async(function() {
            this._setAnimationConfigToCards(this.$.floorInfo, 'dialogEntry', null);
          }, 1);
        }

        // At floor level...
        if (this._floorInfoTitle.indexOf('level') >= 0) {
          var _exploreSiteIdx = this._exploringSiteIdx;

          if (_exploreSiteIdx > 1) {
            _title = 'SUITE';
            _items = ['level 1'];
          }else if (_exploreSiteIdx > 0) {
            _title = 'KLB - Tower 2A';
            _items = ['level 3'];
          }

          this.set('_allRoomsCards', null);
          this.set('_floorInfoTitle', _title);
          this.set('_allFloorCards', _items);
        }else {
          // At room level...
          var _allRoomsCards = this._allRoomsCards;
          _items = _.keys(_allRoomsCards[0]);
          _title = _allRoomsCards[1];


          this.set('_isRoom', !1);
          this.set('_floorInfoTitle', _title);
          this.set('_allFloorCards', _items);
          // Rotate the arrow down icon button to its initial state.
          this._toggleCollapse(!1);
        }
      }
    }
  },

  _isRoomCls: function(_isRoom) {
    return _isRoom ? 'is-room' : '';
  },

  _collapseOpened: function(ev) {
    // When collapse is opened and after the transitionend event,
    // scroll the end of the page to view everything.
    if (this.$$('#infoCollapse').opened) {
      // Scroll to bottom of the page ASYNC-ly.
      // To prevent scrolling past end.
      var _scroller = this.$.infoCardContainer
      // workaround: try to reset scrollTop first.
      _scroller.scrollTop = 0;
      this.async(function() {
        // Just scroll until the page end.
        _scroller.scrollTop = _scroller.scrollHeight - _scroller.clientHeight;
      }, 1);
    }
  },
  // To toggle iron-collapse meantime animate the arrow down icom button.
  _toggleCollapse: function(_open) {
    var _infoCollapse = this.$$('#infoCollapse');
    var _arrowDownIconButton = this.$$('#arrowDownIconButton');
    var _rotation = !_open;
    var _collapseOp = ['hide', 'show'][+_open];

    this._rotateArrowDown(_arrowDownIconButton, _rotation);

    _infoCollapse[_collapseOp]();
  },

  _cardAnimationDone: function(ev) {
    if (_.isUndefined(this._allRoomsCards) || _.isNull(this._allRoomsCards) || this._floorInfoTitle.indexOf('level') >= 0) {
      return;
    }

    this.async(function() {
      this._toggleCollapse(!0);
    }, 1);
  },

  // Don't use reflectToAttribute!
  _noAnimationChanged: function(_noAnimation) {
    if (_noAnimation) {
      this.setAttribute('no-animation', !0);
    }
  },

  _computeLoadingCls: function(_isLoadingCard) {
    return _isLoadingCard ? '' : 'finish-loading';
  },

  // X - TODO: Fixed scroll to page top even though not inside dialog.
  // X - TODO: _manipulateDocumentScrolling FTW (special event type edition).
  // X - TODO: page container FTW.
});
