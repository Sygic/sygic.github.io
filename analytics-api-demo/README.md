# Sygic speed analytics demo

Simplistic demo web to demostrate new speeding analytics API of Sygic.
To view live example please navigate to https://mcsdodo.github.io/?key= [YOUR_API_KEY]

## Api call

Analytics API for testing purposes is available here: https://analyticstest.api.sygic.com/v0/api/speeding?key=YOUR_API_KEY
It supports POST http verb only.

### Request

```json
{
    "coordinates": ["48.15198,17.1923", "48.15218,17.19261", ...],
    "accuracies": [6, 6, ...],
    "speeds": [13, 23, ...],
}
```
* **coordinates** is array of recorded coordinates from gps track
* **accuracies** is array of horizontal gps accuracies of **coordinates**
* **speeds** is array of recorded speeds

Only the **coordinates** array is required for the request. If provided, **accuracies** and **speeds** array lengths have to match **coordinates** array length.

### Response

```json
{
  "route": "ep{dHou|gBy@u@cBiCeBcD[_@??cAqA??}D_E??kAaA??sBpD??_A~A??KT??gAtB??eDjG??cHlM??]l@??eFdJk@pB??G^??}@jK??AzG??AxC??@b@??JbG??Bx@Gt@??wAdD??mAlC??s@bB??oBpE??eCvH??mA`D??uChI??[x@??_ElL??u@dCUlAO|B???zK??Uv[??ClB??iBM??yAA??yAA??{AA??kDG??oC?Qc@Pb@]w@JRgAeCz@pB_DiHbBvDmD_IhAfCuDiIjB`EgCuFZr@c@eAFPo@{Af@hAoA{Cf@pAkAeDb@rAiB}EdAhCuCuGnAjCiB{DXn@qALv@}@mBxBt@{@kB~Bt@cAiBvBr@s@iB|Bt@iAqBlCz@cAoBvBr@s@qCuC|AhE",
  "speeding_segments": [
    {
      "max_speed": 50,
      "speeding": 1,
      "route": "ep{dHou|gBy@u@cBiCeBcD[_@??cAqA??}D_E??kAaA??sBpD??_A~A??KT"
    },
    {
      "max_speed": 50,
      "speeding": 1.2,
      "route": "si|dH_c}gBgAtB??eDjG??cHlM??]l@??eFdJk@pB??G^??}@jK"
    },

    ...
    
  ],
  "status": "OK",
  "copyright": "© 2018 Sygic a.s."
}
```

* **route** is polyline matched to map according to provided GPS track in request. It's a continuous representation of assumed route taken.
* **speeding_segments** is collection of segments where we could match "speeds" to concrete segments on assumed route taken.
	* **max_speed** is general speed limit on current segment
	* **speeding** is speeding of vehicle relative to **max_speed**
	* **route** is geometry of matched segment