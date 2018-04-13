# Sygic maps demos

Full documentation available here: <http://www.sygic.com/developers/maps-api-services/introduction>. You can get your api key to be used in this examples here: <http://www.sygic.com/business/contact-sales>

To see demo of simple integration of google encoded polyline on Sygic maps use <https://sygic.github.io/simple-polyline-demo/?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/simple-polyline-demo>)

To see demo of sygic maps analytics API use <https://sygic.github.io/analytics-api-demo/?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/analytics-api-demo>)

To see demo of sygic maps directions API use <https://sygic.github.io/directions-api-demo/?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/directions-api-demo>)

To see interactive analytics API demo use <https://sygic.github.io/analytics-live-demo?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/analytics-live-demo>)

To see demo of sygic maps route matchin API use <https://sygic.github.io/route-matching-demo/?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/route-matching-demo>)

To see demo of simple optimization & routing visualization use-case visit <https://sygic.github.io/simple-optimization-demo/?key=> (code available here: <https://github.com/sygic/sygic.github.io/tree/master/simple-optimization-demo>)

#### About google encoded polyline:
TL;DR – google encoded polyline is not to be considered a string. If you want to copy-paste programmatically computed polyline to your code, make sure that you escape ‘\’ characters.

*Make sure to always escape the backslashes in encoded strings!* Not doing so will result in the backslash to be interpreted as an escape character, yielding either **wrong** polyline or a polyline **that can't be decoded**. This problem will not occur if the polylines are passed around programatically in memory. 

Polyline below is encoded from two coordinates "41.6076,-88.21549","41.60745,-88.21537" (as result of calling javascript used in examples like `L.PolylineUtil.encode([[41.6076, -88.21549], [41.60745,-88.21537]])` ):
```
on}|FxqlyO\W
```
it contains characters ['o', 'n', '}', '|', 'F', 'x', 'q', 'l', 'y', 'O', '\\', 'W'], therefore if used as string literal in code, it has to be declared as:
```
var polyline = "on}|FxqlyO\\W";
```

[This example](https://sygic.github.io/unescaped-polyline-demo/?key=) (code available here: <https://github.com/sygic/sygic.github.io/tree/master/unescaped-polyline-demo>) illustrates how different the polyline visualizatin might look like (see image below - the unescaped/incorrect polyline is in red).

Original route:
```
_wpoGmalaAnAo@S}@uBbAw@EYh@`@vAt@hCjC|IVx@lA|Dn@xB|AzEUNi@gBmBzAcIzFV`@vArBd@d@dAj@p@p@nDpFw@|AKp@HhEK~@cBdCYlAu@c@p@qBh@_Ah@a@x@[`BI\\Dd@^`@r@PfAEjAQ|@W~@_@xASr@u@dCENa@~AK|@C~AGrA]bCsB`Ey@`@}C`BaAf@cB|@c@RuItEoCdBmBxAKHsEhEiFnGuAnBiEzHEHOZ_BrDi@tAcClHyBrIc@dBe@nBk@xB[hAyG`YcGjVsA|FeBlH}Hn[{@lDoT||@uNfl@mBvH_Kpa@oOfn@sk@z_Cia@vaBsSpz@mIf]oC`Lgg@hsB}DpPm@rCwAfHaCnN_Gre@yKv}@In@wSfdBue@|{Di@rEkApJsF`d@qAzKgBpNeGhg@c@nDEZaAxHwBtOMZENKXu@|Bw@fCc@fBIxBFb@Xp@XZPJt@Hh@Qv@cAb@_Aj@w@j@U`AQTMjAObAQv@Od@IXGXGhBi@h@SNG^QZEnAm@|@@r@\\d@fAPr@VjApBbLdAfLh@`GJbBC`@Mj@?t@Xx@TR`@F\\KNOXs@t@E~@Gd@FfCSp@Q`EuAt@Aj@XdAlBRd@Tb@\\f@`@h@n@j@l@`@t@d@jCdBlFlDdFjD~DbCh@\\tB|@pA\\r@t@DZFJ`@JXQJm@r@sAr@q@t@{@FJN?LSd@An@IbCMjBIzCKtBb@v@PvDfA|Ad@rC|@|CfAnAh@jGdCnB`@d@@p@ElFy@v@OrF_AdGmA|Cm@tBc@r@OpAWhB_@fAU\\GxCm@pD_AT@z@Tr@\\b@b@ZRHd@XHNGJg@Oa@?o@Dk@Ha@ZgBTyAX[p@K`B?vDo@t@Oj@KrA[fDo@`ASrBk@fAs@z@eA|@cBP@FGf@f@`CdCt@v@t@t@fAhAdAw@~@Yd@m@n@KlDDt@KbJsDtDkB^Sl@c@tA{AGm@z@Y
```

Unescaped route:
```
_wpoGmalaAnAo@S}@uBbAw@EYh@`@vAt@hCjC|IVx@lA|Dn@xB|AzEUNi@gBmBzAcIzFV`@vArBd@d@dAj@p@p@nDpFw@|AKp@HhEK~@cBdCYlAu@c@p@qBh@_Ah@a@x@[`BI\Dd@^`@r@PfAEjAQ|@W~@_@xASr@u@dCENa@~AK|@C~AGrA]bCsB`Ey@`@}C`BaAf@cB|@c@RuItEoCdBmBxAKHsEhEiFnGuAnBiEzHEHOZ_BrDi@tAcClHyBrIc@dBe@nBk@xB[hAyG`YcGjVsA|FeBlH}Hn[{@lDoT||@uNfl@mBvH_Kpa@oOfn@sk@z_Cia@vaBsSpz@mIf]oC`Lgg@hsB}DpPm@rCwAfHaCnN_Gre@yKv}@In@wSfdBue@|{Di@rEkApJsF`d@qAzKgBpNeGhg@c@nDEZaAxHwBtOMZENKXu@|Bw@fCc@fBIxBFb@Xp@XZPJt@Hh@Qv@cAb@_Aj@w@j@U`AQTMjAObAQv@Od@IXGXGhBi@h@SNG^QZEnAm@|@@r@\d@fAPr@VjApBbLdAfLh@`GJbBC`@Mj@?t@Xx@TR`@F\KNOXs@t@E~@Gd@FfCSp@Q`EuAt@Aj@XdAlBRd@Tb@\f@`@h@n@j@l@`@t@d@jCdBlFlDdFjD~DbCh@\tB|@pA\r@t@DZFJ`@JXQJm@r@sAr@q@t@{@FJN?LSd@An@IbCMjBIzCKtBb@v@PvDfA|Ad@rC|@|CfAnAh@jGdCnB`@d@@p@ElFy@v@OrF_AdGmA|Cm@tBc@r@OpAWhB_@fAU\GxCm@pD_AT@z@Tr@\b@b@ZRHd@XHNGJg@Oa@?o@Dk@Ha@ZgBTyAX[p@K`B?vDo@t@Oj@KrA[fDo@`ASrBk@fAs@z@eA|@cBP@FGf@f@`CdCt@v@t@t@fAhAdAw@~@Yd@m@n@KlDDt@KbJsDtDkB^Sl@c@tA{AGm@z@Y
```

![visualization](https://github.com/sygic/sygic.github.io/blob/master/unescaped-polyline-demo/visualize.PNG "visualization")