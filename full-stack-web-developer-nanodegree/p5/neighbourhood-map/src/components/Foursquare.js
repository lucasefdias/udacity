import GoogleMapsAPI from './googleMapsConfig.js'

// --------------------------------------------
// Foursquare API
// --------------------------------------------
class Foursquare {

  constructor() {
    this.credentials = {
        client_id: "AORGIPFRDB40EEAD0P2RPHOZDIDCMABI3A4WJLLWCQWAVMNW",
        client_secret: "LXDPAK1VCGSFLT2NA1N54AJFNPIFCB3XMXM2ZEBUXDJNLI53"
    };

    // ------------------------------------------
    //
    // FOR TESTING PURPOSES ONLY
    //
    // If Foursquare API quota has exceeded
    // (return status 429), use this in App.js
    // getVenues function when fecthing venues
    //
    // ------------------------------------------
    this.fullVenues = [
        {
            id: "49b7ed6df964a52030531fe3",
            name: "Times Square",
            location: {
                address: "Broadway & 7th Ave",
                crossStreet: "btwn 42nd & 47th St",
                lat: 40.757935054802104,
                lng: -73.9862082207571,
                formattedAddress: [
                    "Broadway & 7th Ave (btwn 42nd & 47th St)",
                    "New York, NY 10036",
                    "United States"
                ]
            },
            canonicalUrl: "https://foursquare.com/v/times-square/49b7ed6df964a52030531fe3",
            url: "http://timessquarenyc.org/index.aspx",
            bestPhoto: {
                id: "525c7abc11d22e7fcc08bc83",
                prefix: "https://fastly.4sqi.net/img/general/",
                suffix: "/476_OEblz_W09ZL0-IhXSyp3MNFoO1Toq_I0NjIX2YRzSGE.jpg",
                width: 640,
                height: 640,
                visibility: "public"
            }
        },
        {
            id:"4b135e9bf964a520ad9623e3",
            name: "Madame Tussauds",
            location: {
                address: "234 W 42nd St",
                lat: 40.756432,
                lng: -73.988828,
                formattedAddress: [
                    "234 W 42nd St (btwn 7th & 8th Ave.)",
                    "New York, NY 10036",
                    "United States"
                ]
            },
            canonicalUrl: "https://foursquare.com/v/madame-tussauds/4b135e9bf964a520ad9623e3",
            url: "http://www.madametussauds.com/NewYork",
            description: "Mingle with over 200 wax celebrities in 85,000 sq ft of interactive entertainment located in Times Square!",
            bestPhoto: {
                id: "50dc6610e4b0b8da13b511c5",
                prefix: "https://fastly.4sqi.net/img/general/",
                suffix: "/40551984_9nTy6_RWB5NM9wyjspp1wRaMmLMcwdfyF4xprVLMiJE.jpg",
                width: 720,
                height: 960,
                visibility: "public"
            }
        },
        {
            id: "42829c80f964a5206a221fe3",
            name: "Grand Central Terminal",
            location: {
                address: "87 E 42nd St",
                lat: 40.75272511851483,
                lng: -73.97736414087431,
                formattedAddress: [
                    "87 E 42nd St (btwn Vanderbilt & Park Ave)",
                    "New York, NY 10017",
                    "United States"
                ]
            },
            canonicalUrl: "https://foursquare.com/v/grand-central-terminal/42829c80f964a5206a221fe3",
            url: "https://www.grandcentralterminal.com",
            bestPhoto: {
                id: "51006d8be4b014ee565396a5",
                prefix: "https://fastly.4sqi.net/img/general/",
                suffix: "/708901_Wp8kf7WMP78cuRIsFtB7ma5FyrdNTAh27sFup40TI54.jpg",
                width: 612,
                height: 612,
                visibility: "public"
            }
        },
        {
            id: "43a48f1bf964a520502c1fe3",
            name: "Top of the Rock Observation Deck",
            location: {
                address: "30 Rockefeller Plz",
                lat: 40.759095065214055,
                lng: -73.97935153748539,
                formattedAddress: [
                    "30 Rockefeller Plz (btwn 5th & 6th Ave)",
                    "New York, NY 10112",
                    "United States"
                ]
            },
            canonicalUrl: "https://foursquare.com/v/top-of-the-rock-observation-deck/43a48f1bf964a520502c1fe3",
            url: "http://www.topoftherocknyc.com",
            bestPhoto: {
                id: "51b74b82498e4ebc45d84fde",
                prefix: "https://fastly.4sqi.net/img/general/",
                suffix: "/113687_9XVInqqhDNjT9X1Zpyk5xk-Vnri1C4f_xfUSgm69zNE.jpg",
                width: 612,
                height: 612,
                visibility: "public"
            }
        },
        {
            id: "43695300f964a5208c291fe3",
            name: "Empire State Building",
            location: {
                address: "350 5th Ave",
                lat: 40.7485995507123,
                lng: -73.98580648682452,
                formattedAddress: [
                    "350 5th Ave (btwn 33rd & 34th St)",
                    "New York, NY 10118",
                    "United States"
                ]
            },
            canonicalUrl: "https://foursquare.com/v/empire-state-building/43695300f964a5208c291fe3",
            url: "https://www.esbnyc.com",
            description: "Soaring 1,454 ft. (443 m.) above Manhattan, the Empire State Building is the region's #1 tourist attraction & the heart of New York City. Our 86th & 102nd floor Observatories offer the two highest viewing decks in NYC along with unobstructed 360-degree views. On a clear day, you can see five states!",
            bestPhoto: {
                id: "51b8f916498e6a8c16a329eb",
                prefix: "https://fastly.4sqi.net/img/general/",
                suffix: "/26739064_mUxQ4CGrobFqwpcAIoX6YoAdH0xCDT4YAxaU6y65PPI.jpg",
                width: 612,
                height: 612,
                visibility: "public"
            }
        }
    ];
  }

  buildUrl() {
      // Foursquare base API url
      const base_url = "https://api.foursquare.com/v2/venues/explore";
      // Foursquare API credentials
      const client_id = this.credentials.client_id;
      const client_secret = this.credentials.client_secret;
      const version = "&v=20190814"
      const referenceLocation = GoogleMapsAPI.center.lat + "," + GoogleMapsAPI.center.lng;
      const limit = "&limit=" + 10;

      // Build API endpoint
      const url = (
          base_url +
          "?client_id=" +
          client_id +
          "&client_secret=" +
          client_secret +
          version
          +
          "&ll=" +
          referenceLocation
          +
          limit
      );

      return url;
  }
}

let FoursquareAPI = new Foursquare();

export default FoursquareAPI;
