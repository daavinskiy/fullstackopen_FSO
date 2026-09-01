# 0.6: New note in SPA

```mermaid
sequenceDiagram
    participant Selain
    participant Palvelin

    Note right of Selain: Käyttäjä kirjoittaa muistiinpanon ja painaa "Save"

    Note right of Selain: JavaScript käsittelee lomakkeen
    Note right of Selain: Uusi muistiinpano lisätään sivulle

    Selain->>Palvelin: POST /exampleapp/new_note_spa
    Note right of Palvelin: Palvelin tallentaa muistiinpanon

    Palvelin-->>Selain: 201 Created

    Note right of Selain: Sivu ei lataudu uudelleen
```
