window.onload = function () {
    var apiKey = getApiKey();

    //initialization of sygic maps
    var map = L.map("map");
    map.setView([48.146864, 17.105868], 13);
    var sygicTileLayer = L.TileLayer.sygic(apiKey);
    L.layerGroup([sygicTileLayer]).addTo(map);

    var exampleInput = {
        path: "ii|uHkjni@kBZ]?_@Aa@c@RsBTaE@s@@QAw@?W?}@AO]@kDFYC}@GKA[CSCe@EwEy@mD{@_@KoDkAeBu@sCyAuD{B{@i@sByAwAgAi@e@SSq@g@s@m@iFiFmBcC{BoCi@s@sC{Ds@eASYMVUb@iA~AkDdEa@`@SRu@z@kAvAo@d@g@HWG_@[_@gAC}CF{@f@wClAaE^wAx@gBxDuHpEeIxFcKzBcEBG`HgMxEwIf@y@`@m@hB_CvGkGl@m@X[NQLOvBcDf@iAt@kCl@iBBMDQBMTmALkAN}AN_CA}FEiAAYKoBe@iEGa@_AiGe@_Do@iG_@{HQmGQqFC{@A]EcBEcBWwIYqJQiDy@iRGiAKuCYmOy@eO{@gIYeDWaBcA}F]gBaAyFq@}DuA_Hi@_De@oCq@{DEQCSCSMkA]_D]kD{@uJaAcLu@_JOsBKmAGm@c@eF?MEc@{@}Kc@kMAoGPqJHcBHmAj@sH^wETsC`@}E`@oFFi@^wE`AuLViDLaBDa@Bg@D_@@M\\aERkB~@gMt@iJt@{Iv@yJh@aJp@eQFaII_OK{Fe@oL{AsNaBcLg@mE_@eFScH?kEHeDNgEz@qJ`AkGvA_GrAiEx@sBxDiIx@sBpAoDxAmFzB_Mv@iIT_ELwD?s@@S?yJ]uMs@uLk@oG{@mHmA_IYeBkB{JiGeXY}Ae@}Cw@gH[wEA[EkAA]GqAKyEC}PHuQ?_ALeZAaLK_GWyGs@}Jg@uEqAcJuBoKuHoZeCcMqAsJ{@oK]_HYoKA{@]eNc@}I_@eFuCoX_@cDE]y@}Ii@wIYyJCiEPcOZaHv@_K|AqLbAcFlAsElBqFdCoFdGgL|CmG`BaEvAyEPq@dBwIn@uEj@iHN_Ct@{VF{BRyFJcDBa@JiBDg@|@aKBOPoAD[ZkB|@gEz@_D@Kt@aCTe@nBiFDKBIhC}FlD{HhBmEjBiF`BwFfAcF\\iBfAkIZaDLqBNeBPeGB}HW{Jo@eJaB_NqAsHsDyPcHeY{D{OmD_Pa@sB{AkIkB}LiAqIsBoSg@qHa@eM@}Ib@eLnAeLl@gDvAcGhByFbGqNpAqDbAgDtAeGv@}Eh@sEZkE`@gMO{M{@}QQwJL}Id@uINaB^}Dv@gJHcB@UHcCFqGQwJAQAOUkEMsAe@kEWoB_@qBg@iCkBiH_AmCkCcGkCoEqCoD{A{AuAsAwCsBuEqBwGeBgE{AuAo@eDqBoDsC{E{EuCeDyAcBiImKiL}P{C}FsA{CeCoHeCsKYsA}B_Q_A}Jg@oH[sIO_K?_ENwK|@oPF}@Do@x@sPHoLOsHk@qIsA_KW}A{@gEyA_GeCoHyBoFwEaJgC}DyBsCaBoBqGaG{EiEwFuEeCwBcC{ByByB}C{D}BwD{B{E{AgE_DoL}@yEgBaLkB_Qw@yLe@oNG{G@eMf@oQb@{Hx@iKf@kE`B{KbEyWfBqPf@wLBgCCaIYoJs@uJqBuOiEqW[qBeA}Hs@{H]iIEwHFsFv@yLf@gEtA_I~AqGrCmIvBcFL]d@oA`CyGhAuDlCiLpB_M~Dqb@rA{JlD_S`AeGRqAv@uFbAiKJmAD{@JyA^yK@a@DsC@qJAuC[}La@_Hg@uFu@_HyAeMoAuM{@aO[sMKiQG_IUeKw@eOOsCGaBWsMDsLReHh@{I`@oExCcUpDwVbBqOz@gMLsCNqF@aI?O?[Au@?Mg@yNe@uHm@qOGeGBqHR{FtAoQpGci@D]fAaOZqIH}IIyKKsCW}FWkD[yDs@gGmG}`@oB}OkAiPe@{LY}[GuEk@uO}AsRUcCcCmYI{@kAoNeByYmAe]EgAk@}Qe@cLWyDcAaNmCqW}@eGgDgRiC}NqAkJy@iJ]yHGoD?eINuGl@cK`AwI~@uFP{@hBoH`@wAhAeDFQd@oA|CqG`C}DbFoGLMnAsAlH}G`ImHfFqGfBcCtDgGRa@R]rBcEzDkJlCeI~AyFlAkFrCsOnA_Kn@{Gd@cGr@qNNaEZ}RL_T@qPCoSWq\\AaAIwFIkEWwMy@q[]yNCiBOyKM_Z@qZKaJOkEo@oJkA_KcAyFgB}H}@gD_BgF}C_IaG_NcC_GgAkCkBiFkDoL_CiLy@qGu@iJ]qKCeSr@gc@NeTEkHQuIc@}JgA_NcA{IsCoPwAsGsBwHyCgJwQ{d@iB_FyCuJgDuNoCeP{AkM}AiPk@}HgAwTY_JUmS?sOPkMP}ETuEj@}HDk@lBmPtGca@|B}Ox@mIl@eKLiKM{HYgE_A}IK}@kAoG_AaE_BoFiA}CuB_FSw@mAcCkBuD}CsFyHkKwAkBa@g@c@u@o@oAQ_A?cAVgAR]`@Sf@?f@X\\z@Hz@Ex@Kd@a@l@oAl@c@NWTi@RkAb@gA\\{HtBeB`@gCv@iCv@eC^iBPcE`@uI\\mGIuCSyEk@_Ek@gAOeEc@aFMmDLoBVuBd@uC`AmB`A}DjCeInH_FjDq@^yCxAoC~@uFjAeHf@yADiFBeRYoF@_DHiFb@uDj@mEbAwG~ByFrCwA|@gFvD}EnEkBnBc@d@MNk@p@mEfG]d@c@b@wAtBi@l@}@h@w@C]YQYWsABkANq@t@qAjFmHrAkBNUx@Gv@n@nBpCPXHNfBdDFL`@x@N\\LZP`@fCzGFRnAnDh@bB~AjF~BrHj@rAhBvCEP?PNZN@PQjAt@dAZPDVB~@@r@IzBo@p@Qz@KhABbAZ\\TxAbBj@|AVjAPpB?V"
    };

    var createPolyline = function (line, color) {
        var polyline = L.Polyline.fromEncoded(line, {
            color: color,
            weight: 5,
            smoothFactor: 1
        });
        return polyline;
    }

    $.ajax({
        url: "https://directions.api.sygic.com/v1/api/matching?key=" + apiKey,
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(exampleInput)
    }).done(function (response) {
        var matchedRoute = createPolyline(response.route, "blue");

        map.addLayer(matchedRoute);
        var bounds = matchedRoute.getBounds();
        map.fitBounds(bounds);
    });
}