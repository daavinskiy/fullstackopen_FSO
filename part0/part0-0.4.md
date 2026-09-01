````markdown
# 0.4 tehtävä:

```mermaid
sequenceDiagram
    participant Selain
    participant Palvelin

    Note right of Selain: Käyttäjä kirjoittaa uuden muistiinpanon ja painaa "Save"

    Selain->>Palvelin: POST /exampleapp/new_note
    Note right of Palvelin: Palvelin tallentaa uuden muistiinpanon

    Palvelin-->>Selain: HTTP 302 Redirect /notes

    Selain->>Palvelin: GET /exampleapp/notes
    Palvelin-->>Selain: HTML-dokumentti

    Selain->>Palvelin: GET /exampleapp/main.css
    Palvelin-->>Selain: CSS-tiedosto

    Selain->>Palvelin: GET /exampleapp/main.js
    Palvelin-->>Selain: JavaScript-tiedosto

    Note right of Selain: Selain suorittaa JavaScript-koodin

    Selain->>Palvelin: GET /exampleapp/data.json
    Palvelin-->>Selain: JSON-tiedot muistiinpanoista

    Note right of Selain: Selain näyttää muistiinpanot sivulla
