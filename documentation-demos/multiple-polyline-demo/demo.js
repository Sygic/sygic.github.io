window.onload = function () {
    var apiKey = getApiKey();

    var map = L.map("map");

    var route1 = "mnayHtia@IsCGYoFtC_@PKFkB`AYyBi@qBa@y@[m@q@yA_@y@YQ[BGToA~FYp@]l@{@dAaAfAaAp@[Vc@RoAh@OFy@\\sAp@QJaDnAeAh@YNUF]RCLSl@MKOK]UIEgAa@IC_@BaAKa@OuAaAoBmD]j@q@l@YL}@TcAHu@Bw@@_BYcAW]GSG{@IOEaBm@Y?a@^SVS@oAWMCYKo@}@qBcDk@iBIS_@WOw@q@kFEWe@yB[cBKc@G[YmAg@e@]YUQoBwA[WoA}@sA_Aa@]M{@AKCOW}A]sBEQi@aCCQe@_C]eBc@uBScAeF`BqA`@e@Pi@ReBp@aA^o@V_C|@MDs@XJwBFiBQuESuCU_@_@[IIG@Q@SY[q@]g@U_@m@u@IIaBwBw@eAKOYa@_AmA_AoBwAwCeDaGwCkFMa@uAgCqA{BIM]q@sAaCe@qD_@iB_@}BYqD[mDWoC?OIQAI@MJy@DMHg@UWo@y@s@}@OU{AeBmBqByD_C}AcAOIMIIE{AaA_Ao@aBiAo@c@q@c@eB|@aAh@SL]P]NSP_Al@kAr@g@d@Q{@AYA]AaAAwBHmDJkAASE]Oc@IO[UiAo@w@c@GEg@a@}@gCEMK_@q@yBGSMi@Sg@e@SIESIcBo@[K{AeAWSMAe@TWn@AjBAz@@lBAd@";

    var route2 = "mnayHtia@IsCGYUgAo@iCUw@Ka@k@{BOm@IWWgA[kAc@}AuAqFWmASoAKkAm@yGCoA?iEAe@GcBE_BAkBKoEEy@EgAA[Ac@AQCMAe@AUA_@AWDUAa@SeEC{@QeEAeD@y@?c@?w@@y@?wAAOAe@@k@BW@uBBsD@}FBwC?cDCgEEkECqB?o@?eC@mE@qBDwEDyGAqCFeEBqB?Q@eB@iB?y@@K@aBByA@aAOYQ[AUMQMSc@y@OGq@eAOWDWLa@`BcCjBsC\\i@^m@l@_ArA_D^cANUFKPWRs@FMPeAEc@i@_EC]CuCEwA?MGsBMwD?U?eF?sADeFFiBNuDFsDQgDU}DUaEGiA_@oCSsASuACOWcB[gBk@oCEWy@wEEQQoA}Bu@yAi@}@Y]MWQOEm@SUKQGWIIC]MYI_@OSGuAg@MEKEKCKCCn@Qt@O`@KTSb@oA`DKb@Ot@HBnAU`@S";

    var bounds = new L.LatLngBounds();

    function createLayer(polylineString, color) {
        var polyline = L.Polyline.fromEncoded(polylineString, {
            color: color,
            weight: 3,
            smoothFactor: 1
        });

        var coords = polyline.getLatLngs();

        var startMarker = L.marker(coords[0], { title: "Start" });
        var endMarker = L.marker(coords[coords.length - 1], { title: "End" });

        bounds.extend(polyline.getBounds());
        var group = L.layerGroup([polyline, startMarker, endMarker]);
        return group;
    }

    var driver1layer = createLayer(route1, "blue");
    var driver2layer = createLayer(route2, "red");

    var overlayMaps = {
        "Driver 1": driver1layer,
        "Driver 2": driver2layer
    };

    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer, driver1layer, driver2layer]).addTo(map);

    map.fitBounds(bounds);
}

