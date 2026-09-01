# 0.5: SPA

```mermaid
sequenceDiagram
    participant Selain
    participant Palvelin

    Selain->>Palvelin: GET /exampleapp/spa
    Palvelin-->>Selain: HTML-sivu

    Selain->>Palvelin: GET /exampleapp/main.css
    Palvelin-->>Selain: CSS-tiedosto

    Selain->>Palvelin: GET /exampleapp/spa.js
    Palvelin-->>Selain: JavaScript-tiedosto

    Note right of Selain: JavaScript suoritetaan selaimessa

    Selain->>Palvelin: GET /exampleapp/data.json
    Palvelin-->>Selain: Muistiinpanot JSON-muodossa

    Note right of Selain: JavaScript näyttää muistiinpanot sivulla
