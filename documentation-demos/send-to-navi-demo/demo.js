window.onload = function () {
    var mapApiKey = getApiKey();

    var map = L.map("map");

    var encodedPolylineString = "u`{dHqjlgBARJjB{@Jy@F_BJg@VEJ?dCaAnDbAt@tA\\bC`@X}EV_EFq@b@CL?V?H?d@?n@LPVXr@n@|AfCjFDH\\\\FFV\\\\b@h@b@VNPHd@T~AVvABN?xHo@~Ci@z@KPA`@Af@Af@AdBM|ACJAd@CT?\\CV@T?T?xEAlGKp@A\\A`AAxDGpEIbACtFIdACR?RA^?\\?n@AXAXAnAC\\NTTRh@A~AWXcB~B[@a@UK]I_A@_ADqD@aA@YN}M@q@?O@YR{LFwDDuD?c@L}IHmGDoD@u@@WHeHD_EFqDHsFPmKHwCVqRF{DBkCBsC@cA@KA{DGsBWiEc@kDw@eEOk@IWy@aCy@kBgAqBKUa@}@aDmFGIKOkEqG_E}FoBuCsAqBy@kAg@s@cG{I[e@Yc@c@m@kAeBeDyE_C_EsAcDcAeDkAqG[yCYyGQk[CeC?sAGeOEiJEmKGkQAeAIuLY{Hg@sF[uB_BsHeAgD{AqDo@mAcD{EiCkCiDcCaBw@m@WcD{@}De@oAKaAKGAgJs@iBMgE[{AMm@EkDWwXwBwCW}@K]EmAMwC]aG{@IAWEaAQyHyAuG_Bu@Q_EgA{KoDmHoCiHcDyF}CqEqCgI}FeK}I{@{@mF{FEEOOuHgJoCuDcF_Ia@q@kD{FmDyGkDqHKUsIsSkEeL[w@yAwD}@}BeHaRqGsPqImTKUWk@eAkCm@yAc@aAaB{Dk@sAwF}LqFgLoOgZuG}M{D}ImCmGuG}PaGgQ}CeKqDoMqIs^cFcXiEaYgBmNcAmJiAoLm@{GiB{Xi@wKgAm\\g@{c@?uc@`Ao{A?m_@c@}[o@uQy@}NyAeQ_A{IsB}OaDqR_DkO_GkUqAiEgEkMkEgLaIwQeCeF}JqReVec@Q[{KoSmA}Bi@aAoH_OaAsBqIkRsBcFqAcD{@}BsDeKcEoMoEcPsHa\\_A_F{CgQkCiRa@eDmAoK[_DkAiNeBkWcAaSsCko@c@}IM{Bm@qJsAmQeAaLeBmOiBwM{BeNkCsN_CwKoFkTuAaFoEuNkFgO}ImTmKkTwJuPcJ}MsGuIiIuJoJkKo]w^uCeDqFqGoBaCeB}BKMwBoCiJiMsAoB}MqSwGwK{LwTuHgOaKwT{Ma\\_F{M_GwPcGkRsDcMcFeRiDcNeIq^iHw_@oDuTwEu\\gC_TaB_PoHyx@iCwVaFcc@_@sCqDwYc@oCy@wGoD{U{G{`@{D{TiL{k@kF_VwJ_b@wN_j@aHcV}Okg@K[wLs]]aAsAwD{ImUUm@q@mBkKoWoKuVgIcQu@_BkAeCeEwIMUSa@iA_CwAoC{CgGeAsBsB{DwAuCMu@Wo@UwA@uATs@X_@`@WTCh@Hb@^Zn@LfAEz@Qx@W`@w@j@Y`@QFGBc@Pe@P_@NuFxBmD`BuCxAsBjAk@^iDzByFhE{GhGiDlDyF|GmBpCaClD}C|E{CvF{ChGeEpJmKnXiFrKeAhBwBhD_ApAs@`AyDtEqBrBq@n@s@p@WT}@t@aDdCYP{BvA}A|@aAf@o@Z]PSLuAv@_@Pk@ZsAv@mC~AmAt@sCdBmDvBu@p@kAtAi@v@eAvBKXWp@s@rBu@hAQAWNmAe@qAc@_A_@mBQq@NaCdAWR{AbB_@d@u@rA}@`Bi@~@u@z@eBx@{ARQ?_@B]Da@D{AH]BM@m@FcBNiHfAoKzB_B`@QDUFu@RkRnIq@TBXJdADj@DZBZP~A`@jDf@~FV`D";

    var polyline = L.Polyline.fromEncoded(encodedPolylineString, {
        color: 'blue',
        weight: 3,
        smoothFactor: 1
    });

    var coords = polyline.getLatLngs();

    var startMarker = L.marker(coords[0], { title: "Start" });
    var endMarker = L.marker(coords[coords.length - 1], { title: "End" });

    var sygicTileLayer = L.TileLayer.sygic(mapApiKey);
    L.layerGroup([sygicTileLayer, polyline, startMarker, endMarker]).addTo(map);

    var bounds = new L.LatLngBounds(coords);
    map.fitBounds(bounds);

    L.easyButton('fa-send-o',
        run,
        'Send route to navigation'
    ).addTo(map);
}

function run() {
    var apiKey = prompt("Please enter ApiKey");

    if (apiKey) {
        var sendToNaviUrl = "https://directions.api.sygic.com/v0/api/sendtonavi?key=" + apiKey;

        var tag = prompt("Please enter tag for example");
        if (tag) {

            var sendToNaviApiInput = {
                message: "This route was send from demo.",
                name: "Demo route",
                tags: tag,
                directions_api_parameters: {
                    origin: "48.148540,17.107752",
                    destination: "48.382242,17.586862"
                },
                directions_api_result: {
                    route: "u`\{dHqjlgBARJjB{@Jy@F_BJg@VEJ?dCaAnDbAt@tA\\bC`@X}EV_EFq@b@CL?V?H?d@?n@LPVXr@n@|AfCjFDH\\\\FFV\\\\b@h@b@h@X`A^bALvABN?xHo@zEu@PA`@Af@Af@A|@Gf@E|ACJAd@CT?\\CV@T?T?xEA|IO`AAxDGpEIbACtFIdACR?RA^?\\?n@AXAXAnAC\\NTTRh@A~AWXcB~B[@a@UK]I_A@_ADqD@aA@YN}M@q@?O@YR\{LFwDDuD?c@L}IHmGDoD@u@@WHeHD_EFqDHsFPmKHwCVqRF\{DBkCBsC@cA@KA{DGsBWiEc@kDw@eEOk@IWy@aCy@kBgAqBKUa@}@aDmFGIKOkEqG_E}FoBuCsAqBy@kAg@s@cG\{I[e@Yc@c@m@kAeBeDyE_C_EsAcDcAeDkAqG[yCYyGQk[CeC?sAGeOEiJEmKIqSIuLY{Hg@sF[uB_BsHeAgD{AqDo@mAcD{EiCkCiDcCaBw@m@WcD{@}De@oAKaAKGAgJs@iBMgE[\{AMm@EkDWwXwBwCW}@K]EmAMwC]KAuFy@a@G\{JkBuG_Bu@Q_EgA{KoDmHoCiHcDyF}CqEqCgI}FeK}I\{@{@mF{FEEOOuHgJoCuDcF_Ia@q@kD{FmDyGkDqHKUsIsSkEeL[w@yAwD}@}BeHaRqGsPqImTKUWk@eAkCm@yAc@aAaB\{Dk@sAwF}LqFgLoOgZuG}M\{D}ImCmGuG}PaGgQ}CeKqDoMqIs^cFcXiEaYgBmNm@oFU}BiAoLm@\{GiB{Xi@wKgAm\\g@{c@?uc@`Ao{A?m_@c@}[o@uQy@}NyAeQ_A\{IsB}OaDqR_DkO_GkUqAiEgEkMkEgLaIwQeCeF}JqReVec@Q[\{KoSmA}Bi@aAoH_OaAsBqIkRsBcFqAcD\{@}BsDeKcEoMoEcPsHa\\_A_F\{CgQkCiRa@eDmAoK[_DkAiNiBkXe@}ImDow@oAuU}@oM\{BkVuAwLiBwM{BeNkCsN_CwKoFkTuAaFoEuNkFgO}ImTmKkTwJuPcJ}MsGuIiIuJoJkKo]w^uCeDqFqGuE_GKMwBoCiJiMsAoB}MqSwGwK\{LwTuHgOaKwT{Ma\\_F{M_GwPcGkRsDcMcFeRiDcNeIq^iHw_@oDuTwEu\\gC_TaB_PoHyx@iCwVaFcc@_@sCqDwYc@oCy@wGoD{U{G{`@{D{TiL{k@kF_VwJ_b@wN_j@aHcV}Okg@K[wLs]]aAsAwD\{ImUUm@q@mBkKoWoKuVgIcQu@_BkAeCeEwIMUSa@iA_CwAoC{CgGeAsBsB{DwAuCMu@Wo@UwA@uATs@X_@`@WTCh@Hb@^Zn@LfAEz@Qx@W`@w@j@Y`@QFGBc@Pe@P_@NuFxBmD`BuCxAsBjAk@^iDzByFhE{GhGiDlDyF|GmBpCaClD}C|E\{CvF{ChGeEpJmKnXiFrKeAhBwBhD_ApAs@`AyDtEqBrBq@n@s@p@WT}@t@aDdCYP\{BvA}A|@aAf@o@Z]PSLuAv@_@Pk@ZsAv@mC~AmAt@sCdBmDvBu@p@kAtAi@v@eAvBKXWp@s@rBu@hAQAWNmAe@qAc@_A_@mBQq@NaCdAWR\{AbB_@d@u@rA}@`Bi@~@u@z@eBx@{ARQ?_@B]Da@D{AH]BM@m@FcBNiHfAoKzB_B`@QDUFu@RkRnIq@TBXJdADj@DZBZP~A`@jDf@~FV`D",
                    eta: 1520251289,
                    duration: {
                        value: 2512,
                        text: "0 hours 41 minutes 52 seconds"
                    },
                    distance: {
                        value: 58008,
                        text: "58.01 km"
                    },
                    legs: [
                        {
                            distance: {
                                value: 58008,
                                text: "58.01 km"
                            },
                            duration: {
                                value: 2512,
                                text: "0 hours 41 minutes 52 seconds"
                            },
                            start_location: {
                                latitude: 48.14875,
                                longitude: 17.10777
                            },
                            end_location: {
                                latitude: 48.38213,
                                longitude: 17.58687
                            },
                            route: "u`\{dHqjlgBARJjB{@Jy@F_BJg@VEJ?dCaAnDbAt@tA\\bC`@X}EV_EFq@b@CL?V?H?d@?n@LPVXr@n@|AfCjFDH\\\\FFV\\\\b@h@b@h@X`A^bALvABN?xHo@zEu@PA`@Af@Af@A|@Gf@E|ACJAd@CT?\\CV@T?T?xEA|IO`AAxDGpEIbACtFIdACR?RA^?\\?n@AXAXAnAC\\NTTRh@A~AWXcB~B[@a@UK]I_A@_ADqD@aA@YN}M@q@?O@YR\{LFwDDuD?c@L}IHmGDoD@u@@WHeHD_EFqDHsFPmKHwCVqRF\{DBkCBsC@cA@KA{DGsBWiEc@kDw@eEOk@IWy@aCy@kBgAqBKUa@}@aDmFGIKOkEqG_E}FoBuCsAqBy@kAg@s@cG\{I[e@Yc@c@m@kAeBeDyE_C_EsAcDcAeDkAqG[yCYyGQk[CeC?sAGeOEiJEmKIqSIuLY{Hg@sF[uB_BsHeAgD{AqDo@mAcD{EiCkCiDcCaBw@m@WcD{@}De@oAKaAKGAgJs@iBMgE[\{AMm@EkDWwXwBwCW}@K]EmAMwC]KAuFy@a@G\{JkBuG_Bu@Q_EgA{KoDmHoCiHcDyF}CqEqCgI}FeK}I\{@{@mF{FEEOOuHgJoCuDcF_Ia@q@kD{FmDyGkDqHKUsIsSkEeL[w@yAwD}@}BeHaRqGsPqImTKUWk@eAkCm@yAc@aAaB\{Dk@sAwF}LqFgLoOgZuG}M\{D}ImCmGuG}PaGgQ}CeKqDoMqIs^cFcXiEaYgBmNm@oFU}BiAoLm@\{GiB{Xi@wKgAm\\g@{c@?uc@`Ao{A?m_@c@}[o@uQy@}NyAeQ_A\{IsB}OaDqR_DkO_GkUqAiEgEkMkEgLaIwQeCeF}JqReVec@Q[\{KoSmA}Bi@aAoH_OaAsBqIkRsBcFqAcD\{@}BsDeKcEoMoEcPsHa\\_A_F\{CgQkCiRa@eDmAoK[_DkAiNiBkXe@}ImDow@oAuU}@oM\{BkVuAwLiBwM{BeNkCsN_CwKoFkTuAaFoEuNkFgO}ImTmKkTwJuPcJ}MsGuIiIuJoJkKo]w^uCeDqFqGuE_GKMwBoCiJiMsAoB}MqSwGwK\{LwTuHgOaKwT{Ma\\_F{M_GwPcGkRsDcMcFeRiDcNeIq^iHw_@oDuTwEu\\gC_TaB_PoHyx@iCwVaFcc@_@sCqDwYc@oCy@wGoD{U{G{`@{D{TiL{k@kF_VwJ_b@wN_j@aHcV}Okg@K[wLs]]aAsAwD\{ImUUm@q@mBkKoWoKuVgIcQu@_BkAeCeEwIMUSa@iA_CwAoC{CgGeAsBsB{DwAuCMu@Wo@UwA@uATs@X_@`@WTCh@Hb@^Zn@LfAEz@Qx@W`@w@j@Y`@QFGBc@Pe@P_@NuFxBmD`BuCxAsBjAk@^iDzByFhE{GhGiDlDyF|GmBpCaClD}C|E\{CvF{ChGeEpJmKnXiFrKeAhBwBhD_ApAs@`AyDtEqBrBq@n@s@p@WT}@t@aDdCYP\{BvA}A|@aAf@o@Z]PSLuAv@_@Pk@ZsAv@mC~AmAt@sCdBmDvBu@p@kAtAi@v@eAvBKXWp@s@rBu@hAQAWNmAe@qAc@_A_@mBQq@NaCdAWR\{AbB_@d@u@rA}@`Bi@~@u@z@eBx@{ARQ?_@B]Da@D{AH]BM@m@FcBNiHfAoKzB_B`@QDUFu@RkRnIq@TBXJdADj@DZBZP~A`@jDf@~FV`D"
                        }
                    ]
                }
            }
            send(sendToNaviApiInput);
        }
    }

    // post request for send to navigation
    function send(data) {
        $.ajax({
            type: 'POST',
            url: sendToNaviUrl,
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
        }).done(function (data, textStatus, xhr) {
            // get result of send route to navi
            alert("Status: " + textStatus)
        }).fail(function (data, textStatus, xhr) {
            alert("FAILED!\r\n" + JSON.stringify(data, null, 2));
        });
    }
}