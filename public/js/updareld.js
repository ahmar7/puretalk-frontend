!(function (e) {
  "function" == typeof define && define.amd ? define("googleMaps", e) : e();
})(function () {
  "use strict";
  function n(e) {
    return (n =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function r(e, t, i) {
    this.extend(r, google.maps.OverlayView),
      (this.map_ = e),
      (this.markers_ = []),
      (this.clusters_ = []),
      (this.sizes = [53, 56, 66, 78, 90]),
      (this.styles_ = []),
      (this.ready_ = !1);
    var s = i || {};
    (this.gridSize_ = s.gridSize || 60),
      (this.minClusterSize_ = s.minimumClusterSize || 2),
      (this.maxZoom_ = s.maxZoom || null),
      (this.styles_ = s.styles || []),
      (this.imagePath_ = s.imagePath || this.MARKER_CLUSTER_IMAGE_PATH_),
      (this.imageExtension_ =
        s.imageExtension || this.MARKER_CLUSTER_IMAGE_EXTENSION_),
      (this.zoomOnClick_ = !0),
      null != s.zoomOnClick && (this.zoomOnClick_ = s.zoomOnClick),
      (this.averageCenter_ = !1),
      null != s.averageCenter && (this.averageCenter_ = s.averageCenter),
      this.setupStyles_(),
      this.setMap(e),
      (this.prevZoom_ = this.map_.getZoom());
    var o = this;
    google.maps.event.addListener(this.map_, "zoom_changed", function () {
      var e = o.map_.getZoom(),
        t = o.map_.minZoom || 0,
        i = Math.min(
          o.map_.maxZoom || 100,
          o.map_.mapTypes[o.map_.getMapTypeId()]
            ? o.map_.mapTypes[o.map_.getMapTypeId()].maxZoom
            : 100
        );
      (e = Math.min(Math.max(e, t), i)),
        o.prevZoom_ != e && ((o.prevZoom_ = e), o.resetViewport());
    }),
      google.maps.event.addListener(this.map_, "idle", function () {
        o.redraw();
      }),
      t && (t.length || Object.keys(t).length) && this.addMarkers(t, !1);
  }
  function a(e) {
    (this.markerClusterer_ = e),
      (this.map_ = e.getMap()),
      (this.gridSize_ = e.getGridSize()),
      (this.minClusterSize_ = e.getMinClusterSize()),
      (this.averageCenter_ = e.isAverageCenter()),
      (this.center_ = null),
      (this.markers_ = []),
      (this.bounds_ = null),
      (this.clusterIcon_ = new s(this, e.getStyles(), e.getGridSize()));
  }
  function s(e, t, i) {
    e.getMarkerClusterer().extend(s, google.maps.OverlayView),
      (this.styles_ = t),
      (this.padding_ = i || 0),
      (this.cluster_ = e),
      (this.center_ = null),
      (this.map_ = e.getMap()),
      (this.div_ = null),
      (this.sums_ = null),
      (this.visible_ = !1),
      this.setMap(this.map_);
  }
  (MyListing.Maps = {
    options: {
      locations: [],
      zoom: 12,
      minZoom: 0,
      maxZoom: 30,
      skin: "skin1",
      marker_type: "basic",
      gestureHandling: "greedy",
      cluster_markers: !0,
      draggable: !0,
      scrollwheel: !1,
    },
    instances: [],
    skins: [],
    init: function () {},
    loaded: !1,
    getInstance: function (t) {
      var e = MyListing.Maps.instances.filter(function (e) {
        return e.id == t;
      });
      return !(!e || !e.length) && e[0];
    },
  }),
    jQuery(document).on("maps:loaded", function () {
      jQuery(
        '.form-location-autocomplete, input[name="job_location"], input[name="_job_location"]'
      ).each(function (e, t) {
        new MyListing.Maps.Autocomplete(t);
      }),
        (MyListing.Geocoder = new MyListing.Maps.Geocoder()),
        jQuery(".cts-get-location").click(function (e) {
          e.preventDefault();
          var t = jQuery(jQuery(this).data("input")),
            i = jQuery(this).data("map"),
            s = null;
          t.length &&
            (i.length &&
              (s = MyListing.Maps.getInstance(i)) &&
              MyListing.Geocoder.setMap(s.instance),
            MyListing.Geocoder.getUserLocation({
              receivedAddress: function (e) {
                if ((t.val(e.address), t.data("autocomplete")))
                  return t.data("autocomplete").fireChangeEvent(e);
              },
            }));
        });
    }),
    jQuery(function (h) {
      h(document).on("maps:loaded", function () {
        if (document.getElementById("location-picker-map")) {
          var i = MyListing.Maps.getInstance("location-picker-map").instance,
            e = h(".location-field-wrapper"),
            t = e.data("options"),
            s = e.find(".location-coords"),
            o = e.find(".latitude-input"),
            n = e.find(".longitude-input"),
            r = e.find(".address-input"),
            a = e.find('.lock-pin input[type="checkbox"]'),
            l = e.find(".enter-coordinates-toggle > span"),
            p = new MyListing.Maps.Marker({
              position: u(),
              map: i,
              template: { type: "traditional" },
            });
          i.addListener("click", function (e) {
            if (!a.prop("checked")) {
              var t = i.getClickPosition(e);
              p.setPosition(t),
                o.val(t.getLatitude()),
                n.val(t.getLongitude()),
                MyListing.Geocoder.geocode(t.toGeocoderFormat(), function (e) {
                  e && r.val(e.address);
                });
            }
          }),
            r.on("autocomplete:change", function (e) {
              if (
                !a.prop("checked") &&
                e.detail.place &&
                e.detail.place.latitude &&
                e.detail.place.longitude
              ) {
                var t = new MyListing.Maps.LatLng(
                  e.detail.place.latitude,
                  e.detail.place.longitude
                );
                p.setPosition(t),
                  o.val(e.detail.place.latitude),
                  n.val(e.detail.place.longitude),
                  i.panTo(t);
              }
            }),
            i.addListenerOnce("idle", function (e) {
              i.setZoom(t["default-zoom"]);
            }),
            a
              .on("change", function (e) {
                i.trigger("resize"), i.setCenter(u());
              })
              .change(),
            l.click(function (e) {
              s.toggleClass("hide");
            }),
            o.blur(y),
            n.blur(y);
        }
        function y() {
          var e = u();
          p.setPosition(e),
            i.panTo(e),
            "" !== o.val().trim() &&
              "" !== n.val().trim() &&
              (o.val(e.getLatitude()), n.val(e.getLongitude()));
        }
        function u() {
          return o.val().trim() && n.val().trim()
            ? new MyListing.Maps.LatLng(o.val(), n.val())
            : new MyListing.Maps.LatLng(t["default-lat"], t["default-lng"]);
        }
      });
    }),
    (MyListing.Maps.Autocomplete = function (e) {
      jQuery(e).data("autocomplete", this), this.init(e);
    }),
    (MyListing.Maps.Autocomplete.prototype.init = function (e) {}),
    (MyListing.Maps.Autocomplete.prototype.fireChangeEvent = function (e) {
      var t = document.createEvent("CustomEvent");
      t.initCustomEvent("autocomplete:change", !1, !0, { place: e || !1 }),
        this.el.dispatchEvent(t);
    }),
    (MyListing.Maps.Clusterer = function (e) {
      this.init(e);
    }),
    (MyListing.Maps.Clusterer.prototype.init = function (e) {}),
    (MyListing.Maps.Geocoder = function () {
      this.init();
    }),
    (MyListing.Maps.Geocoder.prototype.init = function () {}),
    (MyListing.Maps.Geocoder.prototype.geocode = function (e, t, i) {}),
    (MyListing.Maps.Geocoder.prototype.formatFeature = function (e) {}),
    (MyListing.Maps.Geocoder.prototype.getUserLocation = function (i) {
      i = jQuery.extend(
        {
          shouldFetchAddress: !0,
          receivedCoordinates: function () {},
          receivedAddress: function () {},
          geolocationFailed: function () {},
        },
        i
      );
      if (!navigator.geolocation) return i.geolocationFailed();
      navigator.geolocation.getCurrentPosition(
        function (e) {
          if ((i.receivedCoordinates(e), !1 !== i.shouldFetchAddress)) {
            var t = new MyListing.Maps.LatLng(
              e.coords.latitude,
              e.coords.longitude
            );
            MyListing.Geocoder.geocode(t.toGeocoderFormat(), function (e) {
              return e
                ? i.receivedAddress(e)
                : (console.log("Couldn't determine your location."),
                  i.geolocationFailed());
            });
          }
        },
        function () {
          i.geolocationFailed();
        }
      );
    }),
    (MyListing.Maps.Geocoder.prototype.setMap = function (e) {
      this.map = e;
    }),
    (MyListing.Maps.Map = function (e) {
      (this.$el = jQuery(e)), this.init(e);
    }),
    (MyListing.Maps.Map.prototype.init = function () {}),
    (MyListing.Maps.Map.prototype.setZoom = function (e) {}),
    (MyListing.Maps.Map.prototype.getZoom = function () {}),
    (MyListing.Maps.Map.prototype.getMinZoom = function () {}),
    (MyListing.Maps.Map.prototype.getMaxZoom = function () {}),
    (MyListing.Maps.Map.prototype.setCenter = function (e) {}),
    (MyListing.Maps.Map.prototype.getCenter = function () {}),
    (MyListing.Maps.Map.prototype.getDimensions = function () {}),
    (MyListing.Maps.Map.prototype.fitBounds = function (e) {}),
    (MyListing.Maps.Map.prototype.panTo = function (e) {}),
    (MyListing.Maps.Map.prototype.getClickPosition = function (e) {}),
    (MyListing.Maps.Map.prototype.addListener = function (e, t) {}),
    (MyListing.Maps.Map.prototype.addListenerOnce = function (e, t) {}),
    (MyListing.Maps.Map.prototype.trigger = function (e) {}),
    (MyListing.Maps.Map.prototype.addControl = function (e) {}),
    (MyListing.Maps.Map.prototype.getSourceObject = function () {
      return this.map;
    }),
    (MyListing.Maps.Map.prototype.getSourceEvent = function (e) {
      return void 0 !== this.events[e] ? this.events[e] : e;
    }),
    (MyListing.Maps.Map.prototype.closePopups = function () {
      this.trigger("mylisting:closing_popups");
      for (var e = 0; e < this.markers.length; e++)
        "object" === n(this.markers[e].options.popup) &&
          this.markers[e].options.popup.hide();
    }),
    (MyListing.Maps.Map.prototype.removeMarkers = function () {
      for (var e = 0; e < this.markers.length; e++) this.markers[e].remove();
      (this.markers.length = 0), (this.markers = []);
    }),
    (MyListing.Maps.Map.prototype._maybeAddMarkers = function () {
      var i = this;
      if (
        ((i.markers = []),
        i.trigger("updating_markers"),
        "custom-locations" == i.options.items_type &&
          i.options.locations.length)
      ) {
        "basic" == i.options.marker_type &&
          i.options.locations.forEach(function (e) {
            i._addBasicMarker(e);
          }),
          "advanced" == i.options.marker_type &&
            i.options.locations.forEach(function (e) {
              var t = new MyListing.Maps.Marker({
                position: new MyListing.Maps.LatLng(e.marker_lat, e.marker_lng),
                map: i,
                popup: new MyListing.Maps.Popup(),
                template: { type: "advanced", thumbnail: e.marker_image.url },
              });
              i.markers.push(t), i.bounds.extend(t.getPosition());
            });
        var e = function (e) {
          15 < this.getZoom() && this.setZoom(this.options.zoom);
        };
        i.addListenerOnce("zoom_changed", e.bind(i)),
          i.addListenerOnce("bounds_changed", e.bind(i)),
          i.fitBounds(i.bounds),
          i.trigger("updated_markers");
      }
      "listings" == i.options.items_type &&
        i.options.listings_query.lat &&
        i.options.listings_query.lng &&
        i.options.listings_query.radius &&
        i.options.listings_query.listing_type &&
        i.options._section_id &&
        this._addMarkersThroughQuery();
    }),
    (MyListing.Maps.Map.prototype._addBasicMarker = function (i) {
      var s = this;
      if (i.marker_lat && i.marker_lng) {
        var e = new MyListing.Maps.Marker({
          position: new MyListing.Maps.LatLng(i.marker_lat, i.marker_lng),
          map: s,
          template: { type: "basic", thumbnail: i.marker_image.url },
        });
        s.markers.push(e), s.bounds.extend(e.getPosition());
      } else
        i.address &&
          MyListing.Geocoder.geocode(i.address, function (e) {
            if (!e) return !1;
            var t = new MyListing.Maps.Marker({
              position: new MyListing.Maps.LatLng(e.latitude, e.longitude),
              map: s,
              template: { type: "basic", thumbnail: i.marker_image.url },
            });
            s.markers.push(t),
              s.bounds.extend(t.getPosition()),
              s.fitBounds(s.bounds),
              s.setZoom(s.options.zoom);
          });
    }),
    (MyListing.Maps.Map.prototype._addMarkersThroughQuery = function () {
      var o = this;
      o.$el.addClass("mylisting-map-loading"),
        jQuery.ajax({
          url:
            CASE27.mylisting_ajax_url +
            "&action=get_listings&security=" +
            CASE27.ajax_nonce,
          type: "GET",
          dataType: "json",
          data: {
            listing_type: o.options.listings_query.listing_type,
            form_data: {
              proximity: o.options.listings_query.radius,
              lat: o.options.listings_query.lat,
              lng: o.options.listings_query.lng,
              search_location: "radius search",
              per_page: o.options.listings_query.count,
            },
          },
          success: function (e) {
            jQuery("#" + o.options._section_id)
              .find(".c27-map-listings")
              .html(e.html),
              jQuery("#" + o.options._section_id)
                .find(".c27-map-listings .lf-item-container")
                .each(function (e, t) {
                  var s = jQuery(t);
                  if (s.data("locations")) {
                    var i = s.data("locations");
                    jQuery.each(Object.values(i), function (e, t) {
                      var i = new MyListing.Maps.Marker({
                        position: new MyListing.Maps.LatLng(t.lat, t.lng),
                        map: o,
                        popup: new MyListing.Maps.Popup({
                          content:
                            '<div class="lf-item-container lf-type-2">' +
                            s.html() +
                            "</div>",
                        }),
                        template: {
                          type: "advanced",
                          thumbnail: s.data("thumbnail"),
                          icon_name: s.data("category-icon"),
                          icon_color: s.data("category-text-color"),
                          icon_background_color: s.data("category-color"),
                          listing_id: s.data("id"),
                        },
                      });
                      o.markers.push(i), o.bounds.extend(i.getPosition());
                    });
                  }
                }),
              jQuery(".lf-background-carousel").owlCarousel({
                margin: 20,
                items: 1,
                loop: !0,
              }),
              o.fitBounds(o.bounds),
              o.trigger("updated_markers"),
              o.$el.removeClass("mylisting-map-loading");
          },
        });
    }),
    (MyListing.Maps.Marker = function (e) {
      (this.options = jQuery.extend(
        !0,
        {
          position: !1,
          map: !1,
          popup: !1,
          template: {
            type: "basic",
            icon_name: "",
            icon_color: "",
            icon_background_color: "",
            listing_id: "",
            thumbnail: "",
          },
        },
        e
      )),
        this.init(e);
    }),
    (MyListing.Maps.Marker.prototype.init = function (e) {}),
    (MyListing.Maps.Marker.prototype.getPosition = function () {}),
    (MyListing.Maps.Marker.prototype.setPosition = function (e) {}),
    (MyListing.Maps.Marker.prototype.setMap = function (e) {}),
    (MyListing.Maps.Marker.prototype.remove = function () {}),
    (MyListing.Maps.Marker.prototype.getTemplate = function () {
      var e = document.createElement("div");
      (e.className = "marker-container"),
        (e.style.position = "absolute"),
        (e.style.cursor = "pointer"),
        (e.style.zIndex = 10);
      var t = "";
      return (
        "basic" == this.options.template.type &&
          (t = jQuery("#case27-basic-marker-template")
            .html()
            .replace("{{marker-bg}}", this.options.template.thumbnail)),
        "traditional" == this.options.template.type &&
          (t = jQuery("#case27-traditional-marker-template").html()),
        "user-location" == this.options.template.type &&
          (t = jQuery("#case27-user-location-marker-template").html()),
        "advanced" == this.options.template.type &&
          (t = jQuery("#case27-marker-template")
            .html()
            .replace("{{icon}}", this.options.template.icon_name)
            .replace("{{icon-bg}}", this.options.template.icon_background_color)
            .replace("{{listing-id}}", this.options.template.listing_id)
            .replace("{{marker-bg}}", this.options.template.thumbnail)
            .replace("{{icon-color}}", this.options.template.icon_color)),
        jQuery(e).append(t),
        e
      );
    }),
    (MyListing.Maps.Popup = function (e) {
      (this.options = jQuery.extend(
        !0,
        {
          content: "",
          classes: "cts-map-popup cts-listing-popup infoBox cts-popup-hidden",
          position: !1,
          map: !1,
        },
        e
      )),
        this.init(e);
    }),
    (MyListing.Maps.Popup.prototype.init = function (e) {}),
    (MyListing.Maps.Popup.prototype.setContent = function (e) {}),
    (MyListing.Maps.Popup.prototype.setPosition = function (e) {}),
    (MyListing.Maps.Popup.prototype.setMap = function (e) {}),
    (MyListing.Maps.Popup.prototype.remove = function () {}),
    (MyListing.Maps.Popup.prototype.show = function () {}),
    (MyListing.Maps.Popup.prototype.hide = function () {}),
    (MyListing.Maps.LatLng = function (e, t) {
      this.init(e, t);
    }),
    (MyListing.Maps.LatLng.prototype.init = function (e, t) {}),
    (MyListing.Maps.LatLng.prototype.getLatitude = function () {}),
    (MyListing.Maps.LatLng.prototype.getLongitude = function () {}),
    (MyListing.Maps.LatLng.prototype.toGeocoderFormat = function () {}),
    (MyListing.Maps.LatLng.prototype.getSourceObject = function () {
      return this.latlng;
    }),
    (MyListing.Maps.LatLngBounds = function (e, t) {
      this.init(e, t);
    }),
    (MyListing.Maps.LatLngBounds.prototype.init = function (e, t) {}),
    (MyListing.Maps.LatLngBounds.prototype.extend = function (e) {}),
    (MyListing.Maps.LatLngBounds.prototype.empty = function () {}),
    (MyListing.Maps.LatLngBounds.prototype.getSourceObject = function () {
      return this.bounds;
    }),
    (MyListing.Maps.Autocomplete.prototype.init = function (e) {
      if (!e instanceof Element) return !1;
      var t = this;
      (this.el = e),
        (this.input = jQuery(this.el)),
        (this.options = {
          fields: [
            "name",
            "geometry.location",
            "place_id",
            "formatted_address",
          ],
        }),
        MyListing.MapConfig.TypeRestrictions.length &&
          (this.options.types = [MyListing.MapConfig.TypeRestrictions]),
        MyListing.MapConfig.CountryRestrictions.length &&
          (this.options.componentRestrictions = {
            country: MyListing.MapConfig.CountryRestrictions,
          }),
        (this.autocomplete = new google.maps.places.Autocomplete(
          this.el,
          this.options
        )),
        this.input.on(
          "input",
          MyListing.Helpers.debounce(function (e) {
            t.fireChangeEvent();
          }, 300)
        ),
        this.autocomplete.addListener("place_changed", function (e) {
          t.fireChangeEvent(
            MyListing.Geocoder.formatFeature(t.autocomplete.getPlace())
          );
        });
    }),
    (r.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "../images/m"),
    (r.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png"),
    (r.prototype.extend = function (e, t) {
      return function (e) {
        for (var t in e.prototype) this.prototype[t] = e.prototype[t];
        return this;
      }.apply(e, [t]);
    }),
    (r.prototype.onAdd = function () {
      this.setReady_(!0);
    }),
    (r.prototype.draw = function () {}),
    (r.prototype.setupStyles_ = function () {
      if (!this.styles_.length)
        for (var e, t = 0; (e = this.sizes[t]); t++)
          this.styles_.push({
            url: this.imagePath_ + (t + 1) + "." + this.imageExtension_,
            height: e,
            width: e,
          });
    }),
    (r.prototype.fitMapToMarkers = function () {
      for (
        var e, t = this.getMarkers(), i = new google.maps.LatLngBounds(), s = 0;
        (e = t[s]);
        s++
      )
        i.extend(e.getPosition());
      this.map_.fitBounds(i);
    }),
    (r.prototype.setStyles = function (e) {
      this.styles_ = e;
    }),
    (r.prototype.getStyles = function () {
      return this.styles_;
    }),
    (r.prototype.isZoomOnClick = function () {
      return this.zoomOnClick_;
    }),
    (r.prototype.isAverageCenter = function () {
      return this.averageCenter_;
    }),
    (r.prototype.getMarkers = function () {
      return this.markers_;
    }),
    (r.prototype.getTotalMarkers = function () {
      return this.markers_.length;
    }),
    (r.prototype.setMaxZoom = function (e) {
      this.maxZoom_ = e;
    }),
    (r.prototype.getMaxZoom = function () {
      return this.maxZoom_;
    }),
    (r.prototype.calculator_ = function (e, t) {
      for (var i = 0, s = e.length, o = s; 0 !== o; )
        (o = parseInt(o / 10, 10)), i++;
      return { text: s, index: (i = Math.min(i, t)) };
    }),
    (r.prototype.setCalculator = function (e) {
      this.calculator_ = e;
    }),
    (r.prototype.getCalculator = function () {
      return this.calculator_;
    }),
    (r.prototype.addMarkers = function (e, t) {
      if (e.length) for (var i = 0; (s = e[i]); i++) this.pushMarkerTo_(s);
      else if (Object.keys(e).length) for (var s in e) this.pushMarkerTo_(e[s]);
      t || this.redraw();
    }),
    (r.prototype.pushMarkerTo_ = function (e) {
      if (((e.isAdded = !1), e.draggable)) {
        var t = this;
        google.maps.event.addListener(e, "dragend", function () {
          (e.isAdded = !1), t.repaint();
        });
      }
      this.markers_.push(e);
    }),
    (r.prototype.addMarker = function (e, t) {
      this.pushMarkerTo_(e), t || this.redraw();
    }),
    (r.prototype.removeMarker_ = function (e) {
      var t = -1;
      if (this.markers_.indexOf) t = this.markers_.indexOf(e);
      else
        for (var i, s = 0; (i = this.markers_[s]); s++)
          if (i == e) {
            t = s;
            break;
          }
      return -1 != t && (e.setMap(null), this.markers_.splice(t, 1), !0);
    }),
    (r.prototype.removeMarker = function (e, t) {
      var i = this.removeMarker_(e);
      return !(t || !i) && (this.resetViewport(), this.redraw(), !0);
    }),
    (r.prototype.removeMarkers = function (e, t) {
      for (
        var i, s = e === this.getMarkers() ? e.slice() : e, o = !1, n = 0;
        (i = s[n]);
        n++
      ) {
        var r = this.removeMarker_(i);
        o = o || r;
      }
      if (!t && o) return this.resetViewport(), this.redraw(), !0;
    }),
    (r.prototype.setReady_ = function (e) {
      this.ready_ || ((this.ready_ = e), this.createClusters_());
    }),
    (r.prototype.getTotalClusters = function () {
      return this.clusters_.length;
    }),
    (r.prototype.getMap = function () {
      return this.map_;
    }),
    (r.prototype.setMap = function (e) {
      this.map_ = e;
    }),
    (r.prototype.getGridSize = function () {
      return this.gridSize_;
    }),
    (r.prototype.setGridSize = function (e) {
      this.gridSize_ = e;
    }),
    (r.prototype.getMinClusterSize = function () {
      return this.minClusterSize_;
    }),
    (r.prototype.setMinClusterSize = function (e) {
      this.minClusterSize_ = e;
    }),
    (r.prototype.getExtendedBounds = function (e) {
      var t = this.getProjection(),
        i = new google.maps.LatLng(
          e.getNorthEast().lat(),
          e.getNorthEast().lng()
        ),
        s = new google.maps.LatLng(
          e.getSouthWest().lat(),
          e.getSouthWest().lng()
        ),
        o = t.fromLatLngToDivPixel(i);
      (o.x += this.gridSize_), (o.y -= this.gridSize_);
      var n = t.fromLatLngToDivPixel(s);
      (n.x -= this.gridSize_), (n.y += this.gridSize_);
      var r = t.fromDivPixelToLatLng(o),
        a = t.fromDivPixelToLatLng(n);
      return e.extend(r), e.extend(a), e;
    }),
    (r.prototype.isMarkerInBounds_ = function (e, t) {
      return t.contains(e.getPosition());
    }),
    (r.prototype.clearMarkers = function () {
      this.resetViewport(!0), (this.markers_ = []);
    }),
    (r.prototype.resetViewport = function (e) {
      for (var t, i = 0; (t = this.clusters_[i]); i++) t.remove();
      var s;
      for (i = 0; (s = this.markers_[i]); i++)
        (s.isAdded = !1), e && s.setMap(null);
      this.clusters_ = [];
    }),
    (r.prototype.repaint = function () {
      var i = this.clusters_.slice();
      (this.clusters_.length = 0),
        this.resetViewport(),
        this.redraw(),
        e.setTimeout(function () {
          for (var e, t = 0; (e = i[t]); t++) e.remove();
        }, 0);
    }),
    (r.prototype.redraw = function () {
      this.createClusters_();
    }),
    (r.prototype.distanceBetweenPoints_ = function (e, t) {
      if (!e || !t) return 0;
      var i = ((t.lat() - e.lat()) * Math.PI) / 180,
        s = ((t.lng() - e.lng()) * Math.PI) / 180,
        o =
          Math.sin(i / 2) * Math.sin(i / 2) +
          Math.cos((e.lat() * Math.PI) / 180) *
            Math.cos((t.lat() * Math.PI) / 180) *
            Math.sin(s / 2) *
            Math.sin(s / 2);
      return 6371 * (2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)));
    }),
    (r.prototype.addToClosestCluster_ = function (e) {
      for (
        var t, i = 4e4, s = null, o = (e.getPosition(), 0);
        (t = this.clusters_[o]);
        o++
      ) {
        var n = t.getCenter();
        if (n) {
          var r = this.distanceBetweenPoints_(n, e.getPosition());
          r < i && ((i = r), (s = t));
        }
      }
      s && s.isMarkerInClusterBounds(e)
        ? s.addMarker(e)
        : ((t = new a(this)).addMarker(e), this.clusters_.push(t));
    }),
    (r.prototype.createClusters_ = function () {
      if (this.ready_)
        for (
          var e,
            t = new google.maps.LatLngBounds(
              this.map_.getBounds().getSouthWest(),
              this.map_.getBounds().getNorthEast()
            ),
            i = this.getExtendedBounds(t),
            s = 0;
          (e = this.markers_[s]);
          s++
        )
          !e.isAdded &&
            this.isMarkerInBounds_(e, i) &&
            this.addToClosestCluster_(e);
    }),
    (a.prototype.isMarkerAlreadyAdded = function (e) {
      if (this.markers_.indexOf) return -1 != this.markers_.indexOf(e);
      for (var t, i = 0; (t = this.markers_[i]); i++) if (t == e) return !0;
      return !1;
    }),
    (a.prototype.addMarker = function (e) {
      if (this.isMarkerAlreadyAdded(e)) return !1;
      if (this.center_) {
        if (this.averageCenter_) {
          var t = this.markers_.length + 1,
            i = (this.center_.lat() * (t - 1) + e.getPosition().lat()) / t,
            s = (this.center_.lng() * (t - 1) + e.getPosition().lng()) / t;
          (this.center_ = new google.maps.LatLng(i, s)),
            this.calculateBounds_();
        }
      } else (this.center_ = e.getPosition()), this.calculateBounds_();
      (e.isAdded = !0), this.markers_.push(e);
      var o = this.markers_.length;
      if (
        (o < this.minClusterSize_ &&
          e.getMap() != this.map_ &&
          e.setMap(this.map_),
        o == this.minClusterSize_)
      )
        for (var n = 0; n < o; n++) this.markers_[n].setMap(null);
      return o >= this.minClusterSize_ && e.setMap(null), this.updateIcon(), !0;
    }),
    (a.prototype.getMarkerClusterer = function () {
      return this.markerClusterer_;
    }),
    (a.prototype.getBounds = function () {
      for (
        var e,
          t = new google.maps.LatLngBounds(this.center_, this.center_),
          i = this.getMarkers(),
          s = 0;
        (e = i[s]);
        s++
      )
        t.extend(e.getPosition());
      return t;
    }),
    (a.prototype.remove = function () {
      this.clusterIcon_.remove(),
        (this.markers_.length = 0),
        delete this.markers_;
    }),
    (a.prototype.getSize = function () {
      return this.markers_.length;
    }),
    (a.prototype.getMarkers = function () {
      return this.markers_;
    }),
    (a.prototype.getCenter = function () {
      return this.center_;
    }),
    (a.prototype.calculateBounds_ = function () {
      var e = new google.maps.LatLngBounds(this.center_, this.center_);
      this.bounds_ = this.markerClusterer_.getExtendedBounds(e);
    }),
    (a.prototype.isMarkerInClusterBounds = function (e) {
      return this.bounds_.contains(e.getPosition());
    }),
    (a.prototype.getMap = function () {
      return this.map_;
    }),
    (a.prototype.updateIcon = function () {
      var e = this.map_.getZoom(),
        t = this.markerClusterer_.getMaxZoom();
      if (t && t < e)
        for (var i, s = 0; (i = this.markers_[s]); s++) i.setMap(this.map_);
      else if (this.markers_.length < this.minClusterSize_)
        this.clusterIcon_.hide();
      else {
        var o = this.markerClusterer_.getStyles().length,
          n = this.markerClusterer_.getCalculator()(this.markers_, o);
        this.clusterIcon_.setCenter(this.center_),
          this.clusterIcon_.setSums(n),
          this.clusterIcon_.show();
      }
    }),
    (s.prototype.triggerClusterClick = function () {
      var e = this.cluster_.getMarkerClusterer();
      google.maps.event.trigger(e.map_, "clusterclick", this.cluster_),
        e.isZoomOnClick() && this.map_.fitBounds(this.cluster_.getBounds());
    }),
    (s.prototype.onAdd = function () {
      if (((this.div_ = document.createElement("DIV")), this.visible_)) {
        var e = this.getPosFromLatLng_(this.center_);
        (this.div_.style.cssText = this.createCss(e)),
          (this.div_.innerHTML = this.sums_.text),
          (this.div_.className = "clusterDiv");
      }
      this.getPanes().overlayMouseTarget.appendChild(this.div_);
      var t = this;
      google.maps.event.addDomListener(this.div_, "click", function () {
        t.triggerClusterClick();
      });
    }),
    (s.prototype.getPosFromLatLng_ = function (e) {
      var t = this.getProjection().fromLatLngToDivPixel(e);
      return (
        (t.x -= parseInt(this.width_ / 2, 10)),
        (t.y -= parseInt(this.height_ / 2, 10)),
        t
      );
    }),
    (s.prototype.draw = function () {
      if (this.visible_) {
        var e = this.getPosFromLatLng_(this.center_);
        (this.div_.style.top = e.y + "px"),
          (this.div_.style.left = e.x + "px"),
          (this.div_.style.zIndex = google.maps.Marker.MAX_ZINDEX + 1);
      }
    }),
    (s.prototype.hide = function () {
      this.div_ && (this.div_.style.display = "none"), (this.visible_ = !1);
    }),
    (s.prototype.show = function () {
      if (this.div_) {
        var e = this.getPosFromLatLng_(this.center_);
        (this.div_.style.cssText = this.createCss(e)),
          (this.div_.style.display = "");
      }
      this.visible_ = !0;
    }),
    (s.prototype.remove = function () {
      this.setMap(null);
    }),
    (s.prototype.onRemove = function () {
      this.div_ &&
        this.div_.parentNode &&
        (this.hide(),
        this.div_.parentNode.removeChild(this.div_),
        (this.div_ = null));
    }),
    (s.prototype.setSums = function (e) {
      (this.sums_ = e),
        (this.text_ = e.text),
        (this.index_ = e.index),
        this.div_ && (this.div_.innerHTML = e.text),
        this.useStyle();
    }),
    (s.prototype.useStyle = function () {
      var e = Math.max(0, this.sums_.index - 1);
      e = Math.min(this.styles_.length - 1, e);
      var t = this.styles_[e];
      (this.url_ = t.url),
        (this.height_ = t.height),
        (this.width_ = t.width),
        (this.textColor_ = t.textColor),
        (this.anchor_ = t.anchor),
        (this.textSize_ = t.textSize),
        (this.backgroundPosition_ = t.backgroundPosition);
    }),
    (s.prototype.setCenter = function (e) {
      this.center_ = e;
    }),
    (s.prototype.createCss = function (e) {
      var t = [];
      t.push("background-image:url(" + this.url_ + ");");
      var i = this.backgroundPosition_ ? this.backgroundPosition_ : "0 0";
      t.push("background-position:" + i + ";"),
        "object" === n(this.anchor_)
          ? ("number" == typeof this.anchor_[0] &&
            0 < this.anchor_[0] &&
            this.anchor_[0] < this.height_
              ? t.push(
                  "height:" +
                    (this.height_ - this.anchor_[0]) +
                    "px; padding-top:" +
                    this.anchor_[0] +
                    "px;"
                )
              : t.push(
                  "height:" +
                    this.height_ +
                    "px; line-height:" +
                    this.height_ +
                    "px;"
                ),
            "number" == typeof this.anchor_[1] &&
            0 < this.anchor_[1] &&
            this.anchor_[1] < this.width_
              ? t.push(
                  "width:" +
                    (this.width_ - this.anchor_[1]) +
                    "px; padding-left:" +
                    this.anchor_[1] +
                    "px;"
                )
              : t.push("width:" + this.width_ + "px; text-align:center;"))
          : t.push(
              "height:" +
                this.height_ +
                "px; line-height:" +
                this.height_ +
                "px; width:" +
                this.width_ +
                "px; text-align:center;"
            );
      var s = this.textColor_ ? this.textColor_ : "black",
        o = this.textSize_ ? this.textSize_ : 11;
      return (
        t.push(
          "cursor:pointer; top:" +
            e.y +
            "px; left:" +
            e.x +
            "px; color:" +
            s +
            "; position:absolute; font-size:" +
            o +
            "px; font-family:Arial,sans-serif; font-weight:bold"
        ),
        t.join("")
      );
    });
  var e = e || {};
  function t(e) {
    (e = e || {}),
      google.maps.OverlayView.apply(this, arguments),
      (this.content_ = e.content || ""),
      (this.disableAutoPan_ = e.disableAutoPan || !1),
      (this.maxWidth_ = e.maxWidth || 0),
      (this.pixelOffset_ = e.pixelOffset || new google.maps.Size(0, 0)),
      (this.position_ = e.position || new google.maps.LatLng(0, 0)),
      (this.zIndex_ = e.zIndex || null),
      (this.boxClass_ = e.boxClass || "infoBox"),
      (this.boxStyle_ = e.boxStyle || {}),
      (this.closeBoxMargin_ = e.closeBoxMargin || "2px"),
      (this.closeBoxURL_ =
        e.closeBoxURL || "//www.google.com/intl/en_us/mapfiles/close.gif"),
      "" === e.closeBoxURL && (this.closeBoxURL_ = ""),
      (this.closeBoxTitle_ = e.closeBoxTitle || " Close "),
      (this.infoBoxClearance_ =
        e.infoBoxClearance || new google.maps.Size(1, 1)),
      void 0 === e.visible &&
        (void 0 === e.isHidden ? (e.visible = !0) : (e.visible = !e.isHidden)),
      (this.isHidden_ = !e.visible),
      (this.alignBottom_ = e.alignBottom || !1),
      (this.pane_ = e.pane || "floatPane"),
      (this.enableEventPropagation_ = e.enableEventPropagation || !1),
      (this.div_ = null),
      (this.closeListener_ = null),
      (this.moveListener_ = null),
      (this.contextListener_ = null),
      (this.eventListeners_ = null),
      (this.fixedWidthSet_ = null);
  }
  ((e.MarkerClusterer = r).prototype.addMarker = r.prototype.addMarker),
    (r.prototype.addMarkers = r.prototype.addMarkers),
    (r.prototype.clearMarkers = r.prototype.clearMarkers),
    (r.prototype.fitMapToMarkers = r.prototype.fitMapToMarkers),
    (r.prototype.getCalculator = r.prototype.getCalculator),
    (r.prototype.getGridSize = r.prototype.getGridSize),
    (r.prototype.getExtendedBounds = r.prototype.getExtendedBounds),
    (r.prototype.getMap = r.prototype.getMap),
    (r.prototype.getMarkers = r.prototype.getMarkers),
    (r.prototype.getMaxZoom = r.prototype.getMaxZoom),
    (r.prototype.getStyles = r.prototype.getStyles),
    (r.prototype.getTotalClusters = r.prototype.getTotalClusters),
    (r.prototype.getTotalMarkers = r.prototype.getTotalMarkers),
    (r.prototype.redraw = r.prototype.redraw),
    (r.prototype.removeMarker = r.prototype.removeMarker),
    (r.prototype.removeMarkers = r.prototype.removeMarkers),
    (r.prototype.resetViewport = r.prototype.resetViewport),
    (r.prototype.repaint = r.prototype.repaint),
    (r.prototype.setCalculator = r.prototype.setCalculator),
    (r.prototype.setGridSize = r.prototype.setGridSize),
    (r.prototype.setMaxZoom = r.prototype.setMaxZoom),
    (r.prototype.onAdd = r.prototype.onAdd),
    (r.prototype.draw = r.prototype.draw),
    (a.prototype.getCenter = a.prototype.getCenter),
    (a.prototype.getSize = a.prototype.getSize),
    (a.prototype.getMarkers = a.prototype.getMarkers),
    (s.prototype.onAdd = s.prototype.onAdd),
    (s.prototype.draw = s.prototype.draw),
    (s.prototype.onRemove = s.prototype.onRemove),
    (Object.keys =
      Object.keys ||
      function (e) {
        var t = [];
        for (var i in e) e.hasOwnProperty(i) && t.push(i);
        return t;
      }),
    "object" == ("undefined" == typeof module ? "undefined" : n(module)) &&
      (module.exports = r),
    (MyListing.Maps.Clusterer.prototype.init = function (e) {
      (this.map = e),
        (this.clusterer = new r(this.map.getSourceObject(), this.getMarkers(), {
          averageCenter: !0,
          gridSize: MyListing.MapConfig.ClusterSize,
        })),
        (this.clusterGroupPopup = new MyListing.Maps.Popup({ map: this.map })),
        this.map.addListener("clusterclick", this.handlePopupGroup.bind(this)),
        this.map.addListener(
          "mylisting:closing_popups",
          function () {
            this.clusterGroupPopup.hide();
          }.bind(this)
        );
    }),
    (MyListing.Maps.Clusterer.prototype.update = function () {
      this.clusterer.clearMarkers(),
        this.clusterer.addMarkers(this.getMarkers());
    }),
    (MyListing.Maps.Clusterer.prototype.getMarkers = function () {
      return this.map.markers.map(function (e) {
        return e.getSourceObject();
      });
    }),
    (MyListing.Maps.Clusterer.prototype.handlePopupGroup = function (e) {
      var t = e.getCenter();
      if (!(this.map.getZoom() < this.map.getMaxZoom())) {
        var i =
          '<div class="marker-cluster-popup"><div class="lf-item marker-cluster-wrapper" data-template="marker-cluster-popup">';
        e.getMarkers().forEach(function (e) {
          i += e.args.popup.popup.getContent();
        }),
          (i += "</div></div>"),
          this.clusterGroupPopup
            .setPosition(new MyListing.Maps.LatLng(t.lat(), t.lng()))
            .setContent(i)
            .popup.setOptions({ enableEventPropagation: !1 }),
          setTimeout(
            function () {
              this.clusterGroupPopup.show();
            }.bind(this),
            15
          );
      }
    }),
    (MyListing.Maps.GoogleMapsOverlay = function (e) {
      (this.args = {
        marker: e,
        template: null,
        latlng: e.getPosition().getSourceObject(),
        map: e.options.map,
        popup: e.options.popup,
      }),
        this.args.map &&
          this.args.popup &&
          this.args.popup.setMap(this.args.map);
    }),
    "undefined" != typeof google &&
      (MyListing.Maps.GoogleMapsOverlay.prototype =
        new google.maps.OverlayView()),
    (MyListing.Maps.GoogleMapsOverlay.prototype.draw = function () {
      this.args.template ||
        ((this.args.template = this.args.marker.getTemplate()),
        google.maps.event.addDomListener(
          this.args.template,
          "click",
          function (e) {
            e.preventDefault(),
              e.stopPropagation(),
              "advanced" === this.args.marker.options.template.type &&
                this.args.map &&
                this.args.popup &&
                (this.args.map.closePopups(),
                this.args.popup
                  .setPosition(this.args.marker.getPosition())
                  .show());
          }.bind(this)
        ),
        this.getPanes().overlayImage.appendChild(this.args.template));
      this.setPosition(this.args.latlng);
    }),
    (MyListing.Maps.GoogleMapsOverlay.prototype.remove = function () {
      this.args.template &&
        (this.args.template.parentNode.removeChild(this.args.template),
        (this.args.template = null));
    }),
    (MyListing.Maps.GoogleMapsOverlay.prototype.getPosition = function () {
      return this.args.latlng;
    }),
    (MyListing.Maps.GoogleMapsOverlay.prototype.getDraggable = function () {
      return !1;
    }),
    (MyListing.Maps.GoogleMapsOverlay.prototype.getVisible = function () {
      return !0;
    }),
    (MyListing.Maps.GoogleMapsOverlay.prototype.setPosition = function (e) {
      if (
        ((this.args.latlng = e),
        this.args.template &&
          !(!this.args.latlng instanceof google.maps.LatLng))
      ) {
        var t = this.getProjection().fromLatLngToDivPixel(this.args.latlng);
        (this.args.template.style.left = t.x + "px"),
          (this.args.template.style.top = t.y + "px");
      }
    }),
    (MyListing.Maps.Geocoder.prototype.init = function () {
      this.geocoder = new google.maps.Geocoder();
    }),
    (MyListing.Maps.Geocoder.prototype.geocode = function (e, s, o) {
      var n = this,
        r = !1,
        a = {};
      if (e instanceof google.maps.LatLng) a.location = e;
      else {
        if ("string" != typeof e || !e.length) return o(r);
        a.address = e;
      }
      if ("function" == typeof s) (o = s), (s = {});
      s = jQuery.extend({ limit: 1 }, s);
      this.geocoder.geocode(a, function (e, t) {
        if ("OK" === t && e && e.length)
          return (
            (r =
              1 === s.limit ? n.formatFeature(e[0]) : e.map(n.formatFeature)),
            o(r)
          );
        if (
          (console.log("Geocoding failed. [" + t + "]"), n.map && a.location)
        ) {
          console.log("Retrying with Nearby Search..."), (a.radius = 500);
          var i = new google.maps.places.PlacesService(n.map.getSourceObject());
          i.nearbySearch(a, function (e, t) {
            "OK" === t &&
              e.length &&
              i.getDetails({ reference: e[0].reference }, function (e, t) {
                "OK" === t &&
                  ((r =
                    1 === s.limit ? n.formatFeature(e) : [n.formatFeature(e)]),
                  o(r));
              });
          });
        }
      });
    }),
    (MyListing.Maps.Geocoder.prototype.formatFeature = function (e) {
      return {
        latitude: e.geometry.location.lat(),
        longitude: e.geometry.location.lng(),
        address: e.formatted_address,
      };
    }),
    (MyListing.Maps.Map.prototype.init = function (e) {
      this.options = jQuery.extend(
        {},
        MyListing.Maps.options,
        jQuery(e).data("options")
      );
      (this.markers = []),
        (this.bounds = new MyListing.Maps.LatLngBounds()),
        (this.id = !!jQuery(e).attr("id") && jQuery(e).attr("id")),
        (this.events = {}),
        (this.map = new google.maps.Map(e, {
          zoom: this.options.zoom,
          minZoom: this.options.minZoom,
          maxZoom: this.options.maxZoom,
          draggable: this.options.draggable,
          styles: MyListing.Maps.skins[this.options.skin]
            ? MyListing.Maps.skins[this.options.skin]
            : MyListing.Maps.skins.skin1,
          gestureHandling: this.options.gestureHandling,
          scrollwheel: this.options.scrollwheel,
          navigationControl: !0,
          mapTypeControl: !1,
          streetViewControl: !1,
        })),
        this.setZoom(3),
        this.setCenter(new MyListing.Maps.LatLng(0, 0)),
        this._maybeAddMarkers(),
        this.options.cluster_markers &&
          0 < MyListing.MapConfig.ClusterSize &&
          ((this.clusterer = new MyListing.Maps.Clusterer(this)),
          this.addListener("updated_markers", this._updateCluster.bind(this))),
        this.addListener("zoom_changed", this.closePopups.bind(this)),
        this.addListener("click", this.closePopups.bind(this)),
        MyListing.Maps.instances.push({
          id: this.id,
          map: this.map,
          instance: this,
        });
    }),
    (MyListing.Maps.Map.prototype.setZoom = function (e) {
      this.map.setZoom(e);
    }),
    (MyListing.Maps.Map.prototype.getZoom = function () {
      return this.map.getZoom();
    }),
    (MyListing.Maps.Map.prototype.getMinZoom = function () {
      return this.map.minZoom;
    }),
    (MyListing.Maps.Map.prototype.getMaxZoom = function () {
      return this.map.maxZoom;
    }),
    (MyListing.Maps.Map.prototype.setCenter = function (e) {
      this.map.setCenter(e.getSourceObject());
    }),
    (MyListing.Maps.Map.prototype.getCenter = function () {
      return new MyListing.Maps.LatLng(
        this.map.center.lat(),
        this.map.center.lng()
      );
    }),
    (MyListing.Maps.Map.prototype.getDimensions = function () {
      var e = this.map.getBounds(),
        t = e.getSouthWest(),
        i = e.getNorthEast(),
        s = this.map.getDiv().offsetWidth,
        o = this.map.getDiv().offsetHeight,
        n = Math.atan(o / s),
        r = MyListing.Helpers.coordinatesToDistance(
          t.lat(),
          t.lng(),
          i.lat(),
          i.lng()
        ),
        a = Math.cos(n) * r,
        l = Math.sin(n) * r;
      return { diagonal: r, width: a, height: l, average: (a + l) / 2 };
    }),
    (MyListing.Maps.Map.prototype.fitBounds = function (e) {
      this.map.fitBounds(e.getSourceObject());
    }),
    (MyListing.Maps.Map.prototype.panTo = function (e) {
      this.map.panTo(e.getSourceObject());
    }),
    (MyListing.Maps.Map.prototype.getClickPosition = function (e) {
      return new MyListing.Maps.LatLng(e.latLng.lat(), e.latLng.lng());
    }),
    (MyListing.Maps.Map.prototype.addListener = function (e, t) {
      google.maps.event.addListener(
        this.map,
        this.getSourceEvent(e),
        function (e) {
          t(e);
        }
      );
    }),
    (MyListing.Maps.Map.prototype.addListenerOnce = function (e, t) {
      google.maps.event.addListenerOnce(
        this.map,
        this.getSourceEvent(e),
        function (e) {
          t(e);
        }
      );
    }),
    (MyListing.Maps.Map.prototype.trigger = function (e) {
      google.maps.event.trigger(this.map, this.getSourceEvent(e));
    }),
    (MyListing.Maps.Map.prototype.addControl = function (e) {
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(e);
    }),
    (MyListing.Maps.Map.prototype._updateCluster = function () {
      this.clusterer || (this.clusterer = new MyListing.Maps.Clusterer(this)),
        setTimeout(
          function () {
            this.clusterer.update();
          }.bind(this),
          5
        );
    }),
    (MyListing.Maps.Map.prototype.getSourceObject = function () {
      return this.map;
    }),
    (MyListing.Maps.Marker.prototype.init = function (e) {
      (this.marker = new MyListing.Maps.GoogleMapsOverlay(this)),
        this.options.position && this.setPosition(this.options.position),
        this.options.map && this.setMap(this.options.map);
    }),
    (MyListing.Maps.Marker.prototype.getPosition = function () {
      return this.options.position;
    }),
    (MyListing.Maps.Marker.prototype.setPosition = function (e) {
      return this.marker.setPosition(e.getSourceObject()), this;
    }),
    (MyListing.Maps.Marker.prototype.setMap = function (e) {
      return this.marker.setMap(e.getSourceObject()), this;
    }),
    (MyListing.Maps.Marker.prototype.remove = function () {
      return (
        this.options.popup && this.options.popup.remove(),
        this.marker.setMap(null),
        this.marker.remove(),
        this
      );
    }),
    (MyListing.Maps.Marker.prototype.getSourceObject = function () {
      return this.marker;
    }),
    ((t.prototype = new google.maps.OverlayView()).createInfoBoxDiv_ =
      function () {
        function t(e) {
          (e.cancelBubble = !0), e.stopPropagation && e.stopPropagation();
        }
        var e,
          i,
          s,
          o = this;
        if (!this.div_) {
          if (
            ((this.div_ = document.createElement("div")),
            this.setBoxStyle_(),
            void 0 === this.content_.nodeType
              ? (this.div_.innerHTML = this.getCloseBoxImg_() + this.content_)
              : ((this.div_.innerHTML = this.getCloseBoxImg_()),
                this.div_.appendChild(this.content_)),
            this.getPanes()[this.pane_].appendChild(this.div_),
            this.addClickHandler_(),
            this.div_.style.width
              ? (this.fixedWidthSet_ = !0)
              : 0 !== this.maxWidth_ && this.div_.offsetWidth > this.maxWidth_
              ? ((this.div_.style.width = this.maxWidth_),
                (this.div_.style.overflow = "auto"),
                (this.fixedWidthSet_ = !0))
              : ((s = this.getBoxWidths_()),
                (this.div_.style.width =
                  this.div_.offsetWidth - s.left - s.right + "px"),
                (this.fixedWidthSet_ = !1)),
            this.panBox_(this.disableAutoPan_),
            !this.enableEventPropagation_)
          ) {
            for (
              this.eventListeners_ = [],
                i = [
                  "mousedown",
                  "mouseover",
                  "mouseout",
                  "mouseup",
                  "click",
                  "dblclick",
                  "touchstart",
                  "touchend",
                  "touchmove",
                  "wheel",
                  "mousewheel",
                  "DOMMouseScroll",
                  "MozMousePixelScroll",
                ],
                e = 0;
              e < i.length;
              e++
            )
              this.eventListeners_.push(
                google.maps.event.addDomListener(this.div_, i[e], t)
              );
            this.eventListeners_.push(
              google.maps.event.addDomListener(
                this.div_,
                "mouseover",
                function (e) {
                  this.style.cursor = "default";
                }
              )
            );
          }
          (this.contextListener_ = google.maps.event.addDomListener(
            this.div_,
            "contextmenu",
            function (e) {
              (e.returnValue = !1),
                e.preventDefault && e.preventDefault(),
                o.enableEventPropagation_ || t(e);
            }
          )),
            google.maps.event.trigger(this, "domready");
        }
      }),
    (t.prototype.getCloseBoxImg_ = function () {
      var e = "";
      return (
        "" !== this.closeBoxURL_ &&
          ((e = "<img"),
          (e += " src='" + this.closeBoxURL_ + "'"),
          (e += " align=right"),
          (e += " title='" + this.closeBoxTitle_ + "'"),
          (e += " style='"),
          (e += " position: relative;"),
          (e += " cursor: pointer;"),
          (e += " margin: " + this.closeBoxMargin_ + ";"),
          (e += "'>")),
        e
      );
    }),
    (t.prototype.addClickHandler_ = function () {
      var e;
      "" !== this.closeBoxURL_
        ? ((e = this.div_.firstChild),
          (this.closeListener_ = google.maps.event.addDomListener(
            e,
            "click",
            this.getCloseClickHandler_()
          )))
        : (this.closeListener_ = null);
    }),
    (t.prototype.getCloseClickHandler_ = function () {
      var t = this;
      return function (e) {
        (e.cancelBubble = !0),
          e.stopPropagation && e.stopPropagation(),
          google.maps.event.trigger(t, "closeclick"),
          t.close();
      };
    }),
    (t.prototype.panBox_ = function (e) {
      var t,
        i = 0,
        s = 0;
      if (!e && (t = this.getMap()) instanceof google.maps.Map) {
        t.getBounds().contains(this.position_) || t.setCenter(this.position_);
        var o = this.pixelOffset_.width,
          n = this.pixelOffset_.height,
          r = this.div_.offsetWidth,
          a = this.div_.offsetHeight,
          l = this.infoBoxClearance_.width,
          p = this.infoBoxClearance_.height;
        if (2 == t.panToBounds.length) {
          var y = { left: 0, right: 0, top: 0, bottom: 0 };
          (y.left = -o + l),
            (y.right = o + r + l),
            this.alignBottom_
              ? ((y.top = -n + p + a), (y.bottom = n + p))
              : ((y.top = -n + p), (y.bottom = n + a + p)),
            t.panToBounds(new google.maps.LatLngBounds(this.position_), y);
        } else {
          var u = t.getDiv(),
            h = u.offsetWidth,
            g = u.offsetHeight,
            c = this.getProjection().fromLatLngToContainerPixel(this.position_);
          if (
            (c.x < -o + l
              ? (i = c.x + o - l)
              : c.x + r + o + l > h && (i = c.x + r + o + l - h),
            this.alignBottom_
              ? c.y < -n + p + a
                ? (s = c.y + n - p - a)
                : c.y + n + p > g && (s = c.y + n + p - g)
              : c.y < -n + p
              ? (s = c.y + n - p)
              : c.y + a + n + p > g && (s = c.y + a + n + p - g),
            0 !== i || 0 !== s)
          ) {
            t.getCenter();
            t.panBy(i, s);
          }
        }
      }
    }),
    (t.prototype.setBoxStyle_ = function () {
      var e, t;
      if (this.div_) {
        for (e in ((this.div_.className = this.boxClass_),
        (this.div_.style.cssText = ""),
        (t = this.boxStyle_)))
          t.hasOwnProperty(e) && (this.div_.style[e] = t[e]);
        (void 0 === this.div_.style.WebkitTransform ||
          (-1 === this.div_.style.WebkitTransform.indexOf("translateZ") &&
            -1 === this.div_.style.WebkitTransform.indexOf("matrix"))) &&
          (this.div_.style.WebkitTransform = "translateZ(0)"),
          void 0 !== this.div_.style.opacity &&
            "" !== this.div_.style.opacity &&
            ((this.div_.style.MsFilter =
              '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' +
              100 * this.div_.style.opacity +
              ')"'),
            (this.div_.style.filter =
              "alpha(opacity=" + 100 * this.div_.style.opacity + ")")),
          (this.div_.style.position = "absolute"),
          (this.div_.style.visibility = "hidden"),
          null !== this.zIndex_ && (this.div_.style.zIndex = this.zIndex_);
      }
    }),
    (t.prototype.getBoxWidths_ = function () {
      var e,
        t = { top: 0, bottom: 0, left: 0, right: 0 },
        i = this.div_;
      return (
        document.defaultView && document.defaultView.getComputedStyle
          ? (e = i.ownerDocument.defaultView.getComputedStyle(i, "")) &&
            ((t.top = parseInt(e.borderTopWidth, 10) || 0),
            (t.bottom = parseInt(e.borderBottomWidth, 10) || 0),
            (t.left = parseInt(e.borderLeftWidth, 10) || 0),
            (t.right = parseInt(e.borderRightWidth, 10) || 0))
          : document.documentElement.currentStyle &&
            i.currentStyle &&
            ((t.top = parseInt(i.currentStyle.borderTopWidth, 10) || 0),
            (t.bottom = parseInt(i.currentStyle.borderBottomWidth, 10) || 0),
            (t.left = parseInt(i.currentStyle.borderLeftWidth, 10) || 0),
            (t.right = parseInt(i.currentStyle.borderRightWidth, 10) || 0)),
        t
      );
    }),
    (t.prototype.onRemove = function () {
      this.div_ &&
        (this.div_.parentNode.removeChild(this.div_), (this.div_ = null));
    }),
    (t.prototype.draw = function () {
      this.createInfoBoxDiv_();
      var e = this.getProjection().fromLatLngToDivPixel(this.position_);
      (this.div_.style.left = e.x + this.pixelOffset_.width + "px"),
        this.alignBottom_
          ? (this.div_.style.bottom = -(e.y + this.pixelOffset_.height) + "px")
          : (this.div_.style.top = e.y + this.pixelOffset_.height + "px"),
        this.isHidden_
          ? (this.div_.style.visibility = "hidden")
          : (this.div_.style.visibility = "visible");
    }),
    (t.prototype.setOptions = function (e) {
      void 0 !== e.boxClass &&
        ((this.boxClass_ = e.boxClass), this.setBoxStyle_()),
        void 0 !== e.boxStyle &&
          ((this.boxStyle_ = e.boxStyle), this.setBoxStyle_()),
        void 0 !== e.content && this.setContent(e.content),
        void 0 !== e.disableAutoPan &&
          (this.disableAutoPan_ = e.disableAutoPan),
        void 0 !== e.maxWidth && (this.maxWidth_ = e.maxWidth),
        void 0 !== e.pixelOffset && (this.pixelOffset_ = e.pixelOffset),
        void 0 !== e.alignBottom && (this.alignBottom_ = e.alignBottom),
        void 0 !== e.position && this.setPosition(e.position),
        void 0 !== e.zIndex && this.setZIndex(e.zIndex),
        void 0 !== e.closeBoxMargin &&
          (this.closeBoxMargin_ = e.closeBoxMargin),
        void 0 !== e.closeBoxURL && (this.closeBoxURL_ = e.closeBoxURL),
        void 0 !== e.closeBoxTitle && (this.closeBoxTitle_ = e.closeBoxTitle),
        void 0 !== e.infoBoxClearance &&
          (this.infoBoxClearance_ = e.infoBoxClearance),
        void 0 !== e.isHidden && (this.isHidden_ = e.isHidden),
        void 0 !== e.visible && (this.isHidden_ = !e.visible),
        void 0 !== e.enableEventPropagation &&
          (this.enableEventPropagation_ = e.enableEventPropagation),
        this.div_ && this.draw();
    }),
    (t.prototype.setContent = function (e) {
      (this.content_ = e),
        this.div_ &&
          (this.closeListener_ &&
            (google.maps.event.removeListener(this.closeListener_),
            (this.closeListener_ = null)),
          this.fixedWidthSet_ || (this.div_.style.width = ""),
          void 0 === e.nodeType
            ? (this.div_.innerHTML = this.getCloseBoxImg_() + e)
            : ((this.div_.innerHTML = this.getCloseBoxImg_()),
              this.div_.appendChild(e)),
          this.fixedWidthSet_ ||
            ((this.div_.style.width = this.div_.offsetWidth + "px"),
            void 0 === e.nodeType
              ? (this.div_.innerHTML = this.getCloseBoxImg_() + e)
              : ((this.div_.innerHTML = this.getCloseBoxImg_()),
                this.div_.appendChild(e))),
          this.addClickHandler_()),
        google.maps.event.trigger(this, "content_changed");
    }),
    (t.prototype.setPosition = function (e) {
      (this.position_ = e),
        this.div_ && this.draw(),
        google.maps.event.trigger(this, "position_changed");
    }),
    (t.prototype.setZIndex = function (e) {
      (this.zIndex_ = e),
        this.div_ && (this.div_.style.zIndex = e),
        google.maps.event.trigger(this, "zindex_changed");
    }),
    (t.prototype.setVisible = function (e) {
      (this.isHidden_ = !e),
        this.div_ &&
          (this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible");
    }),
    (t.prototype.getContent = function () {
      return this.content_;
    }),
    (t.prototype.getPosition = function () {
      return this.position_;
    }),
    (t.prototype.getZIndex = function () {
      return this.zIndex_;
    }),
    (t.prototype.getVisible = function () {
      return (
        void 0 !== this.getMap() && null !== this.getMap() && !this.isHidden_
      );
    }),
    (t.prototype.getWidth = function () {
      var e = null;
      return this.div_ && (e = this.div_.offsetWidth), e;
    }),
    (t.prototype.getHeight = function () {
      var e = null;
      return this.div_ && (e = this.div_.offsetHeight), e;
    }),
    (t.prototype.show = function () {
      (this.isHidden_ = !1),
        this.div_ && (this.div_.style.visibility = "visible");
    }),
    (t.prototype.hide = function () {
      (this.isHidden_ = !0),
        this.div_ && (this.div_.style.visibility = "hidden");
    }),
    (t.prototype.open = function (e, t) {
      var i = this;
      t &&
        (this.setPosition(t.getPosition()),
        (this.moveListener_ = google.maps.event.addListener(
          t,
          "position_changed",
          function () {
            i.setPosition(this.getPosition());
          }
        ))),
        this.setMap(e),
        this.div_ && this.panBox_(this.disableAutoPan_);
    }),
    (t.prototype.close = function () {
      var e;
      if (
        (this.closeListener_ &&
          (google.maps.event.removeListener(this.closeListener_),
          (this.closeListener_ = null)),
        this.eventListeners_)
      ) {
        for (e = 0; e < this.eventListeners_.length; e++)
          google.maps.event.removeListener(this.eventListeners_[e]);
        this.eventListeners_ = null;
      }
      this.moveListener_ &&
        (google.maps.event.removeListener(this.moveListener_),
        (this.moveListener_ = null)),
        this.contextListener_ &&
          (google.maps.event.removeListener(this.contextListener_),
          (this.contextListener_ = null)),
        this.setMap(null);
    }),
    (MyListing.Maps.Popup.prototype.init = function (e) {
      (this.template_name = "default"),
        (this.popup = new t({
          content: "",
          disableAutoPan: !1,
          maxWidth: 0,
          pixelOffset: new google.maps.Size(50, -128),
          zIndex: 5e8,
          boxClass: this._getBoxClass(),
          boxStyle: { width: "300px", zIndex: 5e6 },
          closeBoxURL: "",
          infoBoxClearance: new google.maps.Size(20, 20),
          isHidden: !1,
          pane: "floatPane",
          enableEventPropagation: !0,
        })),
        (this.dragSearchTimeout = null),
        this.options.position && this.setPosition(this.options.position),
        this.options.content && this.setContent(this.options.content),
        this.options.map && this.setMap(this.options.map);
    }),
    (MyListing.Maps.Popup.prototype.setContent = function (e) {
      return this.popup.setContent(e), this._parseTemplate(), this;
    }),
    (MyListing.Maps.Popup.prototype.setPosition = function (e) {
      return this.popup.setPosition(e.getSourceObject()), this;
    }),
    (MyListing.Maps.Popup.prototype.setMap = function (e) {
      return (this.map = e), this;
    }),
    (MyListing.Maps.Popup.prototype.remove = function () {
      return this.popup.close(), this;
    }),
    (MyListing.Maps.Popup.prototype.show = function () {
      return (
        MyListing.Explore &&
          ((MyListing.Explore.suspendDragSearch = !0),
          (this.dragSearchTimeout = setTimeout(function () {
            return (MyListing.Explore.suspendDragSearch = !1);
          }, 1e3))),
        this.popup.getVisible() ||
          (this.popup.open(this.map.getSourceObject()),
          setTimeout(
            function () {
              this.popup.setOptions({
                boxClass: this._getBoxClass() + " show",
              });
            }.bind(this),
            5
          )),
        this
      );
    }),
    (MyListing.Maps.Popup.prototype.hide = function () {
      return (
        this.dragSearchTimeout &&
          (clearTimeout(this.dragSearchTimeout),
          (this.dragSearchTimeout = null)),
        this.popup.getVisible() &&
          (this.remove(),
          this.popup.setOptions({ boxClass: this._getBoxClass() })),
        this
      );
    }),
    (MyListing.Maps.Popup.prototype._getBoxClass = function () {
      return [
        "infoBox",
        "c27-listing-preview",
        "listing-preview",
        this.options.classes ? this.options.classes : "",
        "tpl-" + this.template_name,
      ].join(" ");
    }),
    (MyListing.Maps.Popup.prototype._parseTemplate = function () {
      if (this.popup && this.popup.getContent()) {
        var e = jQuery(this.popup.getContent())
          .find(".lf-item")
          .data("template");
        e && (this.template_name = e),
          "list-view" === this.template_name &&
            this.popup.setOptions({
              pixelOffset: new google.maps.Size(50, -40),
            }),
          "marker-cluster-popup" === this.template_name &&
            this.popup.setOptions({
              pixelOffset: new google.maps.Size(50, -122),
            });
      }
    }),
    (MyListing.Maps.LatLng.prototype.init = function (e, t) {
      (this.latitude = e),
        (this.longitude = t),
        (this.latlng = new google.maps.LatLng(e, t));
    }),
    (MyListing.Maps.LatLng.prototype.getLatitude = function () {
      return this.latlng.lat();
    }),
    (MyListing.Maps.LatLng.prototype.getLongitude = function () {
      return this.latlng.lng();
    }),
    (MyListing.Maps.LatLng.prototype.toGeocoderFormat = function () {
      return this.latlng;
    }),
    (MyListing.Maps.LatLngBounds.prototype.init = function (e, t) {
      (this.southwest = e),
        (this.northeast = t),
        (this.bounds = new google.maps.LatLngBounds(e, t));
    }),
    (MyListing.Maps.LatLngBounds.prototype.extend = function (e) {
      this.bounds.extend(e.getSourceObject());
    }),
    (MyListing.Maps.LatLngBounds.prototype.empty = function () {
      return this.bounds.isEmpty();
    }),
    (MyListing.Maps.skins = {
      skin1: [
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "administrative.country",
          elementType: "geometry",
          stylers: [{ lightness: "100" }],
        },
        {
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [{ lightness: "0" }, { color: "#d0ecff" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.province",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text",
          stylers: [{ visibility: "simplified" }, { color: "#777777" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.icon",
          stylers: [{ visibility: "simplified" }, { lightness: 60 }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "all",
          stylers: [{ visibility: "simplified" }, { color: "#f5f5f5" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#fafafa" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "poi",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.attraction",
          elementType: "geometry",
          stylers: [{ color: "#e2e8cf" }],
        },
        {
          featureType: "poi.business",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "poi.business",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.medical",
          elementType: "all",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#ecf4d7" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.place_of_worship",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "poi.school",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "poi.sports_complex",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }, { visibility: "simplified" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry.stroke",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.local",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "road.local",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "on" }, { color: "#eeeeee" }],
        },
        {
          featureType: "road.local",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.text",
          stylers: [{ color: "#777777" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry.fill",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#d0ecff" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      skin2: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [
            { saturation: "0" },
            { color: "#f3f3f3" },
            { lightness: "-40" },
            { gamma: "1" },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#000000" },
            { lightness: "12" },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#2c2d37" }, { lightness: "4" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#2c2d37" }, { lightness: 17 }, { weight: 1.2 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            { color: "#2c2d37" },
            { lightness: "25" },
            { gamma: "0.60" },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            { color: "#2c2d37" },
            { lightness: "26" },
            { gamma: "0.49" },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#2c2d37" }, { lightness: 17 }, { gamma: "0.60" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            { color: "#2c2d37" },
            { lightness: 29 },
            { weight: 0.2 },
            { gamma: "0.60" },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#2c2d37" }, { lightness: 18 }, { gamma: "0.60" }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#2c2d37" }, { lightness: 16 }, { gamma: "0.60" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            { color: "#2c2d37" },
            { lightness: "29" },
            { gamma: "0.60" },
          ],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            { color: "#3c3d47" },
            { lightness: "16" },
            { gamma: "0.50" },
          ],
        },
      ],
      skin3: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 21 }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#ffffff" },
            { lightness: 16 },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            { saturation: 36 },
            { color: "#333333" },
            { lightness: 40 },
          ],
        },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ],
      skin4: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#46bcec" }, { visibility: "on" }],
        },
      ],
      skin5: [
        {
          featureType: "landscape.man_made",
          elementType: "geometry",
          stylers: [{ color: "#f7f1df" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#d0e3b4" }],
        },
        {
          featureType: "landscape.natural.terrain",
          elementType: "geometry",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.business",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.medical",
          elementType: "geometry",
          stylers: [{ color: "#fbd3da" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#bde6ab" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffe15f" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#efd151" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "road.local",
          elementType: "geometry.fill",
          stylers: [{ color: "black" }],
        },
        {
          featureType: "transit.station.airport",
          elementType: "geometry.fill",
          stylers: [{ color: "#cfb2db" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a2daf2" }],
        },
      ],
      skin6: [
        {
          featureType: "administrative",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            { visibility: "simplified" },
            { hue: "#0066ff" },
            { saturation: 74 },
            { lightness: 100 },
          ],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            { visibility: "off" },
            { weight: 0.6 },
            { saturation: -85 },
            { lightness: 61 },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road.arterial",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.local",
          elementType: "all",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            { visibility: "simplified" },
            { color: "#5f94ff" },
            { lightness: 26 },
            { gamma: 5.86 },
          ],
        },
      ],
      skin7: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a0d6d1" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#dedede" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#dedede" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f1f1f1" }, { lightness: 21 }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#ffffff" },
            { lightness: 16 },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            { saturation: 36 },
            { color: "#333333" },
            { lightness: 40 },
          ],
        },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ],
      skin8: [
        {
          featureType: "all",
          stylers: [{ saturation: 0 }, { hue: "#e7ecf0" }],
        },
        { featureType: "road", stylers: [{ saturation: -70 }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        {
          featureType: "water",
          stylers: [{ visibility: "simplified" }, { saturation: -60 }],
        },
      ],
      skin9: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            { hue: "#FFBB00" },
            { saturation: 43.400000000000006 },
            { lightness: 37.599999999999994 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "landscape",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-40" }, { lightness: "36" }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-77" }, { lightness: "28" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            { hue: "#ff0091" },
            { saturation: -44 },
            { lightness: 11.200000000000017 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }, { saturation: -81 }],
        },
        {
          featureType: "poi.attraction",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-24" }, { lightness: "61" }],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            { hue: "#ff0048" },
            { saturation: -78 },
            { lightness: 45.599999999999994 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.arterial",
          elementType: "all",
          stylers: [
            { hue: "#FF0300" },
            { saturation: -100 },
            { lightness: 51.19999999999999 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.local",
          elementType: "all",
          stylers: [
            { hue: "#ff0300" },
            { saturation: -100 },
            { lightness: 52 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.local",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            { hue: "#789cdb" },
            { saturation: -66 },
            { lightness: 2.4000000000000057 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      skin10: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            { hue: "#FFBB00" },
            { saturation: 43.400000000000006 },
            { lightness: 37.599999999999994 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "landscape",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-40" }, { lightness: "36" }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-77" }, { lightness: "28" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            { hue: "#00FF6A" },
            { saturation: -1.0989010989011234 },
            { lightness: 11.200000000000017 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.attraction",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ saturation: "-24" }, { lightness: "61" }],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            { hue: "#FFC200" },
            { saturation: -61.8 },
            { lightness: 45.599999999999994 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.arterial",
          elementType: "all",
          stylers: [
            { hue: "#FF0300" },
            { saturation: -100 },
            { lightness: 51.19999999999999 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.local",
          elementType: "all",
          stylers: [
            { hue: "#ff0300" },
            { saturation: -100 },
            { lightness: 52 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "road.local",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            { hue: "#0078FF" },
            { saturation: -13.200000000000003 },
            { lightness: 2.4000000000000057 },
            { gamma: 1 },
          ],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      skin11: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: "#262c33" }],
        },
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ gamma: 0.01 }, { lightness: 20 }, { color: "#949aa6" }],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            { saturation: -31 },
            { lightness: -33 },
            { weight: 2 },
            { gamma: "0.00" },
            { visibility: "off" },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.province",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            { lightness: 30 },
            { saturation: 30 },
            { color: "#353c44" },
            { visibility: "on" },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            { saturation: "0" },
            { lightness: "0" },
            { gamma: "0.30" },
            { weight: "0.01" },
            { visibility: "off" },
          ],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            { lightness: "100" },
            { saturation: -20 },
            { visibility: "simplified" },
            { color: "#31383f" },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 10 },
            { saturation: -30 },
            { color: "#2a3037" },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [
            { saturation: "-100" },
            { lightness: "-100" },
            { gamma: "0.00" },
            { color: "#2a3037" },
          ],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }, { color: "#575e6b" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#4c5561" }, { visibility: "on" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station.airport",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ lightness: -20 }, { color: "#2a3037" }],
        },
      ],
      skin12: [],
    }),
    (function () {
      if ("object" === n(MyListing.MapConfig.CustomSkins)) {
        var i = {};
        Object.keys(MyListing.MapConfig.CustomSkins).forEach(function (e) {
          if (MyListing.MapConfig.CustomSkins[e])
            try {
              var t = JSON.parse(MyListing.MapConfig.CustomSkins[e]);
              t && "object" === n(t) && (i[e] = t);
            } catch (e) {}
        }),
          jQuery.extend(MyListing.Maps.skins, i);
      }
    })(),
    (MyListing.Geocoder = new MyListing.Maps.Geocoder()),
    (MyListing.Maps.init = function () {
      function e() {
        "undefined" != typeof google &&
          (jQuery(".c27-map:not(.delay-init)").each(function (e, t) {
            new MyListing.Maps.Map(t);
          }),
          jQuery("#c27-explore-listings .finder-map").length &&
            MyListing.Explore.setupMap(),
          (MyListing.Maps.loaded = !0),
          jQuery(document).trigger("maps:loaded"));
      }
      jQuery("#c27-single-listing").length
        ? jQuery(document).one("mylisting/single:tab-switched", e)
        : jQuery(e);
    }),
    MyListing.Maps.init();
});
