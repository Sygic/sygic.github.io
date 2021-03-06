window.onload = function () {
    var apiKey = getApiKey();

    var map = L.map("map");

    var originalPolylineString = "_wpoGmalaAnAo@S}@uBbAw@EYh@`@vAt@hCjC|IVx@lA|Dn@xB|AzEUNi@gBmBzAcIzFV`@vArBd@d@dAj@p@p@nDpFw@|AKp@HhEK~@cBdCYlAu@c@p@qBh@_Ah@a@x@[`BI\\Dd@^`@r@PfAEjAQ|@W~@_@xASr@u@dCENa@~AK|@C~AGrA]bCsB`Ey@`@}C`BaAf@cB|@c@RuItEoCdBmBxAKHsEhEiFnGuAnBiEzHEHOZ_BrDi@tAcClHyBrIc@dBe@nBk@xB[hAyG`YcGjVsA|FeBlH}Hn[{@lDoT||@uNfl@mBvH_Kpa@oOfn@sk@z_Cia@vaBsSpz@mIf]oC`Lgg@hsB}DpPm@rCwAfHaCnN_Gre@yKv}@In@wSfdBue@|{Di@rEkApJsF`d@qAzKgBpNeGhg@c@nDEZaAxHwBtOMZENKXu@|Bw@fCc@fBIxBFb@Xp@XZPJt@Hh@Qv@cAb@_Aj@w@j@U`AQTMjAObAQv@Od@IXGXGhBi@h@SNG^QZEnAm@|@@r@\\d@fAPr@VjApBbLdAfLh@`GJbBC`@Mj@?t@Xx@TR`@F\\KNOXs@t@E~@Gd@FfCSp@Q`EuAt@Aj@XdAlBRd@Tb@\\f@`@h@n@j@l@`@t@d@jCdBlFlDdFjD~DbCh@\\tB|@pA\\r@t@DZFJ`@JXQJm@r@sAr@q@t@{@FJN?LSd@An@IbCMjBIzCKtBb@v@PvDfA|Ad@rC|@|CfAnAh@jGdCnB`@d@@p@ElFy@v@OrF_AdGmA|Cm@tBc@r@OpAWhB_@fAU\\GxCm@pD_AT@z@Tr@\\b@b@ZRHd@XHNGJg@Oa@?o@Dk@Ha@ZgBTyAX[p@K`B?vDo@t@Oj@KrA[fDo@`ASrBk@fAs@z@eA|@cBP@FGf@f@`CdCt@v@t@t@fAhAdAw@~@Yd@m@n@KlDDt@KbJsDtDkB^Sl@c@tA{AGm@z@Y";

    var polyline = L.Polyline.fromEncoded(originalPolylineString, {
        color: 'blue',
        weight: 3,
        smoothFactor: 1
    });


    var unescapedPolylineString = "_wpoGmalaAnAo@S}@uBbAw@EYh@`@vAt@hCjC|IVx@lA|Dn@xB|AzEUNi@gBmBzAcIzFV`@vArBd@d@dAj@p@p@nDpFw@|AKp@HhEK~@cBdCYlAu@c@p@qBh@_Ah@a@x@[`BI\Dd@^`@r@PfAEjAQ|@W~@_@xASr@u@dCENa@~AK|@C~AGrA]bCsB`Ey@`@}C`BaAf@cB|@c@RuItEoCdBmBxAKHsEhEiFnGuAnBiEzHEHOZ_BrDi@tAcClHyBrIc@dBe@nBk@xB[hAyG`YcGjVsA|FeBlH}Hn[{@lDoT||@uNfl@mBvH_Kpa@oOfn@sk@z_Cia@vaBsSpz@mIf]oC`Lgg@hsB}DpPm@rCwAfHaCnN_Gre@yKv}@In@wSfdBue@|{Di@rEkApJsF`d@qAzKgBpNeGhg@c@nDEZaAxHwBtOMZENKXu@|Bw@fCc@fBIxBFb@Xp@XZPJt@Hh@Qv@cAb@_Aj@w@j@U`AQTMjAObAQv@Od@IXGXGhBi@h@SNG^QZEnAm@|@@r@\d@fAPr@VjApBbLdAfLh@`GJbBC`@Mj@?t@Xx@TR`@F\KNOXs@t@E~@Gd@FfCSp@Q`EuAt@Aj@XdAlBRd@Tb@\f@`@h@n@j@l@`@t@d@jCdBlFlDdFjD~DbCh@\tB|@pA\r@t@DZFJ`@JXQJm@r@sAr@q@t@{@FJN?LSd@An@IbCMjBIzCKtBb@v@PvDfA|Ad@rC|@|CfAnAh@jGdCnB`@d@@p@ElFy@v@OrF_AdGmA|Cm@tBc@r@OpAWhB_@fAU\GxCm@pD_AT@z@Tr@\b@b@ZRHd@XHNGJg@Oa@?o@Dk@Ha@ZgBTyAX[p@K`B?vDo@t@Oj@KrA[fDo@`ASrBk@fAs@z@eA|@cBP@FGf@f@`CdCt@v@t@t@fAhAdAw@~@Yd@m@n@KlDDt@KbJsDtDkB^Sl@c@tA{AGm@z@Y";
    var unescapedPolyline = L.Polyline.fromEncoded(unescapedPolylineString, {
        color: 'red',
        weight: 3,
        smoothFactor: 1
    });

    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer, polyline, unescapedPolyline]).addTo(map);

    var bounds = new L.LatLngBounds(polyline.getLatLngs());
    bounds.extend(unescapedPolyline.getLatLngs());
    map.fitBounds(bounds);
}