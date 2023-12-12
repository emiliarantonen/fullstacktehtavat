```mermaid
sequenceDiagram
    participant selain
    participant palvelin

    selain->>palvelin: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate palvelin
    palvelin->>selain: [{content: "moii", date: "2023-09-19T10:36:31.582Z"}]
    deactivate palvelin

```