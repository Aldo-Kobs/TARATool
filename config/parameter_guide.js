/** Editable input guidance. Change bilingual text, interpretations and examples here.
 * See docs/parameters-customization.md. Numeric choices follow the active configuration.
 */
window.PARAMETER_GUIDE = {
  ui: {
    ratings: {
      en: 'Ratings and examples',
      de: 'Bewertungsstufen und Beispiele',
    },
    title: {
      en: 'Parameters',
      de: 'Parameter',
    },
    intro: {
      en: 'Guide to the fields you fill in, grouped by tab and entry window. The examples cover hardware and software products, embedded firmware, reusable components, data and system functions. Apply the guidance to the product’s intended use, foreseeable operating conditions, dependencies and agreed company thresholds.',
      de: 'Anleitung zu auszufüllenden Feldern, nach Tab und Eingabefenster geordnet. Die Beispiele umfassen Hardware- und Softwareprodukte, eingebettete Firmware, wiederverwendbare Komponenten, Daten und Systemfunktionen. Die Anleitung auf bestimmungsgemäße Nutzung, vorhersehbare Betriebsbedingungen, Abhängigkeiten und vereinbarte Unternehmensgrenzen anwenden.',
    },
    search: {
      en: 'Find a parameter, value or example',
      de: 'Parameter, Wert oder Beispiel suchen',
    },
    field: {
      en: 'Field',
      de: 'Feld',
    },
    help: {
      en: 'What to enter / purpose',
      de: 'Eingabe / Zweck',
    },
    values: {
      en: 'Values and meaning',
      de: 'Werte und Bedeutung',
    },
    example: {
      en: 'Example / application',
      de: 'Beispiel / Anwendung',
    },
    empty: {
      en: 'No matching parameters.',
      de: 'Keine passenden Parameter.',
    },
    count: {
      en: '{count} parameters shown',
      de: '{count} Parameter angezeigt',
    },
    required: {
      en: 'Required',
      de: 'Erforderlich',
    },
    optional: {
      en: 'Optional',
      de: 'Optional',
    },
    recommended: {
      en: 'Recommended assessment',
      de: 'Bewertung empfohlen',
    },
    conditional: {
      en: 'Required in context',
      de: 'Situativ erforderlich',
    },
    unset: {
      en: 'Unset / “-”: not yet evaluated.',
      de: 'Leer / „-“: noch nicht bewertet.',
    },
    na: {
      en: 'N/A: choose only when this criterion does not apply; explain why in the asset description.',
      de: 'N/A: nur wählen, wenn dieses Kriterium nicht anwendbar ist; in der Asset-Beschreibung begründen.',
    },
    editTitle: {
      en: 'Where to customise this reference',
      de: 'Wo diese Referenz angepasst wird',
    },
    guideFile: {
      en: 'config/parameter_guide.js — edit the English/German field explanations, examples and company interpretations. This changes guidance only.',
      de: 'config/parameter_guide.js — englische/deutsche Felderläuterungen, Beispiele und Unternehmensauslegungen bearbeiten. Ändert nur die Anleitung.',
    },
    scoringFile: {
      en: 'config/assessment_config.json — edit probabilityCriteria, impactScale, severityLevelFactors, protectionLevels, riskThresholds and defaultDamageScenarios to change scoring choices.',
      de: 'config/assessment_config.json — probabilityCriteria, impactScale, severityLevelFactors, protectionLevels, riskThresholds und defaultDamageScenarios für Bewertungsoptionen bearbeiten.',
    },
    sync: {
      en: 'After changing assessment_config.json, run: python3 scripts/sync_assessment_config.py. This regenerates the loaded config/assessment_config.js; then reload the app. Alternatively, load the JSON through Overview → Load assessment config for the current browser session.',
      de: 'Nach Änderung von assessment_config.json ausführen: python3 scripts/sync_assessment_config.py. Dies erzeugt die geladene config/assessment_config.js neu; anschließend die Anwendung neu laden. Alternativ JSON über Übersicht → Bewertungsconfig laden für die aktuelle Browsersitzung laden.',
    },
    editMore: {
      en: 'For exact keys, source files and the distinction between global defaults and per-analysis settings, see docs/parameters-customization.md.',
      de: 'Genaue Schlüssel, Quelldateien sowie die Unterscheidung zwischen globalen Vorgaben und Einstellungen je Analyse: docs/parameters-customization.md.',
    },
    sources: {
      en: 'Assessment background',
      de: 'Hintergrund zur Bewertung',
    },
  },
  sections: [
    {
      id: 'assets',
      title: {
        en: 'Assets → Add / Edit Asset',
        de: 'Assets → Asset hinzufügen / bearbeiten',
      },
      fields: [
        {
          id: 'asset-name',
          label: {
            en: 'Name',
            de: 'Name',
          },
          kind: 'required',
          help: {
            en: 'Identify the asset and its boundary: an individual component, application, device or shared system service. Required to save.',
            de: 'Asset und Abgrenzung benennen: einzelne Komponente, Anwendung, Gerät oder gemeinsam genutzter Systemdienst. Zum Speichern erforderlich.',
          },
          values: {
            en: 'Free text. IDs such as A01 are generated automatically.',
            de: 'Freitext. Kennungen wie A01 werden automatisch erzeugt.',
          },
          example: {
            en: 'Network gateway; update library; embedded controller; customer database; authentication or recovery function.',
            de: 'Netzwerk-Gateway; Update-Bibliothek; eingebettete Steuerung; Kundendatenbank; Authentifizierungs- oder Wiederherstellungsfunktion.',
          },
        },
        {
          id: 'asset-type',
          label: {
            en: 'Type',
            de: 'Typ',
          },
          kind: 'required',
          help: {
            en: 'Choose the category that best describes what must be protected.',
            de: 'Die Kategorie wählen, die das zu schützende Objekt beschreibt.',
          },
          values: {
            en: 'Hardware (HW) and physical interfaces use Component. Software (SW), firmware and information use Data. A capability or behaviour uses Function. Assess the protection needs of each asset in its operating role.',
            de: 'Hardware (HW) und physische Schnittstellen gehören zu Komponente. Software (SW), Firmware und Informationen gehören zu Daten. Fähigkeiten oder Verhalten gehören zu Funktion. Den Schutzbedarf jedes Assets anhand seiner Rolle im Betrieb bewerten.',
          },
          example: {
            en: 'A network gateway combines hardware, firmware, configuration and communication functions. A software application combines executable code, libraries, user data and access-control functions; cryptographic keys may be separate assets.',
            de: 'Ein Netzwerk-Gateway verbindet Hardware, Firmware, Konfiguration und Kommunikationsfunktionen. Eine Softwareanwendung verbindet ausführbaren Code, Bibliotheken, Nutzerdaten und Zugriffskontrollfunktionen; kryptografische Schlüssel können eigene Assets sein.',
          },
          valueSource: 'assetTypes',
        },
        {
          id: 'asset-description',
          label: {
            en: 'Description',
            de: 'Beschreibung',
          },
          kind: 'optional',
          help: {
            en: 'Describe the purpose, interfaces, trust boundaries and dependencies. State which users, devices, applications or downstream products the asset can affect, and what still works if it fails.',
            de: 'Zweck, Schnittstellen, Vertrauensgrenzen und Abhängigkeiten beschreiben. Angeben, welche Nutzer, Geräte, Anwendungen oder nachgelagerten Produkte betroffen sein können und was bei Ausfall weiterhin funktioniert.',
          },
          values: {
            en: 'Optional free text; can be maintained in English and German.',
            de: 'Optionaler Freitext; auf Englisch und Deutsch pflegbar.',
          },
          example: {
            en: 'An update component installs packages on connected devices. Record supported products, permissions, verification steps, network access and rollback options. For a shared library, identify the applications that rely on it.',
            de: 'Eine Update-Komponente installiert Pakete auf verbundenen Geräten. Unterstützte Produkte, Berechtigungen, Prüfschritte, Netzwerkzugriff und Rücksetzoptionen dokumentieren. Bei einer gemeinsamen Bibliothek die davon abhängigen Anwendungen benennen.',
          },
        },
        {
          id: 'asset-confidentiality',
          label: {
            en: 'Confidentiality',
            de: 'Vertraulichkeit',
          },
          kind: 'recommended',
          help: {
            en: 'How serious would unauthorised disclosure be? The form allows an unset value; complete the assessment deliberately.',
            de: 'Wie schwerwiegend wäre eine unbefugte Offenlegung? Das Formular erlaubt eine leere Auswahl; die Bewertung bewusst vervollständigen.',
          },
          values: {
            en: 'Choose the highest credible consequence for this property in the intended operating context. Consider affected users, data, physical processes, dependent products and recovery options.',
            de: 'Die höchste plausible Folge für diese Eigenschaft im vorgesehenen Betriebskontext wählen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Produkte und Wiederherstellungsmöglichkeiten berücksichtigen.',
          },
          example: {
            en: 'Compare an isolated component with the same component used by many devices or applications. Record dependencies, effective alternatives and the consequences of failure; type and deployment size alone do not determine the rating.',
            de: 'Eine isolierte Komponente mit derselben Komponente in vielen Geräten oder Anwendungen vergleichen. Abhängigkeiten, wirksame Ersatzlösungen und Ausfallfolgen dokumentieren; Typ und Einsatzumfang allein bestimmen die Einstufung nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Limited disclosure — exposes low-sensitivity internal information with minor, local consequences, without revealing access secrets or sensitive personal information.',
                de: 'Begrenzte Offenlegung — wenig sensible interne Informationen werden bekannt; die Folgen sind gering und lokal, ohne Preisgabe von Zugangsgeheimnissen oder sensiblen Personendaten.',
              },
              example: {
                en: 'An internal list of device models or software versions is disclosed without customer identities, access details or usage histories.',
                de: 'Eine interne Liste von Gerätemodellen oder Softwareversionen wird ohne Kundenidentitäten, Zugangsdetails oder Nutzungsverläufe offengelegt.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Sensitive disclosure — reveals confidential business information, technical designs or personal records, causing substantial but contained harm.',
                de: 'Sensible Offenlegung — vertrauliche Geschäftsinformationen, technische Entwürfe oder Personendaten werden bekannt und verursachen erhebliche, aber begrenzte Schäden.',
              },
              example: {
                en: 'A service application exposes customer records or proprietary device configurations to an unauthorized user.',
                de: 'Eine Serviceanwendung legt Kundendaten oder proprietäre Gerätekonfigurationen gegenüber einem unbefugten Nutzer offen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical disclosure — exposes secrets or highly sensitive information whose loss enables extensive compromise or severe, lasting harm.',
                de: 'Kritische Offenlegung — Geheimnisse oder hochsensible Informationen werden bekannt, deren Verlust weitreichende Kompromittierung oder schwere, dauerhafte Schäden ermöglicht.',
              },
              example: {
                en: 'Administrator credentials for a device fleet or a private firmware-signing key are exposed, enabling unauthorized control or malicious updates.',
                de: 'Administratorzugangsdaten einer Geräteflotte oder ein privater Firmware-Signaturschlüssel werden offengelegt und ermöglichen unbefugte Steuerung oder schädliche Updates.',
              },
            },
          ],
        },
        {
          id: 'asset-integrity',
          label: {
            en: 'Integrity',
            de: 'Integrität',
          },
          kind: 'recommended',
          help: {
            en: 'How serious would unauthorised modification be? The form allows an unset value; complete the assessment deliberately.',
            de: 'Wie schwerwiegend wäre eine unbefugte Veränderung? Das Formular erlaubt eine leere Auswahl; die Bewertung bewusst vervollständigen.',
          },
          values: {
            en: 'Choose the highest credible consequence for this property in the intended operating context. Consider affected users, data, physical processes, dependent products and recovery options.',
            de: 'Die höchste plausible Folge für diese Eigenschaft im vorgesehenen Betriebskontext wählen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Produkte und Wiederherstellungsmöglichkeiten berücksichtigen.',
          },
          example: {
            en: 'Compare an isolated component with the same component used by many devices or applications. Record dependencies, effective alternatives and the consequences of failure; type and deployment size alone do not determine the rating.',
            de: 'Eine isolierte Komponente mit derselben Komponente in vielen Geräten oder Anwendungen vergleichen. Abhängigkeiten, wirksame Ersatzlösungen und Ausfallfolgen dokumentieren; Typ und Einsatzumfang allein bestimmen die Einstufung nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Locally correctable change — affects nonessential presentation or descriptive information without altering important decisions, outputs or protective behaviour.',
                de: 'Lokal korrigierbare Änderung — unwesentliche Darstellung oder beschreibende Informationen ändern sich, ohne wichtige Entscheidungen, Ausgaben oder Schutzverhalten zu beeinflussen.',
              },
              example: {
                en: 'A dashboard colour or optional description is changed; processing results and device operation remain correct.',
                de: 'Eine Dashboard-Farbe oder optionale Beschreibung wird verändert; Verarbeitungsergebnisse und Gerätebetrieb bleiben korrekt.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operationally significant change — produces incorrect outputs, lost work or disruption within a bounded part of operations, requiring deliberate restoration.',
                de: 'Betrieblich erhebliche Änderung — falsche Ergebnisse, Arbeitsverlust oder Störungen eines begrenzten Betriebsbereichs erfordern gezielte Wiederherstellung.',
              },
              example: {
                en: 'Altered configuration data or sensor calibration produces incorrect results in one application or production cell; restoration and rework are needed.',
                de: 'Veränderte Konfigurationsdaten oder Sensorkalibrierung erzeugen falsche Ergebnisse in einer Anwendung oder Produktionszelle; Wiederherstellung und Nacharbeit sind nötig.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical change — defeats essential safeguards, corrupts trusted decisions or compromises core functions with severe or widespread consequences.',
                de: 'Kritische Änderung — wesentliche Schutzvorkehrungen, vertrauenswürdige Entscheidungen oder Kernfunktionen werden mit schweren oder weitreichenden Folgen beeinträchtigt.',
              },
              example: {
                en: 'A manipulated bootloader or shared update library accepts malicious code, compromising every product that relies on that trust decision.',
                de: 'Ein manipulierter Bootloader oder eine gemeinsame Update-Bibliothek akzeptiert Schadcode und kompromittiert alle Produkte, die dieser Vertrauensentscheidung folgen.',
              },
            },
          ],
        },
        {
          id: 'asset-availability',
          label: {
            en: 'Availability',
            de: 'Verfügbarkeit',
          },
          kind: 'recommended',
          help: {
            en: 'How serious would loss of access or operation be? The form allows an unset value; complete the assessment deliberately.',
            de: 'Wie schwerwiegend wäre der Ausfall von Zugriff oder Betrieb? Das Formular erlaubt eine leere Auswahl; die Bewertung bewusst vervollständigen.',
          },
          values: {
            en: 'Choose the highest credible consequence for this property in the intended operating context. Consider affected users, data, physical processes, dependent products and recovery options.',
            de: 'Die höchste plausible Folge für diese Eigenschaft im vorgesehenen Betriebskontext wählen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Produkte und Wiederherstellungsmöglichkeiten berücksichtigen.',
          },
          example: {
            en: 'Compare an isolated component with the same component used by many devices or applications. Record dependencies, effective alternatives and the consequences of failure; type and deployment size alone do not determine the rating.',
            de: 'Eine isolierte Komponente mit derselben Komponente in vielen Geräten oder Anwendungen vergleichen. Abhängigkeiten, wirksame Ersatzlösungen und Ausfallfolgen dokumentieren; Typ und Einsatzumfang allein bestimmen die Einstufung nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Tolerable interruption — a convenience function is temporarily unavailable while required operations continue through a practical alternative.',
                de: 'Tolerierbare Unterbrechung — eine Komfortfunktion fällt vorübergehend aus; erforderlicher Betrieb bleibt über eine praktikable Alternative möglich.',
              },
              example: {
                en: 'A reporting dashboard is offline, but the application’s main functions and local device controls remain usable.',
                de: 'Ein Berichts-Dashboard ist offline; die Hauptfunktionen der Anwendung und lokale Gerätebedienung bleiben nutzbar.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Disruptive interruption — important work in a bounded part of the system stops until recovery, with limited alternatives and substantial service effort.',
                de: 'Störende Unterbrechung — wichtige Arbeit eines begrenzten Systembereichs stoppt bis zur Wiederherstellung, bei begrenzten Ersatzmöglichkeiten und erheblichem Serviceaufwand.',
              },
              example: {
                en: 'A failed gateway or application component interrupts one site’s workflow until staff restore its configuration or roll back an update.',
                de: 'Ein ausgefallenes Gateway oder eine Anwendungskomponente unterbricht den Arbeitsablauf eines Standorts, bis Personal die Konfiguration wiederherstellt oder ein Update zurücksetzt.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical interruption — essential operation is lost beyond the tolerable outage, with no effective alternative and severe consequences.',
                de: 'Kritische Unterbrechung — wesentlicher Betrieb fällt über die tolerierbare Dauer hinaus aus, ohne wirksame Alternative und mit schweren Folgen.',
              },
              example: {
                en: 'A shared authentication or control service becomes unavailable, preventing essential operations across dependent systems without a workable fallback.',
                de: 'Ein gemeinsamer Authentifizierungs- oder Steuerungsdienst fällt aus und verhindert wesentlichen Betrieb abhängiger Systeme ohne nutzbare Ersatzlösung.',
              },
            },
          ],
        },
        {
          id: 'asset-authorization',
          label: {
            en: 'Authorization',
            de: 'Autorisierung',
          },
          kind: 'recommended',
          help: {
            en: 'Authorization asks “What may this identity do?” Assess the need to enforce permissions, even for correctly authenticated identities.',
            de: 'Autorisierung fragt: „Was darf diese Identität tun?“ Bewerten Sie, wie wichtig die Durchsetzung von Berechtigungen ist, auch bei korrekt authentifizierten Identitäten.',
          },
          values: {
            en: 'Choose the highest credible consequence for this property in the intended operating context. Consider affected users, data, physical processes, dependent products and recovery options.',
            de: 'Die höchste plausible Folge für diese Eigenschaft im vorgesehenen Betriebskontext wählen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Produkte und Wiederherstellungsmöglichkeiten berücksichtigen.',
          },
          example: {
            en: 'Compare an isolated component with the same component used by many devices or applications. Record dependencies, effective alternatives and the consequences of failure; type and deployment size alone do not determine the rating.',
            de: 'Eine isolierte Komponente mit derselben Komponente in vielen Geräten oder Anwendungen vergleichen. Abhängigkeiten, wirksame Ersatzlösungen und Ausfallfolgen dokumentieren; Typ und Einsatzumfang allein bestimmen die Einstufung nicht.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Minor permission overreach — an identified user or process exceeds its role only for low-consequence settings or information.',
                de: 'Geringfügige Rechteüberschreitung — ein identifizierter Nutzer oder Prozess überschreitet seine Rolle nur bei wenig folgenschweren Einstellungen oder Informationen.',
              },
              example: {
                en: 'A read-only user changes a shared display preference but cannot alter business records, device commands or security settings.',
                de: 'Ein Nutzer mit Leserechten ändert eine gemeinsame Anzeigeeinstellung, kann aber weder Geschäftsdaten noch Gerätebefehle oder Sicherheitseinstellungen verändern.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Significant permission overreach — access beyond the assigned role changes important settings or exposes sensitive data within a bounded scope.',
                de: 'Erhebliche Rechteüberschreitung — Zugriff außerhalb der zugewiesenen Rolle verändert wichtige Einstellungen oder legt sensible Daten in begrenztem Umfang offen.',
              },
              example: {
                en: 'An ordinary user changes another team’s device configuration or exports restricted customer records.',
                de: 'Ein gewöhnlicher Nutzer ändert die Gerätekonfiguration eines anderen Teams oder exportiert zugriffsbeschränkte Kundendaten.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical permission overreach — unauthorized actions can bypass safeguards, replace trusted software or grant broad administrative control.',
                de: 'Kritische Rechteüberschreitung — unberechtigte Aktionen können Schutzvorkehrungen umgehen, vertrauenswürdige Software ersetzen oder umfassende Administrationsrechte vergeben.',
              },
              example: {
                en: 'A low-privilege account gains rights to deploy software across a fleet, change trust keys or disable protective functions.',
                de: 'Ein Konto mit geringen Rechten erhält die Möglichkeit, Software flottenweit zu verteilen, Vertrauensschlüssel zu ändern oder Schutzfunktionen zu deaktivieren.',
              },
            },
          ],
        },
        {
          id: 'asset-authentication',
          label: {
            en: 'Authentication',
            de: 'Authentifizierung',
          },
          kind: 'recommended',
          help: {
            en: 'Authentication asks “Who is this?” Assess the need to reliably verify user, device or service identity.',
            de: 'Authentifizierung fragt: „Wer ist das?“ Bewerten Sie, wie wichtig die zuverlässige Prüfung der Benutzer-, Geräte- oder Dienstidentität ist.',
          },
          values: {
            en: 'Choose the highest credible consequence for this property in the intended operating context. Consider affected users, data, physical processes, dependent products and recovery options.',
            de: 'Die höchste plausible Folge für diese Eigenschaft im vorgesehenen Betriebskontext wählen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Produkte und Wiederherstellungsmöglichkeiten berücksichtigen.',
          },
          example: {
            en: 'Compare an isolated component with the same component used by many devices or applications. Record dependencies, effective alternatives and the consequences of failure; type and deployment size alone do not determine the rating.',
            de: 'Eine isolierte Komponente mit derselben Komponente in vielen Geräten oder Anwendungen vergleichen. Abhängigkeiten, wirksame Ersatzlösungen und Ausfallfolgen dokumentieren; Typ und Einsatzumfang allein bestimmen die Einstufung nicht.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Low-consequence impersonation — trusting the wrong identity affects only non-sensitive information or nonessential behaviour.',
                de: 'Wenig folgenschwere Identitätstäuschung — Vertrauen in eine falsche Identität betrifft nur nicht sensible Informationen oder unwesentliches Verhalten.',
              },
              example: {
                en: 'Someone impersonates a viewer of a demonstration application that contains no customer data and cannot control real devices.',
                de: 'Jemand gibt sich als Betrachter einer Demonstrationsanwendung aus, die keine Kundendaten enthält und keine realen Geräte steuern kann.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operational impersonation — a false user, device or service identity gains sensitive information or important access within a bounded scope.',
                de: 'Betrieblich erhebliche Identitätstäuschung — eine falsche Nutzer-, Geräte- oder Dienstidentität erhält sensible Informationen oder wichtigen Zugriff in begrenztem Umfang.',
              },
              example: {
                en: 'A fake support technician accesses one customer installation, or an impersonated data source supplies incorrect readings to one workflow.',
                de: 'Ein falscher Supporttechniker erhält Zugriff auf eine Kundeninstallation, oder eine vorgetäuschte Datenquelle liefert falsche Messwerte für einen Arbeitsablauf.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical impersonation — a false administrator, trusted supplier or essential system component is accepted, enabling severe or widespread compromise.',
                de: 'Kritische Identitätstäuschung — ein falscher Administrator, vertrauenswürdiger Lieferant oder wesentlicher Systembestandteil wird akzeptiert und ermöglicht schwere oder weitreichende Kompromittierung.',
              },
              example: {
                en: 'Products trust a forged update publisher or central management service and accept malicious packages or commands across many installations.',
                de: 'Produkte vertrauen einem gefälschten Update-Herausgeber oder zentralen Verwaltungsdienst und akzeptieren schädliche Pakete oder Befehle in vielen Installationen.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Assess hardware, software, firmware, data and functions by the consequences of a protection failure. I: limited effects handled through routine work. II: substantial but contained disruption, disclosure or recovery effort. III: severe harm, loss of essential control or compromise of critical secrets. Assess each security property separately. A small component can have high protection needs if many products depend on it; a central service need not be rated high when effective alternatives limit the harm. Include indirect effects through connected systems and shared components. State intended use, affected users, dependency scope and recovery assumptions. These I/II/III ratings are company protection-need categories, distinct from SL-T and CRA product classes.',
        de: 'Hardware, Software, Firmware, Daten und Funktionen nach den Folgen eines Schutzversagens bewerten. I: begrenzte, im Routinebetrieb beherrschbare Folgen. II: erhebliche, aber begrenzte Störung, Offenlegung oder Wiederherstellungsaufwand. III: schwere Schäden, Verlust wesentlicher Steuerung oder Kompromittierung kritischer Geheimnisse. Jede Sicherheitseigenschaft getrennt bewerten. Eine kleine Komponente kann hohen Schutzbedarf haben, wenn viele Produkte davon abhängen; ein zentraler Dienst muss bei wirksamen Ersatzlösungen nicht hoch eingestuft werden. Indirekte Folgen über verbundene Systeme und gemeinsame Komponenten einbeziehen. Bestimmungsgemäße Nutzung, betroffene Nutzer, Abhängigkeiten und Wiederherstellungsannahmen festhalten. I/II/III sind unternehmensbezogene Schutzbedarfskategorien, getrennt von SL-T und CRA-Produktklassen.',
      },
    },
    {
      id: 'damage',
      title: {
        en: 'Damage Scenarios → Add / Edit Scenario',
        de: 'Schadensszenarien → Szenario hinzufügen / bearbeiten',
      },
      fields: [
        {
          id: 'scenario-name',
          label: {
            en: 'Custom scenario name',
            de: 'Name eines eigenen Szenarios',
          },
          kind: 'required',
          help: {
            en: 'Describe a potential harmful outcome, rather than an attack technique.',
            de: 'Eine mögliche schädliche Folge beschreiben, nicht die Angriffstechnik.',
          },
          values: {
            en: 'Required text for custom scenarios. Built-in scenarios are defined in the assessment configuration.',
            de: 'Pflichttext für eigene Szenarien. Standardszenarien sind in der Bewertungskonfiguration definiert.',
          },
          example: {
            en: 'Injury from unsafe device operation; loss of customer data; interruption of network access or an essential application workflow.',
            de: 'Verletzung durch unsicheren Gerätebetrieb; Verlust von Kundendaten; Unterbrechung von Netzwerkzugriff oder eines wesentlichen Anwendungsablaufs.',
          },
        },
        {
          id: 'scenario-short',
          label: {
            en: 'Short description',
            de: 'Kurzbeschreibung',
          },
          kind: 'required',
          help: {
            en: 'Enter the concise label used in scenario selectors.',
            de: 'Die Kurzbezeichnung für die Szenarioauswahl eingeben.',
          },
          values: {
            en: 'Required text, at most 10 characters.',
            de: 'Pflichttext, höchstens 10 Zeichen.',
          },
          example: {
            en: 'Injury; DataLoss; Outage.',
            de: 'Verletzung; Datenverl.; Ausfall.',
          },
        },
        {
          id: 'scenario-description',
          label: {
            en: 'Scenario description',
            de: 'Szenariobeschreibung',
          },
          kind: 'optional',
          help: {
            en: 'Describe the harmful outcome, affected people or assets, and assumptions: intended use, access, dependencies, deployment scope, fallback and recovery time. Include indirect effects through integrated components.',
            de: 'Schädliche Folge, betroffene Personen oder Assets und Annahmen beschreiben: vorgesehene Nutzung, Zugriff, Abhängigkeiten, Einsatzumfang, Ersatzlösungen und Wiederherstellungsdauer. Indirekte Folgen über integrierte Komponenten einbeziehen.',
          },
          values: {
            en: 'Optional free text for custom scenarios. The five standard damage scenarios below explain which type of harm to assess; one incident may affect several scenarios.',
            de: 'Optionaler Freitext für eigene Szenarien. Die fünf Standardszenarien unten erläutern die jeweils zu bewertende Schadensart; ein Vorfall kann mehrere Szenarien betreffen.',
          },
          example: {
            en: 'A compromised update component distributes unusable software to deployed products. Customers lose required functions until recovery. State the affected versions and installations, recovery path and any available alternative.',
            de: 'Eine kompromittierte Update-Komponente verteilt unbrauchbare Software an eingesetzte Produkte. Kunden verlieren erforderliche Funktionen bis zur Wiederherstellung. Betroffene Versionen und Installationen, Wiederherstellungsweg und verfügbare Ersatzlösungen angeben.',
          },
          interpretations: [
            {
              label: {
                en: 'DS1 — Danger to life and limb',
                de: 'DS1 — Gefahr für Leib und Leben',
              },
              meaning: {
                en: 'Harm to users, operators, service personnel or bystanders caused by unsafe behaviour. Consider movement, heat, energy, misleading information or failure of protective functions. Software and components may contribute indirectly through the products that use them. Assess credible injury and exposure.',
                de: 'Schaden für Nutzer, Bediener, Servicepersonal oder Umstehende durch unsicheres Verhalten. Bewegung, Wärme, Energie, irreführende Informationen oder ausgefallene Schutzfunktionen berücksichtigen. Software und Komponenten können über ihre verwendenden Produkte indirekt beitragen. Plausible Verletzung und Gefährdung bewerten.',
              },
              example: {
                en: 'A manipulated controller or sensor reading prevents a machine from stopping when a person enters a hazardous area.',
                de: 'Eine manipulierte Steuerung oder ein verfälschter Sensorwert verhindert das Anhalten einer Maschine, wenn eine Person einen Gefahrenbereich betritt.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No credible path from this asset to personal injury in the assessed use. Include indirect effects through integrated products, trusted information and protective functions before selecting N/A.',
                    de: 'Kein plausibler Weg von diesem Asset zu Personenschäden in der bewerteten Nutzung. Vor Auswahl von N/A indirekte Folgen über integrierte Produkte, vertrauenswürdige Informationen und Schutzfunktionen einbeziehen.',
                  },
                  example: {
                    en: 'An isolated public illustration is not used to operate, maintain or make decisions about physical equipment.',
                    de: 'Eine isolierte öffentliche Abbildung wird weder zur Bedienung oder Wartung noch für Entscheidungen über physische Geräte genutzt.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'Brief discomfort or minor, temporary harm with no lasting impairment. Assess credible physical consequences and who can be exposed.',
                    de: 'Kurzes Unbehagen oder geringfügige, vorübergehende Beeinträchtigung ohne bleibende Folgen. Plausible körperliche Konsequenzen und gefährdete Personen bewerten.',
                  },
                  example: {
                    en: 'An unexpected but bounded change in a device display’s brightness causes temporary discomfort without lasting injury.',
                    de: 'Eine unerwartete, aber begrenzte Änderung der Displayhelligkeit eines Geräts verursacht vorübergehendes Unbehagen ohne bleibende Verletzung.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A reversible injury with a meaningful recovery period or temporary restriction of normal activities, within the agreed company severity criteria.',
                    de: 'Eine reversible Verletzung mit nennenswerter Erholungszeit oder vorübergehender Einschränkung normaler Tätigkeiten, innerhalb der vereinbarten Unternehmenskriterien.',
                  },
                  example: {
                    en: 'Unintended operation of powered equipment causes a reversible hand injury that temporarily prevents normal work.',
                    de: 'Unbeabsichtigter Betrieb eines angetriebenen Geräts verursacht eine reversible Handverletzung, die normale Arbeit vorübergehend verhindert.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Serious injury, permanent impairment or a life-threatening outcome. One exposed person and one product can be sufficient.',
                    de: 'Schwere Verletzung, bleibende Beeinträchtigung oder lebensbedrohliche Folge. Bereits eine gefährdete Person und ein Produkt können genügen.',
                  },
                  example: {
                    en: 'A compromised control component defeats a protective stop and causes a severe crushing injury.',
                    de: 'Eine kompromittierte Steuerungskomponente setzt einen Schutzstopp außer Kraft und verursacht eine schwere Quetschverletzung.',
                  },
                },
              ],
            },
            {
              label: {
                en: 'DS2 — Financial damage',
                de: 'DS2 — Finanzieller Schaden',
              },
              meaning: {
                en: 'Direct and indirect monetary loss for customers, operators or the manufacturer. Include damaged equipment, lost work, service visits, restoration, replacement, downtime and corrective campaigns. Assess the total credible cost, including downstream users of a shared component.',
                de: 'Direkte und indirekte finanzielle Verluste für Kunden, Betreiber oder Hersteller. Beschädigte Geräte, Arbeitsverlust, Serviceeinsätze, Wiederherstellung, Ersatz, Ausfallzeiten und Korrekturaktionen berücksichtigen. Plausible Gesamtkosten einschließlich nachgelagerter Nutzer einer gemeinsamen Komponente bewerten.',
              },
              example: {
                en: 'A faulty update disrupts many customer installations, requiring emergency recovery, replacements and compensation for lost operation.',
                de: 'Ein fehlerhaftes Update stört viele Kundeninstallationen und erfordert Notfallwiederherstellung, Ersatz sowie Entschädigung für Betriebsausfall.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No credible financial loss for the customer, operator or manufacturer from this asset/scenario pair. Explain the absence of repair, recovery and indirect costs.',
                    de: 'Kein plausibler finanzieller Verlust für Kunden, Betreiber oder Hersteller durch dieses Asset/Szenario-Paar. Begründen, warum Reparatur-, Wiederherstellungs- und indirekte Kosten entfallen.',
                  },
                  example: {
                    en: 'Reading an already public product brochure causes no credible additional cost or commercial loss.',
                    de: 'Das Lesen einer bereits öffentlichen Produktbroschüre verursacht plausibel keine zusätzlichen Kosten oder geschäftlichen Verluste.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A small, local cost within the agreed routine-service threshold. No significant replacement, property damage or wider corrective action is needed.',
                    de: 'Geringe lokale Kosten innerhalb der vereinbarten Grenze für Routine-Service. Kein erheblicher Ersatz, Sachschaden oder umfassender Korrekturbedarf.',
                  },
                  example: {
                    en: 'Support corrects one application setting during a planned service session without lost work or replacement.',
                    de: 'Der Support korrigiert bei einem geplanten Service eine Anwendungseinstellung ohne Arbeitsverlust oder Ersatzbedarf.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A substantial but contained cost requiring an unplanned repair, replacement or customer compensation. Use agreed financial bands and total credible costs.',
                    de: 'Erhebliche, aber begrenzte Kosten durch ungeplante Reparatur, Ersatz oder Kundenentschädigung. Vereinbarte finanzielle Bandgrenzen und plausible Gesamtkosten verwenden.',
                  },
                  example: {
                    en: 'A damaged configuration interrupts one customer workflow and requires an unplanned recovery visit and rework.',
                    de: 'Eine beschädigte Konfiguration unterbricht einen Kundenablauf und erfordert einen ungeplanten Wiederherstellungseinsatz sowie Nacharbeit.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Major financial loss exceeding the agreed high-impact threshold, through extensive property damage, a large service campaign or other substantial direct and indirect costs.',
                    de: 'Großer finanzieller Verlust oberhalb der vereinbarten Grenze für hohe Auswirkungen, durch umfangreiche Sachschäden, eine große Serviceaktion oder andere erhebliche direkte und indirekte Kosten.',
                  },
                  example: {
                    en: 'A vulnerable shared component forces an emergency update campaign across many products, with major recovery and customer compensation costs.',
                    de: 'Eine verwundbare gemeinsame Komponente erzwingt eine Notfall-Update-Aktion für viele Produkte mit hohen Wiederherstellungs- und Kundenentschädigungskosten.',
                  },
                },
              ],
            },
            {
              label: {
                en: 'DS3 — Operation damage',
                de: 'DS3 — Betriebsschaden',
              },
              meaning: {
                en: 'Loss or degradation of the intended operation of a product or dependent system. Consider communication, processing, monitoring, control and recovery functions. Assess outage duration, scope, lost work and the effectiveness of alternatives. A library or network component can affect several dependent applications or devices.',
                de: 'Ausfall oder Einschränkung des vorgesehenen Betriebs eines Produkts oder abhängigen Systems. Kommunikation, Verarbeitung, Überwachung, Steuerung und Wiederherstellung berücksichtigen. Ausfalldauer, Umfang, Arbeitsverlust und Wirksamkeit von Ersatzlösungen bewerten. Eine Bibliothek oder Netzwerkkomponente kann mehrere abhängige Anwendungen oder Geräte betreffen.',
              },
              example: {
                en: 'A gateway failure interrupts communication, or a defective shared library prevents dependent applications from starting until restored.',
                de: 'Ein Gateway-Ausfall unterbricht die Kommunikation, oder eine fehlerhafte gemeinsame Bibliothek verhindert den Start abhängiger Anwendungen bis zur Wiederherstellung.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'The asset does not support current product operation, monitoring, maintenance or recovery, and its loss cannot impair them in the assessed scope.',
                    de: 'Das Asset unterstützt weder aktuellen Produktbetrieb noch Überwachung, Wartung oder Wiederherstellung; sein Verlust kann diese im bewerteten Umfang nicht beeinträchtigen.',
                  },
                  example: {
                    en: 'An obsolete duplicate demonstration file is not used by the running product or needed for support and recovery.',
                    de: 'Eine veraltete doppelte Demonstrationsdatei wird weder vom laufenden Produkt verwendet noch für Support oder Wiederherstellung benötigt.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A short or minor loss of convenience. Required functions remain available through a practical alternative.',
                    de: 'Kurzer oder geringfügiger Komfortverlust. Erforderliche Funktionen bleiben über eine praktikable Alternative verfügbar.',
                  },
                  example: {
                    en: 'A status dashboard is unavailable, but the main application workflow and local device operation continue.',
                    de: 'Ein Status-Dashboard fällt aus; der Hauptablauf der Anwendung und die lokale Gerätebedienung laufen weiter.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'Important operation is interrupted for a bounded part of the system and requires deliberate recovery. A usable alternative contains the disruption within the agreed tolerable period.',
                    de: 'Wichtiger Betrieb eines begrenzten Systembereichs ist unterbrochen und erfordert gezielte Wiederherstellung. Eine nutzbare Ersatzlösung begrenzt die Störung innerhalb der vereinbarten tolerierbaren Dauer.',
                  },
                  example: {
                    en: 'A failed application module interrupts one department’s work until restored from backup; a limited manual workflow remains available.',
                    de: 'Ein ausgefallenes Anwendungsmodul unterbricht die Arbeit einer Abteilung bis zur Wiederherstellung aus Sicherung; ein begrenzter manueller Ablauf bleibt möglich.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Required operation is lost beyond the maximum tolerable outage with no effective fallback. Assess essential functions, scope and consequences, rather than counting devices or users alone.',
                    de: 'Erforderlicher Betrieb fällt über die maximal tolerierbare Ausfallzeit hinaus aus, ohne wirksame Ersatzlösung. Wesentliche Funktionen, Umfang und Folgen bewerten, statt nur Geräte oder Nutzer zu zählen.',
                  },
                  example: {
                    en: 'An authentication or network component fails across essential dependent systems, leaving required operation unavailable without a usable alternative.',
                    de: 'Eine Authentifizierungs- oder Netzwerkkomponente fällt in wesentlichen abhängigen Systemen aus; erforderlicher Betrieb bleibt ohne nutzbare Alternative unmöglich.',
                  },
                },
              ],
            },
            {
              label: {
                en: 'DS4 — Loss of privacy/data',
                de: 'DS4 — Verlust Privatsphäre/Daten',
              },
              meaning: {
                en: 'Loss of confidentiality or control over personal, customer or sensitive technical information. Consider records, usage histories, credentials, intellectual property and identifying metadata. Assess what is exposed, who is affected and how the information could be misused.',
                de: 'Verlust der Vertraulichkeit oder Kontrolle über personenbezogene, kundenbezogene oder sensible technische Informationen. Datensätze, Nutzungsverläufe, Zugangsdaten, geistiges Eigentum und identifizierende Metadaten berücksichtigen. Offengelegte Inhalte, Betroffene und möglichen Missbrauch bewerten.',
              },
              example: {
                en: 'An application exposes customer records, or a connected camera allows unauthorized access to private recordings.',
                de: 'Eine Anwendung legt Kundendaten offen, oder eine vernetzte Kamera ermöglicht unbefugten Zugriff auf private Aufnahmen.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No personal, confidential customer or sensitive technical information can be exposed through this asset in the assessed context. Record what information is actually present.',
                    de: 'Über dieses Asset können im bewerteten Kontext keine personenbezogenen, vertraulichen Kunden- oder sensiblen technischen Informationen offengelegt werden. Tatsächlich vorhandene Informationen dokumentieren.',
                  },
                  example: {
                    en: 'A standalone demonstration contains only published sample data, with no customer information, credentials or access to live systems.',
                    de: 'Eine eigenständige Demonstration enthält nur veröffentlichte Beispieldaten ohne Kundeninformationen, Zugangsdaten oder Zugriff auf produktive Systeme.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'Limited disclosure of low-sensitivity internal information, without access secrets or sensitive information about identifiable people. Consequences are local and minor.',
                    de: 'Begrenzte Offenlegung wenig sensibler interner Informationen, ohne Zugangsgeheimnisse oder sensible Informationen über identifizierbare Personen. Die Folgen sind lokal und gering.',
                  },
                  example: {
                    en: 'An internal component-version list is disclosed without personal information, customer identities or access secrets.',
                    de: 'Eine interne Komponentenversionsliste wird ohne personenbezogene Informationen, Kundenidentitäten oder Zugangsgeheimnisse offengelegt.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'Disclosure of sensitive customer, technical or personal information causes substantial but contained harm. Consider identifiability, detail and likely use of the information.',
                    de: 'Offenlegung sensibler Kunden-, Technik- oder Personendaten verursacht erheblichen, aber begrenzten Schaden. Identifizierbarkeit, Detailgrad und mögliche Nutzung der Informationen berücksichtigen.',
                  },
                  example: {
                    en: 'A customer application exposes identifiable service records or usage histories for a bounded user group.',
                    de: 'Eine Kundenanwendung legt identifizierbare Serviceunterlagen oder Nutzungsverläufe einer begrenzten Nutzergruppe offen.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Exposure of critical secrets or highly sensitive information causes severe or lasting harm. Extensive disclosure can increase severity, but one critical secret may already qualify.',
                    de: 'Offenlegung kritischer Geheimnisse oder hochsensibler Informationen verursacht schwere oder dauerhafte Schäden. Ein großer Umfang kann die Schwere erhöhen; bereits ein kritisches Geheimnis kann genügen.',
                  },
                  example: {
                    en: 'Fleet administrator credentials or a private firmware-signing key are disclosed, enabling compromise across dependent products.',
                    de: 'Flottenadministratorzugangsdaten oder ein privater Firmware-Signaturschlüssel werden offengelegt und ermöglichen die Kompromittierung abhängiger Produkte.',
                  },
                },
              ],
            },
            {
              label: {
                en: 'DS5 — Legal consequences',
                de: 'DS5 — Rechtliche Konsequenzen',
              },
              meaning: {
                en: 'Consequences of failing applicable legal or regulatory obligations, including product cybersecurity, safety or data protection where relevant. Record the specific obligation and credible consequence. Assess this separately from the associated injury, outage or financial loss.',
                de: 'Folgen der Nichterfüllung anwendbarer gesetzlicher oder regulatorischer Pflichten, etwa zu Produkt-Cybersicherheit, Sicherheit oder Datenschutz. Konkrete Pflicht und plausible Folge dokumentieren. Diese getrennt von zugehöriger Verletzung, Betriebsausfall oder finanziellem Verlust bewerten.',
              },
              example: {
                en: 'A product defect defeats a required security function. The documented assessment identifies the applicable obligation and the resulting corrective or enforcement consequences.',
                de: 'Ein Produktfehler setzt eine erforderliche Sicherheitsfunktion außer Kraft. Die dokumentierte Bewertung benennt die anwendbare Pflicht und daraus folgende Korrektur- oder Durchsetzungsmaßnahmen.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No applicable legal or regulatory obligation can credibly be affected by this asset/scenario pair. Document the scope and basis; uncertainty about obligations is not N/A.',
                    de: 'Durch dieses Asset/Szenario-Paar kann plausibel keine anwendbare gesetzliche oder regulatorische Pflicht betroffen sein. Umfang und Grundlage dokumentieren; unklare Pflichten bedeuten nicht N/A.',
                  },
                  example: {
                    en: 'A separate decorative demonstration theme has no role in the delivered product, required information or personal-data processing, as documented in the assessment.',
                    de: 'Ein getrenntes dekoratives Demonstrationsdesign hat laut dokumentierter Bewertung keine Rolle im ausgelieferten Produkt, in erforderlichen Informationen oder in der Verarbeitung personenbezogener Daten.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A limited compliance issue with minor consequences that can be corrected through routine action. The applicable obligation and expected consequence must support this rating.',
                    de: 'Begrenzte Abweichung mit geringen Folgen, die durch Routinekorrektur behoben werden kann. Anwendbare Pflicht und erwartete Folge müssen diese Einstufung tragen.',
                  },
                  example: {
                    en: 'A minor error in required product information needs routine correction, with no substantial further consequences established for the applicable obligation.',
                    de: 'Ein kleiner Fehler in erforderlichen Produktinformationen benötigt eine Routinekorrektur; nach der anwendbaren Pflicht werden keine erheblichen weiteren Folgen festgestellt.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A material but contained failure to meet an applicable obligation requires formal corrective action or creates significant liability. Assess the actual obligation, rather than assuming every breach has the same consequence.',
                    de: 'Wesentliche, aber begrenzte Nichterfüllung einer anwendbaren Pflicht erfordert formelle Korrekturmaßnahmen oder begründet erhebliche Haftung. Die konkrete Pflicht bewerten, statt jede Verletzung gleich einzustufen.',
                  },
                  example: {
                    en: 'Improper handling of one customer’s application records leads to a substantiated complaint and a formal corrective process.',
                    de: 'Fehlerhafter Umgang mit Anwendungsdaten eines Kunden führt zu einer begründeten Beschwerde und einem formellen Korrekturverfahren.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Severe consequences under the applicable obligations, potentially including restrictions on supply, a mandatory recall, major penalties or serious liability. State the basis for these consequences; they are not automatic.',
                    de: 'Schwere Folgen nach den anwendbaren Pflichten, möglicherweise einschließlich Bereitstellungsbeschränkungen, verpflichtendem Rückruf, erheblichen Sanktionen oder schwerwiegender Haftung. Die Grundlage dieser Folgen angeben; sie treten nicht automatisch ein.',
                  },
                  example: {
                    en: 'A defect undermines a required security function across a delivered product range; the documented legal assessment identifies a mandatory recall or restriction on further supply.',
                    de: 'Ein Defekt untergräbt eine erforderliche Sicherheitsfunktion einer ausgelieferten Produktreihe; die dokumentierte rechtliche Bewertung ergibt einen verpflichtenden Rückruf oder eine Beschränkung weiterer Bereitstellung.',
                  },
                },
              ],
            },
          ],
        },
      ],
      intro: {
        en: 'Describe the outcome for users, operators, customers and the manufacturer. Products may cause physical harm, financial loss, operational disruption, loss of privacy/data or legal consequences, depending on their use and dependencies. One incident may affect several scenarios; rate each consequence separately. A malicious update or forged command is a cause, while injury, disclosure or loss of service is the damage to assess.',
        de: 'Die Folge für Nutzer, Betreiber, Kunden und Hersteller beschreiben. Je nach Nutzung und Abhängigkeiten können Produkte körperliche Schäden, finanzielle Verluste, Betriebsstörungen, Verlust von Privatsphäre/Daten oder rechtliche Folgen verursachen. Ein Vorfall kann mehrere Szenarien betreffen; jede Folge getrennt bewerten. Ein schädliches Update oder gefälschter Befehl ist eine Ursache; Verletzung, Offenlegung oder Dienstausfall ist der zu bewertende Schaden.',
      },
    },
    {
      id: 'damage-matrix',
      title: {
        en: 'Damage Scenarios → Impact matrix',
        de: 'Schadensszenarien → Auswirkungsmatrix',
      },
      fields: [
        {
          id: 'damage-rating',
          label: {
            en: 'Impact rating per asset and scenario',
            de: 'Auswirkungsbewertung je Asset und Szenario',
          },
          kind: 'recommended',
          help: {
            en: 'Select the consequence severity for this specific asset/scenario pair. Ratings feed only risks assigned to that asset and linked to that scenario.',
            de: 'Die Schwere der Folgen für dieses Asset/Szenario-Paar wählen. Die Bewertung fließt in Risiken dieses Assets mit dem verknüpften Szenario ein.',
          },
          values: {
            en: 'Rate the credible consequence for this asset and this scenario, not how likely an attack is. Use the highest applicable consequence within the scenario. Apply the same agreed assumptions and thresholds across assets.',
            de: 'Bewerten Sie die plausible Folge für dieses Asset und dieses Szenario, nicht die Angriffswahrscheinlichkeit. Verwenden Sie die höchste zutreffende Folge innerhalb des Szenarios. Nutzen Sie für alle Assets dieselben vereinbarten Annahmen und Grenzwerte.',
          },
          example: {
            en: 'Compare a single affected device or application with a shared component used across many products. Agree limits for outages, recovery effort, financial loss, injury severity and data sensitivity. Record effective alternatives and the maximum tolerable outage.',
            de: 'Ein einzelnes betroffenes Gerät oder eine Anwendung mit einer produktübergreifend genutzten Komponente vergleichen. Grenzen für Ausfälle, Wiederherstellungsaufwand, finanzielle Verluste, Verletzungsschwere und Datensensibilität vereinbaren. Wirksame Ersatzlösungen und die maximal tolerierbare Ausfallzeit festhalten.',
          },
          interpretations: [
            {
              value: 'N/A',
              meaning: {
                en: 'Not applicable: this asset cannot credibly cause the specific damage in the assessed context. Do not use it for low impact or uncertainty. An untouched cell also displays N/A; record an explicit justification.',
                de: 'Nicht anwendbar: Dieses Asset kann den konkreten Schaden im bewerteten Kontext plausibel nicht verursachen. Nicht für geringe Folgen oder Unsicherheit verwenden. Auch eine unberührte Zelle zeigt N/A; ausdrücklich begründen.',
              },
              example: {
                en: 'An isolated copy of public product information has no path to physical harm; document that it is not used for operating or maintaining equipment.',
                de: 'Eine isolierte Kopie öffentlicher Produktinformationen hat keinen Weg zu körperlichen Schäden; dokumentieren, dass sie nicht zur Bedienung oder Wartung von Geräten verwendet wird.',
              },
            },
            {
              value: '1',
              meaning: {
                en: 'Low — limited, local harm handled through routine work or an effective alternative, without substantial impairment of required operation or sensitive information.',
                de: 'Gering — begrenzter, lokaler Schaden, durch Routinearbeit oder wirksame Ersatzlösung beherrschbar, ohne erhebliche Beeinträchtigung erforderlichen Betriebs oder sensibler Informationen.',
              },
              example: {
                en: 'An optional report is unavailable while the main application or device continues operating normally.',
                de: 'Ein optionaler Bericht ist nicht verfügbar, während die Hauptanwendung oder das Gerät normal weiterarbeitet.',
              },
            },
            {
              value: '2',
              meaning: {
                en: 'Medium — substantial but contained harm to people, operations, data or finances, requiring deliberate recovery or corrective action.',
                de: 'Mittel — erheblicher, aber begrenzter Schaden für Personen, Betrieb, Daten oder Finanzen; gezielte Wiederherstellung oder Korrekturmaßnahmen sind erforderlich.',
              },
              example: {
                en: 'A corrupted configuration interrupts one customer workflow and requires restoration and rework, while a limited alternative contains the disruption.',
                de: 'Eine beschädigte Konfiguration unterbricht einen Kundenablauf und erfordert Wiederherstellung und Nacharbeit; eine begrenzte Ersatzlösung begrenzt die Störung.',
              },
            },
            {
              value: '3',
              meaning: {
                en: 'High — severe harm, widespread disruption or consequences that are difficult to reverse. The seriousness of the outcome, not asset type or count alone, determines the rating.',
                de: 'Hoch — schwerer Schaden, weitreichende Störung oder schwer rückgängig zu machende Folgen. Die Schwere der Folge bestimmt die Stufe, nicht allein Asset-Typ oder Anzahl.',
              },
              example: {
                en: 'A compromised shared component exposes critical credentials, disables essential services or causes dangerous device behaviour. Apply the relevant scenario’s criteria to each outcome.',
                de: 'Eine kompromittierte gemeinsame Komponente legt kritische Zugangsdaten offen, deaktiviert wesentliche Dienste oder verursacht gefährliches Geräteverhalten. Auf jede Folge die Kriterien des passenden Szenarios anwenden.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Rate each asset against each damage scenario in its intended system context. I/II/III describe protection need; Low/Medium/High describe a particular harmful outcome, so do not copy the labels mechanically. Consider affected users, data, physical processes, dependent applications, deployment scope and recovery options. Shared libraries, gateways and management services can spread consequences across products; isolation and independent operation may limit them. A small deployment can still have severe consequences. Use the highest credible outcome within each scenario and record the assumptions and company thresholds.',
        de: 'Jedes Asset gegen jedes Schadensszenario im vorgesehenen Systemkontext bewerten. I/II/III beschreiben Schutzbedarf; Gering/Mittel/Hoch beschreiben eine konkrete schädliche Folge. Die Stufen nicht schematisch übertragen. Betroffene Nutzer, Daten, physische Prozesse, abhängige Anwendungen, Einsatzumfang und Wiederherstellungsmöglichkeiten berücksichtigen. Gemeinsame Bibliotheken, Gateways und Verwaltungsdienste können Folgen produktübergreifend verbreiten; Isolation und unabhängiger Betrieb können sie begrenzen. Auch ein kleiner Einsatzumfang kann schwere Folgen haben. Innerhalb jedes Szenarios die höchste plausible Folge verwenden und Annahmen sowie Unternehmensgrenzen dokumentieren.',
      },
    },
    {
      id: 'damage-comment',
      title: {
        en: 'Damage Scenarios → Cell comment (…)',
        de: 'Schadensszenarien → Zellenkommentar (…)',
      },
      fields: [
        {
          id: 'damage-comment',
          label: {
            en: 'Comment for each matrix cell',
            de: 'Kommentar je Matrixzelle',
          },
          kind: 'required',
          help: {
            en: 'Explain the selected impact, assumptions and supporting evidence. Use the … button.',
            de: 'Gewählte Auswirkung, Annahmen und Nachweise begründen. Über die Schaltfläche … öffnen.',
          },
          values: {
            en: 'Required for every asset/scenario pair, including N/A. Missing comments prevent PDF export.',
            de: 'Für jedes Asset/Szenario-Paar einschließlich N/A erforderlich. Fehlende Kommentare verhindern den PDF-Export.',
          },
          example: {
            en: 'Medium for DS3: one department loses an application workflow after a component fails. A manual alternative remains usable and backup restoration fits the agreed recovery period. Record affected dependencies, evidence and unverified assumptions.',
            de: 'Mittel bei DS3: Nach Ausfall einer Komponente verliert eine Abteilung einen Anwendungsablauf. Eine manuelle Alternative bleibt nutzbar; Wiederherstellung aus Sicherung liegt innerhalb der vereinbarten Frist. Betroffene Abhängigkeiten, Nachweise und ungeprüfte Annahmen festhalten.',
          },
        },
      ],
    },
    {
      id: 'risk',
      title: {
        en: 'Risk Analysis → Add / Edit Risk',
        de: 'Risikoanalyse → Risiko hinzufügen / bearbeiten',
      },
      fields: [
        {
          id: 'risk-asset',
          label: {
            en: 'Assigned asset',
            de: 'Zugeordnetes Asset',
          },
          kind: 'required',
          help: {
            en: 'Select the single asset targeted by this risk. Every path in the risk uses this asset’s matrix ratings.',
            de: 'Das einzelne Asset auswählen, auf das sich das Risiko bezieht. Alle Pfade verwenden dessen Matrixbewertungen.',
          },
          values: {
            en: 'One existing asset; required to save.',
            de: 'Ein vorhandenes Asset; zum Speichern erforderlich.',
          },
          example: {
            en: 'A01: network interface or shared update component.',
            de: 'A01: Netzwerkschnittstelle oder gemeinsame Update-Komponente.',
          },
        },
        {
          id: 'risk-root',
          label: {
            en: 'Attack goal / root',
            de: 'Angriffsziel / Root',
          },
          kind: 'required',
          help: {
            en: 'Name the attacker’s intended outcome.',
            de: 'Das beabsichtigte Ergebnis des Angreifers benennen.',
          },
          values: {
            en: 'Required free text. Risk IDs are generated automatically.',
            de: 'Pflichtfreitext. Risiko-IDs werden automatisch erzeugt.',
          },
          example: {
            en: 'Execute unauthorized code in a product or gain access to protected customer records.',
            de: 'Unbefugten Code in einem Produkt ausführen oder Zugriff auf geschützte Kundendaten erlangen.',
          },
        },
        {
          id: 'risk-path',
          label: {
            en: 'Attack paths and intermediate paths',
            de: 'Angriffspfade und Zwischenpfade',
          },
          kind: 'recommended',
          help: {
            en: 'Describe how an attacker can reach the goal. Add intermediate steps where useful.',
            de: 'Beschreiben, wie ein Angreifer das Ziel erreichen kann. Bei Bedarf Zwischenschritte anlegen.',
          },
          values: {
            en: 'Free-text path titles in a nested tree. Paths are not AND/OR probability gates; summaries use worst-case values.',
            de: 'Freitexttitel in einem verschachtelten Baum. Pfade sind keine UND/ODER-Wahrscheinlichkeitsgatter; Zusammenfassungen verwenden ungünstigste Werte.',
          },
          example: {
            en: 'Reach a network endpoint → exploit an input-validation flaw → execute code in the application.',
            de: 'Netzwerk-Endpunkt erreichen → Fehler der Eingabeprüfung ausnutzen → Code in der Anwendung ausführen.',
          },
        },
        {
          id: 'risk-impact',
          label: {
            en: 'Impact / leaf text',
            de: 'Auswirkung / Blatttext',
          },
          kind: 'recommended',
          help: {
            en: 'Describe the concrete adverse result at the end of the path.',
            de: 'Die konkrete negative Folge am Ende des Pfads beschreiben.',
          },
          values: {
            en: 'Free text. Up to 10 impact leaves per node.',
            de: 'Freitext. Bis zu 10 Auswirkungsblätter je Knoten.',
          },
          example: {
            en: 'The affected device or application can no longer perform its required function.',
            de: 'Das betroffene Gerät oder die Anwendung kann die erforderliche Funktion nicht mehr ausführen.',
          },
        },
        {
          id: 'risk-scenarios',
          label: {
            en: 'Linked damage scenarios',
            de: 'Verknüpfte Schadensszenarien',
          },
          kind: 'conditional',
          help: {
            en: 'Tick every scenario relevant to this leaf. The editor shows the selected asset’s original matrix ratings.',
            de: 'Alle für dieses Blatt relevanten Szenarien auswählen. Der Editor zeigt die ursprünglichen Matrixbewertungen des ausgewählten Assets.',
          },
          values: {
            en: 'Zero or more scenario checkboxes; at least one applicable numeric rating is needed for a calculated impact. N/A contributes no severity and is not a low rating.',
            de: 'Null oder mehr Szenarien; mindestens eine anwendbare numerische Bewertung wird für die Auswirkungsberechnung benötigt. N/A trägt keine Schwere bei und ist keine niedrige Bewertung.',
          },
          example: {
            en: 'Link DS3 for loss of operation and DS2 for the financial consequence.',
            de: 'DS3 für Betriebsausfall und DS2 für finanzielle Folgen verknüpfen.',
          },
          valueSource: 'scenarios',
        },
        {
          id: 'risk-K',
          label: {
            en: 'K — Knowledge / complexity',
            de: 'K — Wissen / Komplexität',
          },
          kind: 'conditional',
          help: {
            en: 'Choose the knowledge or discovery effort available to the attacker. Larger numbers increase the feasibility score; these are scoring factors, not percentages.',
            de: 'Erforderliches Wissen bzw. Rechercheaufwand des Angreifers bewerten. Größere Werte erhöhen den Durchführbarkeitswert; es sind Bewertungsfaktoren, keine Prozentwerte.',
          },
          values: {
            en: 'Choose one configured value per leaf. Blank means not assessed. These same options are used for residual reassessment.',
            de: 'Je Blatt einen konfigurierten Wert wählen. Leer bedeutet nicht bewertet. Dieselben Optionen gelten für die Restrisikobewertung.',
          },
          example: {
            en: 'A published vulnerability with clear reproduction steps versus specialist proprietary knowledge.',
            de: 'Veröffentlichte Schwachstelle mit klarer Anleitung gegenüber proprietärem Spezialwissen.',
          },
          valueSource: 'probability.K',
        },
        {
          id: 'risk-S',
          label: {
            en: 'S — Scaling',
            de: 'S — Skalierung',
          },
          kind: 'conditional',
          help: {
            en: 'Choose the scope in which the attack can propagate or be repeated. Larger numbers increase the feasibility score; these are scoring factors, not percentages.',
            de: 'Den Bereich bewerten, in dem sich ein Angriff ausbreiten oder wiederholen lässt. Größere Werte erhöhen den Durchführbarkeitswert; es sind Bewertungsfaktoren, keine Prozentwerte.',
          },
          values: {
            en: 'Choose one configured value per leaf. Blank means not assessed. These same options are used for residual reassessment.',
            de: 'Je Blatt einen konfigurierten Wert wählen. Leer bedeutet nicht bewertet. Dieselben Optionen gelten für die Restrisikobewertung.',
          },
          example: {
            en: 'Single device (0.1): the attack is limited to one device. Product series (0.3): the attack can be repeated across devices in one product series. Complete portfolio (0.5): the attack can be repeated across the entire product portfolio.',
            de: 'Einzelgerät (0,1): Der Angriff ist auf ein Gerät begrenzt. Produktserie (0,3): Der Angriff lässt sich auf Geräte einer Produktserie übertragen. Gesamtes Portfolio (0,5): Der Angriff lässt sich auf das gesamte Produktportfolio übertragen.',
          },
          valueSource: 'probability.S',
        },
        {
          id: 'risk-T',
          label: {
            en: 'T — Time / effort',
            de: 'T — Zeit / Aufwand',
          },
          kind: 'conditional',
          help: {
            en: 'Estimate the effort needed to prepare and execute the attack in the stated conditions. Larger numbers increase the feasibility score; these are scoring factors, not percentages.',
            de: 'Aufwand zur Vorbereitung und Durchführung unter den angegebenen Bedingungen schätzen. Größere Werte erhöhen den Durchführbarkeitswert; es sind Bewertungsfaktoren, keine Prozentwerte.',
          },
          values: {
            en: 'Choose one configured value per leaf. Blank means not assessed. These same options are used for residual reassessment.',
            de: 'Je Blatt einen konfigurierten Wert wählen. Leer bedeutet nicht bewertet. Dieselben Optionen gelten für die Restrisikobewertung.',
          },
          example: {
            en: 'Days for an existing exploit versus months for specialist research.',
            de: 'Tage für einen vorhandenen Exploit gegenüber Monaten für Spezialforschung.',
          },
          valueSource: 'probability.T',
        },
        {
          id: 'risk-U',
          label: {
            en: 'U — Attacker benefit / utility',
            de: 'U — Angreifernutzen',
          },
          kind: 'conditional',
          help: {
            en: 'Assess the visible incentive or benefit for an attacker. Larger numbers increase the feasibility score; these are scoring factors, not percentages.',
            de: 'Erkennbaren Anreiz bzw. Nutzen für den Angreifer bewerten. Größere Werte erhöhen den Durchführbarkeitswert; es sind Bewertungsfaktoren, keine Prozentwerte.',
          },
          values: {
            en: 'Choose one configured value per leaf. Blank means not assessed. These same options are used for residual reassessment.',
            de: 'Je Blatt einen konfigurierten Wert wählen. Leer bedeutet nicht bewertet. Dieselben Optionen gelten für die Restrisikobewertung.',
          },
          example: {
            en: 'Valuable proprietary data may provide more incentive than an isolated nuisance.',
            de: 'Wertvolles Unternehmenswissen kann mehr Anreiz bieten als eine isolierte Störung.',
          },
          valueSource: 'probability.U',
        },
      ],
    },
    {
      id: 'risk-node-notes',
      title: {
        en: 'Risk Analysis → Path / impact note window',
        de: 'Risikoanalyse → Notizfenster für Pfad / Auswirkung',
      },
      fields: [
        {
          id: 'risk-node-notes',
          label: {
            en: 'Path / impact notes',
            de: 'Pfad- / Auswirkungsnotizen',
          },
          kind: 'optional',
          help: {
            en: 'Use the note icon on the relevant node or leaf for local reasoning.',
            de: 'Notizsymbol am betreffenden Knoten oder Blatt für lokale Begründungen nutzen.',
          },
          values: {
            en: 'Optional free text, distinct from the whole-risk note.',
            de: 'Optionaler Freitext, getrennt von der Gesamtrisikonotiz.',
          },
          example: {
            en: 'Physical access is required for this step.',
            de: 'Dieser Schritt erfordert physischen Zugang.',
          },
        },
      ],
    },
    {
      id: 'risk-notes',
      title: {
        en: 'Risk Analysis → Whole-risk note window',
        de: 'Risikoanalyse → Notizfenster für das gesamte Risiko',
      },
      fields: [
        {
          id: 'risk-notes',
          label: {
            en: 'Risk notes',
            de: 'Risikonotizen',
          },
          kind: 'optional',
          help: {
            en: 'Use the saved risk’s note button for scope, assumptions and evidence applying to the whole risk.',
            de: 'Über die Notizschaltfläche des gespeicherten Risikos Geltungsbereich, Annahmen und Nachweise für das Gesamtrisiko erfassen.',
          },
          values: {
            en: 'Optional free text.',
            de: 'Optionaler Freitext.',
          },
          example: {
            en: 'Assessment assumes the product is connected to the customer network.',
            de: 'Bewertung setzt eine Verbindung zum Kundennetz voraus.',
          },
        },
      ],
    },
    {
      id: 'lifecycle',
      title: {
        en: 'Risk Lifecycle → Phase assignment',
        de: 'Risiko-Lebenszyklus → Phasenzuordnung',
      },
      fields: [
        {
          id: 'lifecycle-phases',
          label: {
            en: 'Relevant phases',
            de: 'Relevante Phasen',
          },
          kind: 'optional',
          help: {
            en: 'Select every phase in which the risk matters most. This classifies the risk without changing its score.',
            de: 'Alle Phasen auswählen, in denen das Risiko besonders relevant ist. Die Zuordnung verändert den Risikowert nicht.',
          },
          values: {
            en: 'Multiple selection; none is shown as not assigned.',
            de: 'Mehrfachauswahl; ohne Auswahl als nicht zugeordnet angezeigt.',
          },
          example: {
            en: 'Software signing and dependency risks can concern development, production and maintenance.',
            de: 'Risiken der Softwaresignierung und von Abhängigkeiten können Entwicklung, Produktion und Wartung betreffen.',
          },
          valueSource: 'phases',
        },
        {
          id: 'lifecycle-custom',
          label: {
            en: 'Custom phase name',
            de: 'Name der eigenen Phase',
          },
          kind: 'conditional',
          help: {
            en: 'Name an organisation-specific phase when Custom phase is selected.',
            de: 'Bei Auswahl einer eigenen Phase deren unternehmensspezifischen Namen eingeben.',
          },
          values: {
            en: 'Free text. An unnamed custom phase does not count as an assigned named phase.',
            de: 'Freitext. Eine unbenannte eigene Phase zählt nicht als benannte zugeordnete Phase.',
          },
          example: {
            en: 'Refurbishment; customer acceptance.',
            de: 'Wiederaufbereitung; Kundenabnahme.',
          },
        },
        {
          id: 'lifecycle-notes',
          label: {
            en: 'Reason / notes',
            de: 'Begründung / Anmerkungen',
          },
          kind: 'optional',
          help: {
            en: 'Explain why the selected phases are relevant.',
            de: 'Die Relevanz der ausgewählten Phasen erläutern.',
          },
          values: {
            en: 'Optional free text.',
            de: 'Optionaler Freitext.',
          },
          example: {
            en: 'Maintenance updates replace application code or embedded firmware and may affect dependent products.',
            de: 'Wartungsupdates ersetzen Anwendungscode oder eingebettete Firmware und können abhängige Produkte beeinflussen.',
          },
        },
      ],
    },
    {
      id: 'goals',
      title: {
        en: 'Security Goals → Add / Edit Goal',
        de: 'Security-Ziele → Ziel hinzufügen / bearbeiten',
      },
      fields: [
        {
          id: 'goal-name',
          label: {
            en: 'Goal name',
            de: 'Zielname',
          },
          kind: 'required',
          help: {
            en: 'State the security outcome to achieve.',
            de: 'Das zu erreichende Sicherheitsziel benennen.',
          },
          values: {
            en: 'Required free text. Goal IDs are generated automatically.',
            de: 'Pflichtfreitext. Ziel-IDs werden automatisch erzeugt.',
          },
          example: {
            en: 'Only authorized software or firmware updates can be installed.',
            de: 'Nur autorisierte Software- oder Firmware-Updates können installiert werden.',
          },
        },
        {
          id: 'goal-description',
          label: {
            en: 'Goal description',
            de: 'Zielbeschreibung',
          },
          kind: 'optional',
          help: {
            en: 'Describe expected behaviour, scope and acceptance evidence.',
            de: 'Erwartetes Verhalten, Geltungsbereich und Abnahmenachweise beschreiben.',
          },
          values: {
            en: 'Optional free text.',
            de: 'Optionaler Freitext.',
          },
          example: {
            en: 'Reject unsigned or altered update packages and record the rejection.',
            de: 'Unsignierte oder veränderte Updatepakete ablehnen und die Ablehnung protokollieren.',
          },
        },
        {
          id: 'goal-risks',
          label: {
            en: 'Referenced risks / roots',
            de: 'Referenzierte Risiken / Roots',
          },
          kind: 'optional',
          help: {
            en: 'Link the goal to every risk it addresses. Residual Risk edits the same relationships.',
            de: 'Das Ziel mit allen adressierten Risiken verknüpfen. Restrisiko bearbeitet dieselben Beziehungen.',
          },
          values: {
            en: 'Zero or more existing risks via checkboxes.',
            de: 'Null oder mehr vorhandene Risiken per Checkbox.',
          },
          example: {
            en: 'One update-authenticity goal may address R01 and R03.',
            de: 'Ein Ziel zur Update-Authentizität kann R01 und R03 adressieren.',
          },
        },
      ],
    },
    {
      id: 'residual',
      title: {
        en: 'Residual Risk → Edit window',
        de: 'Restrisiko → Bearbeitungsfenster',
      },
      fields: [
        {
          id: 'residual-goals',
          label: {
            en: 'Linked security goals',
            de: 'Verknüpfte Security-Ziele',
          },
          kind: 'optional',
          help: {
            en: 'When at least one impact is Mitigated, select existing goals at the bottom of the editor. Create new goals in Security Goals first.',
            de: 'Wenn mindestens eine Auswirkung mitigiert ist, vorhandene Ziele unten im Bearbeitungsfenster auswählen. Neue Ziele zuerst unter Security-Ziele anlegen.',
          },
          values: {
            en: 'Zero, one or several goal checkboxes. Linking a goal alone does not lower the score.',
            de: 'Null, ein oder mehrere Ziele. Die Verknüpfung allein senkt den Risikowert nicht.',
          },
          example: {
            en: 'Link update authenticity, restricted administration and protection of sensitive records.',
            de: 'Update-Authentizität, eingeschränkte Administration und Schutz sensibler Datensätze verknüpfen.',
          },
        },
        {
          id: 'residual-treatment',
          label: {
            en: 'Treatment per impact leaf',
            de: 'Behandlung je Auswirkungsblatt',
          },
          kind: 'conditional',
          help: {
            en: 'Record how this specific part of the risk is handled.',
            de: 'Festlegen, wie dieser konkrete Teil des Risikos behandelt wird.',
          },
          values: {
            en: 'Accepted: retain the risk with a rationale. Delegated: assign handling to another party and explain responsibilities. Mitigated: implement a measure and reassess K/S/T/U. Blank: not decided. Acceptance or delegation does not automatically lower the score.',
            de: 'Akzeptiert: Risiko mit Begründung beibehalten. Delegiert: Behandlung einer anderen Partei zuordnen und Verantwortung erläutern. Mitigiert: Maßnahme umsetzen und K/S/T/U neu bewerten. Leer: nicht entschieden. Akzeptanz oder Delegation senkt den Wert nicht automatisch.',
          },
          example: {
            en: 'Accepted with documented owner approval; delegated to the integrator; mitigated by authenticated updates.',
            de: 'Mit dokumentierter Freigabe akzeptiert; an Integrator delegiert; durch authentifizierte Updates mitigiert.',
          },
          valueSource: 'treatments',
        },
        {
          id: 'residual-note',
          label: {
            en: 'Notes (shared with overview)',
            de: 'Anmerkungen (gemeinsam mit Übersicht)',
          },
          kind: 'conditional',
          help: {
            en: 'Enter treatment decisions, evidence and remaining limitations for this risk. This is the same Notes field as in the overview. Editing either view updates the other; all impact rows share this note.',
            de: 'Behandlungsentscheidungen, Nachweise und verbleibende Einschränkungen für dieses Risiko eingeben. Dasselbe Feld Anmerkungen wird in der Übersicht verwendet. Änderungen aktualisieren beide Ansichten; alle Auswirkungszeilen teilen diese Notiz.',
          },
          values: {
            en: 'Required for completion if any impact is Accepted or Delegated, or if the remaining risk is High or Critical; otherwise optional.',
            de: 'Für die Vollständigkeit erforderlich, wenn eine Auswirkung akzeptiert oder delegiert ist oder das Restrisiko hoch oder kritisch bleibt; sonst optional.',
          },
          example: {
            en: 'Integrator contract assigns network isolation; reference the agreement and owner.',
            de: 'Integratorenvertrag weist Netztrennung zu; Vereinbarung und Verantwortlichen nennen.',
          },
        },
        {
          id: 'residual-measure',
          label: {
            en: 'Detailed Control Measure',
            de: 'Detaillierte Kontrollmaßnahme',
          },
          kind: 'conditional',
          help: {
            en: 'Describe the concrete control, its scope and verification evidence.',
            de: 'Konkrete Maßnahme, Geltungsbereich und Prüfnachweise beschreiben.',
          },
          values: {
            en: 'Required for a complete Mitigated leaf; optional otherwise.',
            de: 'Für ein vollständiges mitigiertes Blatt erforderlich; sonst optional.',
          },
          example: {
            en: 'Verify signed updates before installation; negative tests reject altered packages.',
            de: 'Signierte Updates vor Installation prüfen; Negativtests weisen veränderte Pakete zurück.',
          },
        },
        {
          id: 'residual-requirement-link',
          label: {
            en: 'Link to requirement',
            de: 'Link zur Anforderung',
          },
          kind: 'optional',
          help: {
            en: 'Reference the requirement addressed by this Detailed Control Measure. Enter it in the small field beneath the measure.',
            de: 'Die durch diese detaillierte Kontrollmaßnahme adressierte Anforderung referenzieren. Das kleine Feld unter der Maßnahme verwenden.',
          },
          values: {
            en: 'Optional URL or requirement ID per impact, editable when Mitigated. The reference is shared across display languages and included in the PDF. It does not affect scores or completion.',
            de: 'Optionale URL oder Anforderungs-ID je Auswirkung, bei Mitigiert editierbar. Die Referenz gilt für beide Anzeigesprachen und wird ins PDF übernommen. Sie beeinflusst weder Bewertung noch Vollständigkeit.',
          },
          example: {
            en: 'REQ-SEC-012 or https://requirements.example.com/REQ-SEC-012',
            de: 'REQ-SEC-012 oder https://requirements.example.com/REQ-SEC-012',
          },
        },
        {
          id: 'residual-K',
          label: {
            en: 'Residual K',
            de: 'Restrisiko K',
          },
          kind: 'conditional',
          help: {
            en: 'Reassess this factor after the mitigation using the same meanings as in Risk Analysis.',
            de: 'Diesen Faktor nach der Mitigation mit denselben Bedeutungen wie in der Risikoanalyse neu bewerten.',
          },
          values: {
            en: 'Shown for Mitigated. All four factors are required for completion. Until a factor is filled, the residual calculation falls back to its original value.',
            de: 'Bei Mitigiert sichtbar. Alle vier Faktoren sind zur Vervollständigung erforderlich. Solange ein Faktor fehlt, verwendet die Restrisikoberechnung dessen ursprünglichen Wert.',
          },
          example: {
            en: 'Explain which part of the measure changes this factor; do not reduce it merely because a measure was entered.',
            de: 'Begründen, welcher Teil der Maßnahme diesen Faktor verändert; nicht allein wegen einer eingetragenen Maßnahme reduzieren.',
          },
          valueSource: 'probability.K',
        },
        {
          id: 'residual-S',
          label: {
            en: 'Residual S',
            de: 'Restrisiko S',
          },
          kind: 'conditional',
          help: {
            en: 'Reassess this factor after the mitigation using the same meanings as in Risk Analysis.',
            de: 'Diesen Faktor nach der Mitigation mit denselben Bedeutungen wie in der Risikoanalyse neu bewerten.',
          },
          values: {
            en: 'Shown for Mitigated. All four factors are required for completion. Until a factor is filled, the residual calculation falls back to its original value.',
            de: 'Bei Mitigiert sichtbar. Alle vier Faktoren sind zur Vervollständigung erforderlich. Solange ein Faktor fehlt, verwendet die Restrisikoberechnung dessen ursprünglichen Wert.',
          },
          example: {
            en: 'Explain which part of the measure changes this factor; do not reduce it merely because a measure was entered.',
            de: 'Begründen, welcher Teil der Maßnahme diesen Faktor verändert; nicht allein wegen einer eingetragenen Maßnahme reduzieren.',
          },
          valueSource: 'probability.S',
        },
        {
          id: 'residual-T',
          label: {
            en: 'Residual T',
            de: 'Restrisiko T',
          },
          kind: 'conditional',
          help: {
            en: 'Reassess this factor after the mitigation using the same meanings as in Risk Analysis.',
            de: 'Diesen Faktor nach der Mitigation mit denselben Bedeutungen wie in der Risikoanalyse neu bewerten.',
          },
          values: {
            en: 'Shown for Mitigated. All four factors are required for completion. Until a factor is filled, the residual calculation falls back to its original value.',
            de: 'Bei Mitigiert sichtbar. Alle vier Faktoren sind zur Vervollständigung erforderlich. Solange ein Faktor fehlt, verwendet die Restrisikoberechnung dessen ursprünglichen Wert.',
          },
          example: {
            en: 'Explain which part of the measure changes this factor; do not reduce it merely because a measure was entered.',
            de: 'Begründen, welcher Teil der Maßnahme diesen Faktor verändert; nicht allein wegen einer eingetragenen Maßnahme reduzieren.',
          },
          valueSource: 'probability.T',
        },
        {
          id: 'residual-U',
          label: {
            en: 'Residual U',
            de: 'Restrisiko U',
          },
          kind: 'conditional',
          help: {
            en: 'Reassess this factor after the mitigation using the same meanings as in Risk Analysis.',
            de: 'Diesen Faktor nach der Mitigation mit denselben Bedeutungen wie in der Risikoanalyse neu bewerten.',
          },
          values: {
            en: 'Shown for Mitigated. All four factors are required for completion. Until a factor is filled, the residual calculation falls back to its original value.',
            de: 'Bei Mitigiert sichtbar. Alle vier Faktoren sind zur Vervollständigung erforderlich. Solange ein Faktor fehlt, verwendet die Restrisikoberechnung dessen ursprünglichen Wert.',
          },
          example: {
            en: 'Explain which part of the measure changes this factor; do not reduce it merely because a measure was entered.',
            de: 'Begründen, welcher Teil der Maßnahme diesen Faktor verändert; nicht allein wegen einer eingetragenen Maßnahme reduzieren.',
          },
          valueSource: 'probability.U',
        },
      ],
    },
    {
      id: 'residual-review',
      title: {
        en: 'Residual Risk → Risk card review',
        de: 'Restrisiko → Prüfung auf der Risikokarte',
      },
      fields: [
        {
          id: 'residual-risk-note',
          label: {
            en: 'Notes (shared with editor)',
            de: 'Anmerkungen (gemeinsam mit Bearbeitungsfenster)',
          },
          kind: 'conditional',
          help: {
            en: 'The same Notes value as in the residual-risk editor. Record treatment decisions, supporting evidence and remaining limitations here or in the editor; changes are shared.',
            de: 'Derselbe Wert Anmerkungen wie im Restrisiko-Bearbeitungsfenster. Behandlungsentscheidungen, Nachweise und verbleibende Einschränkungen hier oder im Bearbeitungsfenster dokumentieren; Änderungen werden geteilt.',
          },
          values: {
            en: 'Required for completion if any impact is Accepted or Delegated, or if the remaining risk is High or Critical; otherwise optional.',
            de: 'Für die Vollständigkeit erforderlich, wenn eine Auswirkung akzeptiert oder delegiert ist oder das Restrisiko hoch oder kritisch bleibt; sonst optional.',
          },
          example: {
            en: 'Remaining exposure requires owner approval and a time-limited remediation plan.',
            de: 'Verbleibende Exposition erfordert Freigabe und zeitlich begrenzten Behebungsplan.',
          },
        },
        {
          id: 'residual-evaluated',
          label: {
            en: 'Mark as evaluated',
            de: 'Als bewertet markieren',
          },
          kind: 'optional',
          help: {
            en: 'Indicate that the risk has been reviewed. This is a manual review status, separate from automatic field-completeness checks.',
            de: 'Kennzeichnen, dass das Risiko geprüft wurde. Manueller Prüfstatus, getrennt von automatischer Feldvollständigkeit.',
          },
          values: {
            en: 'Unchecked = not evaluated; checked = evaluated. Does not change the score or guarantee that every required field is filled.',
            de: 'Nicht angehakt = nicht bewertet; angehakt = bewertet. Ändert den Wert nicht und garantiert keine vollständigen Pflichtfelder.',
          },
          example: {
            en: 'Tick after reviewing treatments, goals, evidence and residual values.',
            de: 'Nach Prüfung von Behandlung, Zielen, Nachweisen und Restrisikowerten markieren.',
          },
        },
      ],
    },
    {
      id: 'security-targets',
      title: {
        en: 'Settings → SL-T targets',
        de: 'Einstellungen → SL-T-Ziele',
      },
      fields: [
        {
          id: 'sl-FR1',
          label: {
            en: 'SL-T FR1',
            de: 'SL-T FR1',
          },
          kind: 'optional',
          help: {
            en: 'Verify identities before access.',
            de: 'Identitäten vor Zugriff prüfen.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Unique accounts and device authentication.',
            de: 'Eindeutige Konten und Geräteauthentifizierung.',
          },
          valueSource: 'target.FR1',
        },
        {
          id: 'sl-FR2',
          label: {
            en: 'SL-T FR2',
            de: 'SL-T FR2',
          },
          kind: 'optional',
          help: {
            en: 'Control what authenticated identities may do.',
            de: 'Aktionen authentifizierter Identitäten steuern.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Role-based update permissions.',
            de: 'Rollenbasierte Updateberechtigungen.',
          },
          valueSource: 'target.FR2',
        },
        {
          id: 'sl-FR3',
          label: {
            en: 'SL-T FR3',
            de: 'SL-T FR3',
          },
          kind: 'optional',
          help: {
            en: 'Protect information and system operation against unauthorised changes.',
            de: 'Informationen und Systembetrieb vor unautorisierten Änderungen schützen.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Integrity checks on update packages.',
            de: 'Integritätsprüfung von Updatepaketen.',
          },
          valueSource: 'target.FR3',
        },
        {
          id: 'sl-FR4',
          label: {
            en: 'SL-T FR4',
            de: 'SL-T FR4',
          },
          kind: 'optional',
          help: {
            en: 'Protect information against unauthorised disclosure.',
            de: 'Informationen vor unautorisierter Offenlegung schützen.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Encryption for sensitive communications.',
            de: 'Verschlüsselung sensibler Kommunikation.',
          },
          valueSource: 'target.FR4',
        },
        {
          id: 'sl-FR5',
          label: {
            en: 'SL-T FR5',
            de: 'SL-T FR5',
          },
          kind: 'optional',
          help: {
            en: 'Limit unnecessary or unauthorised communication.',
            de: 'Unnötige oder unautorisierte Kommunikation begrenzen.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Network segmentation and allowlisted services.',
            de: 'Netzsegmentierung und erlaubte Dienste.',
          },
          valueSource: 'target.FR5',
        },
        {
          id: 'sl-FR6',
          label: {
            en: 'SL-T FR6',
            de: 'SL-T FR6',
          },
          kind: 'optional',
          help: {
            en: 'Detect and respond to security-relevant events.',
            de: 'Sicherheitsrelevante Ereignisse erkennen und darauf reagieren.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Audit logs, alerts and response procedures.',
            de: 'Prüfprotokolle, Alarme und Reaktionsverfahren.',
          },
          valueSource: 'target.FR6',
        },
        {
          id: 'sl-FR7',
          label: {
            en: 'SL-T FR7',
            de: 'SL-T FR7',
          },
          kind: 'optional',
          help: {
            en: 'Maintain essential resources and services.',
            de: 'Wesentliche Ressourcen und Dienste verfügbar halten.',
          },
          values: {
            en: 'Not set or 0–4. See SL-T value meanings above; no averaging across requirements.',
            de: 'Nicht festgelegt oder 0–4. Bedeutung siehe oben; keine Mittelwertbildung über Anforderungen.',
          },
          example: {
            en: 'Resource limits and recovery capability.',
            de: 'Ressourcenbegrenzung und Wiederherstellbarkeit.',
          },
          valueSource: 'target.FR7',
        },
      ],
      intro: {
        en: 'Not set = no target decision. 0 = explicit zero target, distinct from Not set. 1 = addresses accidental/casual violations. 2 = addresses intentional attacks with simple means, few resources and general skills. 3 = addresses sophisticated attacks with moderate resources and control-system skills. 4 = addresses sophisticated attacks with extensive resources, control-system skills and strong motivation. These short summaries are not a control-by-control assessment.',
        de: 'Nicht festgelegt = keine Zielentscheidung. 0 = explizites Nullziel, nicht gleich leer. 1 = unbeabsichtigte/beiläufige Verstöße. 2 = gezielte Angriffe mit einfachen Mitteln, geringen Ressourcen und allgemeinen Kenntnissen. 3 = anspruchsvolle Angriffe mit mittleren Ressourcen und Automatisierungskenntnissen. 4 = anspruchsvolle Angriffe mit umfangreichen Ressourcen, Automatisierungskenntnissen und hoher Motivation. Diese Kurzfassungen ersetzen keine anforderungsweise Prüfung.',
      },
    },
    {
      id: 'security-matrix',
      title: {
        en: 'Settings → Recommended SL-T matrix',
        de: 'Einstellungen → Matrix für empfohlenes SL-T',
      },
      fields: [
        {
          id: 'sl-feasibility',
          label: {
            en: 'Attack feasibility bands',
            de: 'Bänder der Angriffsdurchführbarkeit',
          },
          kind: 'required',
          help: {
            en: 'Enter three positive, strictly increasing upper boundaries. Four bands are created; an exact boundary belongs to the lower band.',
            de: 'Drei positive, streng steigende Obergrenzen eingeben. Es entstehen vier Bänder; ein exakter Grenzwert gehört zum niedrigeren Band.',
          },
          values: {
            en: 'Feasibility uses A = K + S + T + U. Impact uses normalized I. Values shown below are the active analysis settings, or starting defaults when unconfigured.',
            de: 'Durchführbarkeit verwendet A = K + S + T + U. Auswirkung verwendet normiertes I. Unten stehen die Einstellungen der aktiven Analyse oder unkonfigurierte Startwerte.',
          },
          example: {
            en: 'Choose bands aligned with the company assessment method.',
            de: 'Bänder passend zur Unternehmensbewertungsmethode wählen.',
          },
          valueSource: 'bands.feasibility',
        },
        {
          id: 'sl-impact',
          label: {
            en: 'Impact bands',
            de: 'Auswirkungsbänder',
          },
          kind: 'required',
          help: {
            en: 'Enter three positive, strictly increasing upper boundaries. Four bands are created; an exact boundary belongs to the lower band.',
            de: 'Drei positive, streng steigende Obergrenzen eingeben. Es entstehen vier Bänder; ein exakter Grenzwert gehört zum niedrigeren Band.',
          },
          values: {
            en: 'Feasibility uses A = K + S + T + U. Impact uses normalized I. Values shown below are the active analysis settings, or starting defaults when unconfigured.',
            de: 'Durchführbarkeit verwendet A = K + S + T + U. Auswirkung verwendet normiertes I. Unten stehen die Einstellungen der aktiven Analyse oder unkonfigurierte Startwerte.',
          },
          example: {
            en: 'Choose bands aligned with the company assessment method.',
            de: 'Bänder passend zur Unternehmensbewertungsmethode wählen.',
          },
          valueSource: 'bands.impact',
        },
        {
          id: 'sl-matrix',
          label: {
            en: 'Recommended SL-T matrix',
            de: 'Matrix für empfohlenes SL-T',
          },
          kind: 'conditional',
          help: {
            en: 'Assign an output level for each combination of feasibility band and impact band.',
            de: 'Für jede Kombination aus Durchführbarkeits- und Auswirkungsband einen Ergebnislevel festlegen.',
          },
          values: {
            en: 'Each of 16 cells accepts blank or SL 0–4. Complete all cells to enable the result. This is a company-defined planning lookup, not evidence of IEC 62443 capability or a prescribed IEC matrix. It recommends SL-T for original risks without changing the configured per-requirement targets.',
            de: 'Jede der 16 Zellen erlaubt leer oder SL 0–4. Alle Zellen für ein Ergebnis ausfüllen. Unternehmensdefinierte Planungszuordnung, kein Nachweis einer IEC-62443-Fähigkeit und keine vorgeschriebene IEC-Matrix. Sie empfiehlt SL-T für ursprüngliche Risiken; die festgelegten Ziele je Anforderung bleiben unverändert.',
          },
          example: {
            en: 'Record why a particular original feasibility/impact pair maps to the chosen level.',
            de: 'Begründen, warum eine Kombination aus ursprünglicher Durchführbarkeit und Auswirkung dem gewählten Level zugeordnet wird.',
          },
        },
      ],
    },
  ],
  phaseExamples: {
    design: {
      en: 'Threat modelling and architecture choices',
      de: 'Bedrohungsmodellierung und Architekturentscheidungen',
    },
    procurement: {
      en: 'Supplier components and provenance',
      de: 'Zulieferkomponenten und Herkunft',
    },
    manufacturing: {
      en: 'Builds, assembly, provisioning and initial credentials',
      de: 'Builds, Montage, Bereitstellung und initiale Zugangsdaten',
    },
    testing: {
      en: 'Test ports and diagnostic access',
      de: 'Testports und Diagnosezugriff',
    },
    transport: {
      en: 'Tampering during distribution, storage or shipping',
      de: 'Manipulation bei Verteilung, Lagerung oder Versand',
    },
    installation: {
      en: 'Initial credentials and network setup',
      de: 'Initiale Zugangsdaten und Netzeinrichtung',
    },
    operation: {
      en: 'Normal use and remote access',
      de: 'Normalbetrieb und Fernzugriff',
    },
    maintenance: {
      en: 'Service access and updates',
      de: 'Servicezugriff und Updates',
    },
    decommissioning: {
      en: 'Data erasure and key revocation',
      de: 'Datenlöschung und Schlüsselwiderruf',
    },
    custom: {
      en: 'Name an additional company-specific phase',
      de: 'Weitere unternehmensspezifische Phase benennen',
    },
  },
  sources: [
    {
      label: 'ISA/ISASecure guide, security levels (page 7)',
      url: 'https://programs.isa.org/hubfs/06%20-%20ASCI/0920-ISASecure-Certifications-Guide-FINAL.pdf#page=8',
    },
    {
      label: 'IEC 62443-4-2 — foundational requirements',
      url: 'https://webstore.iec.ch/en/publication/34421',
    },
    {
      label: 'European Commission — Cyber Resilience Act overview',
      url: 'https://digital-strategy.ec.europa.eu/en/policies/cra-summary',
    },
  ],
};
