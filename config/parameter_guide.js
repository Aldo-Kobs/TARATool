/** Editable input guidance. Change bilingual text, interpretations and examples here.
 * See docs/parameters-customization.md. Numeric choices follow the active configuration.
 */
window.PARAMETER_GUIDE = {
  ui: {
    title: {
      en: 'Parameters',
      de: 'Parameter',
    },
    intro: {
      en: 'Guide to the fields you fill in, grouped by tab and entry window, from Assets through Residual Risk and related Settings. The proposed protection and damage levels below are a starting point for discussion: adapt them to your company and product context.',
      de: 'Anleitung zu auszufüllenden Feldern, nach Tab und Eingabefenster geordnet, von Assets bis Restrisiko und den zugehörigen Einstellungen. Die vorgeschlagenen Schutzbedarfs- und Schadensstufen dienen als Diskussionsgrundlage: Passen Sie sie an Ihr Unternehmen und den Produktkontext an.',
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
      en: 'Security-level background',
      de: 'Hintergrund zu Security-Levels',
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
            en: 'Identify the asset unambiguously within the analysed product. Required to save.',
            de: 'Das Asset innerhalb des untersuchten Produkts eindeutig benennen. Zum Speichern erforderlich.',
          },
          values: {
            en: 'Free text. IDs such as A01 are generated automatically.',
            de: 'Freitext. Kennungen wie A01 werden automatisch erzeugt.',
          },
          example: {
            en: 'Service Ethernet interface; firmware image; shutdown function.',
            de: 'Service-Ethernet-Schnittstelle; Firmware-Abbild; Abschaltfunktion.',
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
            en: 'HW: controller board or USB port. SW: service application. Firmware: bootloader or controller image. Data: production recipe or cryptographic keys. Function: calibration or system shutdown.',
            de: 'HW: Steuerungsplatine oder USB-Port. SW: Serviceanwendung. Firmware: Bootloader oder Steuerungsabbild. Daten: Produktionsrezeptur oder kryptografische Schlüssel. Funktion: Kalibrierung oder Systemabschaltung.',
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
            en: 'Describe the boundary, role, interfaces and relevant dependencies.',
            de: 'Abgrenzung, Rolle, Schnittstellen und relevante Abhängigkeiten beschreiben.',
          },
          values: {
            en: 'Optional free text; can be maintained in English and German.',
            de: 'Optionaler Freitext; auf Englisch und Deutsch pflegbar.',
          },
          example: {
            en: 'Interface used by service staff to install signed updates.',
            de: 'Schnittstelle zur Installation signierter Updates durch den Service.',
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
            en: 'Choose the level matching the highest credible consequence of this property failing in the intended operating context.',
            de: 'Wählen Sie die Stufe entsprechend der höchsten plausiblen Folge eines Versagens dieser Eigenschaft im vorgesehenen Betriebskontext.',
          },
          example: {
            en: 'Select by consequence, not by the number or type of security controls already installed. Record the context and rationale in the asset description.',
            de: 'Nach den Folgen auswählen, nicht nach Anzahl oder Art bereits vorhandener Schutzmaßnahmen. Kontext und Begründung in der Asset-Beschreibung festhalten.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Limited disclosure — reveals internal details, but no sensitive records or secrets that grant access. The effects stay local and are easy to contain.',
                de: 'Begrenzte Offenlegung — interne Details werden bekannt, jedoch keine sensiblen Datensätze oder Geheimnisse, die Zugang ermöglichen. Die Folgen bleiben lokal und leicht beherrschbar.',
              },
              example: {
                en: 'HW: board revision markings; SW: internal tool version list; Firmware: build identifier; Data: equipment inventory without credentials; Function: description of a non-sensitive status display.',
                de: 'HW: Kennzeichnung der Platinenrevision; SW: Versionsliste interner Werkzeuge; Firmware: Build-Kennung; Daten: Geräteliste ohne Zugangsdaten; Funktion: Beschreibung einer unkritischen Statusanzeige.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Sensitive disclosure — reveals proprietary implementation details, business information or personal records. This can cause substantial harm to the affected product, team or people.',
                de: 'Sensible Offenlegung — proprietäre Implementierungsdetails, Geschäftsinformationen oder personenbezogene Datensätze werden bekannt. Für das betroffene Produkt, Team oder Personen kann erheblicher Schaden entstehen.',
              },
              example: {
                en: 'HW: non-public circuit design; SW: proprietary application source code; Firmware: proprietary control algorithm; Data: customer service records; Function: confidential production sequence. Assume disclosure harms the business without exposing critical access secrets.',
                de: 'HW: nicht öffentlicher Schaltungsentwurf; SW: proprietärer Anwendungsquellcode; Firmware: proprietärer Regelalgorithmus; Daten: Kunden-Serviceunterlagen; Funktion: vertraulicher Produktionsablauf. Annahme: Die Offenlegung schädigt das Geschäft, legt aber keine kritischen Zugangsgeheimnisse offen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical disclosure — reveals secrets or information whose exposure enables critical access or causes severe, lasting or widespread harm.',
                de: 'Kritische Offenlegung — Geheimnisse oder Informationen werden bekannt, deren Preisgabe kritischen Zugang ermöglicht oder schwere, dauerhafte bzw. weitreichende Schäden verursacht.',
              },
              example: {
                en: 'HW: fleet credentials extracted from a secure memory component; SW: embedded credentials for a central administration service; Firmware: embedded master secret shared across devices; Data: private firmware-signing key; Function: recovery procedure that exposes a fleet-wide override secret.',
                de: 'HW: aus einem sicheren Speicherbaustein ausgelesene Flotten-Zugangsdaten; SW: eingebettete Zugangsdaten für einen zentralen Administrationsdienst; Firmware: geräteübergreifend verwendetes Hauptgeheimnis; Daten: privater Firmware-Signaturschlüssel; Funktion: Wiederherstellungsablauf, der ein flottenweites Überbrückungsgeheimnis offenlegt.',
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
            en: 'Choose the level matching the highest credible consequence of this property failing in the intended operating context.',
            de: 'Wählen Sie die Stufe entsprechend der höchsten plausiblen Folge eines Versagens dieser Eigenschaft im vorgesehenen Betriebskontext.',
          },
          example: {
            en: 'Select by consequence, not by the number or type of security controls already installed. Record the context and rationale in the asset description.',
            de: 'Nach den Folgen auswählen, nicht nach Anzahl oder Art bereits vorhandener Schutzmaßnahmen. Kontext und Begründung in der Asset-Beschreibung festhalten.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Locally correctable change — modification causes a minor error that routine work can correct. Control decisions, product quality and safety remain unaffected.',
                de: 'Lokal korrigierbare Änderung — eine Manipulation verursacht einen kleinen Fehler, der sich im Routinebetrieb beheben lässt. Steuerungsentscheidungen, Produktqualität und Sicherheit bleiben unbeeinflusst.',
              },
              example: {
                en: 'HW: altered label on a nonessential indicator; SW: changed dashboard layout; Firmware: changed welcome message; Data: modified descriptive asset note; Function: reordered nonessential report output.',
                de: 'HW: veränderte Beschriftung einer unwesentlichen Anzeige; SW: geändertes Dashboard-Layout; Firmware: geänderte Begrüßungsmeldung; Daten: veränderte beschreibende Asset-Notiz; Funktion: umsortierte Ausgabe eines unwesentlichen Berichts.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operationally significant change — modification produces incorrect results, rejected products or disruption in a bounded part of operations. Repair, rework or deliberate restoration is needed.',
                de: 'Betrieblich erhebliche Änderung — eine Manipulation verursacht falsche Ergebnisse, Ausschuss oder Störungen in einem begrenzten Betriebsbereich. Reparatur, Nacharbeit oder gezielte Wiederherstellung sind erforderlich.',
              },
              example: {
                en: 'HW: altered measurement circuit causes rejects; SW: changed scheduling logic delays orders; Firmware: changed calibration causes inaccurate output; Data: altered production recipe causes rework; Function: modified dosing sequence spoils a batch. Assume the effects remain contained without a safety hazard.',
                de: 'HW: veränderte Messschaltung verursacht Ausschuss; SW: geänderte Planungslogik verzögert Aufträge; Firmware: geänderte Kalibrierung verfälscht Ausgaben; Daten: veränderte Produktionsrezeptur erfordert Nacharbeit; Funktion: manipulierter Dosierablauf verdirbt eine Charge. Annahme: Die Folgen bleiben begrenzt und verursachen keine Sicherheitsgefährdung.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical change — modification can defeat a safeguard, cause dangerous behaviour or compromise trusted control across essential systems.',
                de: 'Kritische Änderung — eine Manipulation kann eine Schutzvorkehrung außer Kraft setzen, gefährliches Verhalten auslösen oder die vertrauenswürdige Steuerung wesentlicher Systeme kompromittieren.',
              },
              example: {
                en: 'HW: bypassed safety interlock circuit; SW: modified central update service distributes malicious packages; Firmware: altered motor-control limits permit dangerous movement; Data: changed safety limits or trusted signing certificates; Function: altered emergency shutdown logic fails to stop the machine.',
                de: 'HW: überbrückter Sicherheitsverriegelungskreis; SW: manipulierter zentraler Update-Dienst verteilt schädliche Pakete; Firmware: veränderte Motorsteuerungsgrenzen erlauben gefährliche Bewegungen; Daten: geänderte Sicherheitsgrenzen oder vertrauenswürdige Signaturzertifikate; Funktion: manipulierte Notabschaltlogik stoppt die Maschine nicht.',
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
            en: 'Choose the level matching the highest credible consequence of this property failing in the intended operating context.',
            de: 'Wählen Sie die Stufe entsprechend der höchsten plausiblen Folge eines Versagens dieser Eigenschaft im vorgesehenen Betriebskontext.',
          },
          example: {
            en: 'Select by consequence, not by the number or type of security controls already installed. Record the context and rationale in the asset description.',
            de: 'Nach den Folgen auswählen, nicht nach Anzahl oder Art bereits vorhandener Schutzmaßnahmen. Kontext und Begründung in der Asset-Beschreibung festhalten.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Tolerable interruption — the asset can be temporarily unavailable while essential work continues. A practical workaround and routine recovery are sufficient.',
                de: 'Tolerierbare Unterbrechung — das Asset kann vorübergehend ausfallen, während die wesentliche Arbeit weiterläuft. Eine praktikable Ersatzlösung und routinemäßige Wiederherstellung reichen aus.',
              },
              example: {
                en: 'HW: optional display fails while control continues; SW: reporting tool is offline while production runs; Firmware: optional indicator module does not start; Data: archived reports are temporarily inaccessible; Function: statistics export is delayed.',
                de: 'HW: optionales Display fällt aus, die Steuerung läuft weiter; SW: Berichtswerkzeug ist offline, die Produktion läuft weiter; Firmware: optionales Anzeigemodul startet nicht; Daten: Archivberichte sind vorübergehend unzugänglich; Funktion: Statistikexport verzögert sich.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Disruptive interruption — a machine, service or production area cannot perform important work until the asset is restored. Workarounds are limited and recovery takes significant effort.',
                de: 'Störende Unterbrechung — eine Maschine, ein Dienst oder Produktionsbereich kann wichtige Aufgaben erst nach Wiederherstellung des Assets fortsetzen. Ersatzlösungen sind begrenzt, die Wiederherstellung ist aufwendig.',
              },
              example: {
                en: 'HW: controller failure stops one production cell; SW: scheduling service outage delays a shift; Firmware: failed startup requires a service reflash; Data: unavailable production recipes halt a batch; Function: calibration is unavailable until maintenance. Assume recovery is possible before severe harm occurs.',
                de: 'HW: Steuerungsausfall stoppt eine Produktionszelle; SW: Ausfall des Planungsdienstes verzögert eine Schicht; Firmware: fehlgeschlagener Start erfordert erneutes Aufspielen durch den Service; Daten: fehlende Produktionsrezepturen stoppen eine Charge; Funktion: Kalibrierung ist bis zur Wartung nicht verfügbar. Annahme: Wiederherstellung ist möglich, bevor schwere Schäden entstehen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical interruption — an essential service or protective function is lost, with no adequate fallback within the tolerable outage. Severe harm or cascading failures can result.',
                de: 'Kritische Unterbrechung — ein wesentlicher Dienst oder eine Schutzfunktion fällt aus, ohne ausreichende Ersatzlösung innerhalb der tolerierbaren Ausfallzeit. Schwere Schäden oder Folgeausfälle können entstehen.',
              },
              example: {
                en: 'HW: sole controller for essential cooling fails; SW: central control service is unavailable across a site; Firmware: essential controllers cannot boot after a fleet update; Data: sole recovery configuration is lost during a critical outage; Function: emergency shutdown is unavailable when demanded.',
                de: 'HW: einzige Steuerung für eine wesentliche Kühlung fällt aus; SW: zentraler Steuerungsdienst fällt standortweit aus; Firmware: wesentliche Steuerungen starten nach einem Flotten-Update nicht mehr; Daten: einzige Wiederherstellungskonfiguration geht während eines kritischen Ausfalls verloren; Funktion: Notabschaltung ist im Anforderungsfall nicht verfügbar.',
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
            en: 'Choose the level matching the highest credible consequence of this property failing in the intended operating context.',
            de: 'Wählen Sie die Stufe entsprechend der höchsten plausiblen Folge eines Versagens dieser Eigenschaft im vorgesehenen Betriebskontext.',
          },
          example: {
            en: 'Select by consequence, not by the number or type of security controls already installed. Record the context and rationale in the asset description.',
            de: 'Nach den Folgen auswählen, nicht nach Anzahl oder Art bereits vorhandener Schutzmaßnahmen. Kontext und Begründung in der Asset-Beschreibung festhalten.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Minor permission overreach — an identified user or process performs an action outside its role, but the effect is limited to easily corrected, nonessential settings or information.',
                de: 'Geringfügige Rechteüberschreitung — ein identifizierter Benutzer oder Prozess führt eine Aktion außerhalb seiner Rolle aus. Die Folgen beschränken sich auf leicht korrigierbare, unwesentliche Einstellungen oder Informationen.',
              },
              example: {
                en: 'HW: a viewer changes an optional display setting; SW: a user changes a shared dashboard layout; Firmware: an operator changes a nonessential indicator pattern; Data: a reader edits a descriptive note; Function: a viewer changes report sorting.',
                de: 'HW: ein Betrachter ändert eine optionale Anzeigeeinstellung; SW: ein Benutzer ändert ein gemeinsames Dashboard-Layout; Firmware: ein Bediener ändert ein unwesentliches Anzeigemuster; Daten: ein Leser bearbeitet eine beschreibende Notiz; Funktion: ein Betrachter ändert die Berichtssortierung.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Significant permission overreach — access beyond an assigned role exposes sensitive information or changes important settings for a bounded machine, service or dataset.',
                de: 'Erhebliche Rechteüberschreitung — Zugriff über die zugewiesene Rolle hinaus legt sensible Informationen offen oder verändert wichtige Einstellungen einer abgegrenzten Maschine, eines Dienstes oder Datenbestands.',
              },
              example: {
                en: 'HW: an operator reconfigures a service interface reserved for maintenance; SW: a user changes production scheduling rules; Firmware: an operator changes calibration reserved for service staff; Data: a clerk exports restricted customer records; Function: an operator invokes a maintenance reset that interrupts one cell.',
                de: 'HW: ein Bediener konfiguriert eine dem Service vorbehaltene Schnittstelle um; SW: ein Benutzer ändert Regeln der Produktionsplanung; Firmware: ein Bediener ändert eine dem Service vorbehaltene Kalibrierung; Daten: ein Sachbearbeiter exportiert zugriffsbeschränkte Kundendaten; Funktion: ein Bediener löst einen Wartungsreset aus, der eine Zelle unterbricht.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical permission overreach — a user or process can bypass protective functions, alter the trust basis or administer many essential assets without the required authority.',
                de: 'Kritische Rechteüberschreitung — ein Benutzer oder Prozess kann ohne die erforderliche Berechtigung Schutzfunktionen umgehen, die Vertrauensbasis ändern oder viele wesentliche Assets administrieren.',
              },
              example: {
                en: 'HW: a service role disables a safety interlock; SW: an ordinary account grants fleet administrator rights; Firmware: a maintenance role replaces the trusted bootloader; Data: a user changes trusted signing keys; Function: an operator disables protective shutdown during operation.',
                de: 'HW: eine Servicerolle deaktiviert eine Sicherheitsverriegelung; SW: ein gewöhnliches Konto vergibt Flottenadministratorrechte; Firmware: eine Wartungsrolle ersetzt den vertrauenswürdigen Bootloader; Daten: ein Benutzer ändert vertrauenswürdige Signaturschlüssel; Funktion: ein Bediener deaktiviert die Schutzabschaltung während des Betriebs.',
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
            en: 'Choose the level matching the highest credible consequence of this property failing in the intended operating context.',
            de: 'Wählen Sie die Stufe entsprechend der höchsten plausiblen Folge eines Versagens dieser Eigenschaft im vorgesehenen Betriebskontext.',
          },
          example: {
            en: 'Select by consequence, not by the number or type of security controls already installed. Record the context and rationale in the asset description.',
            de: 'Nach den Folgen auswählen, nicht nach Anzahl oder Art bereits vorhandener Schutzmaßnahmen. Kontext und Begründung in der Asset-Beschreibung festhalten.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Low-consequence impersonation — accepting the wrong user, device or source identity affects only non-sensitive information or nonessential behaviour.',
                de: 'Wenig folgenschweres Vortäuschen einer Identität — die Annahme einer falschen Benutzer-, Geräte- oder Quellenidentität betrifft nur nicht sensible Informationen oder unwesentliches Verhalten.',
              },
              example: {
                en: 'HW: an optional display accessory is mistaken for another; SW: a report viewer is impersonated; Firmware: a source is falsely credited for nonessential display text; Data: a descriptive note is attributed to the wrong author; Function: a report-preview request appears to come from another viewer.',
                de: 'HW: ein optionales Anzeigezubehör wird mit einem anderen verwechselt; SW: ein Berichtsbetrachter wird vorgetäuscht; Firmware: die Quelle eines unwesentlichen Anzeigetexts wird falsch zugeordnet; Daten: eine beschreibende Notiz wird dem falschen Autor zugeschrieben; Funktion: eine Berichtsvorschau-Anfrage scheint von einem anderen Betrachter zu stammen.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operational impersonation — a false user, device or source identity is trusted with sensitive information or important actions for a bounded machine or service.',
                de: 'Betrieblich erhebliche Identitätstäuschung — einer falschen Benutzer-, Geräte- oder Quellenidentität werden sensible Informationen oder wichtige Aktionen für eine abgegrenzte Maschine oder einen Dienst anvertraut.',
              },
              example: {
                en: 'HW: a counterfeit measurement sensor is trusted and causes rejects; SW: a fake maintenance user accesses one machine; Firmware: an impersonated calibration service supplies incorrect calibration values; Data: a forged production recipe is accepted as approved; Function: a maintenance command is accepted from an impersonated local service tool.',
                de: 'HW: einem gefälschten Messsensor wird vertraut, wodurch Ausschuss entsteht; SW: ein vorgetäuschter Wartungsbenutzer erhält Zugriff auf eine Maschine; Firmware: ein vorgetäuschter Kalibrierdienst liefert falsche Kalibrierwerte; Daten: eine gefälschte Produktionsrezeptur wird als freigegeben akzeptiert; Funktion: ein Wartungsbefehl eines vorgetäuschten lokalen Servicewerkzeugs wird angenommen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical impersonation — trusting a false administrator, device or update source enables dangerous actions or compromise of essential systems, potentially across a fleet.',
                de: 'Kritische Identitätstäuschung — das Vertrauen in einen falschen Administrator, ein falsches Gerät oder eine falsche Update-Quelle ermöglicht gefährliche Aktionen oder die Kompromittierung wesentlicher Systeme, möglicherweise flottenweit.',
              },
              example: {
                en: 'HW: a counterfeit safety controller is accepted as trusted; SW: a fleet administrator is impersonated; Firmware: a malicious update is accepted from an impersonated trusted supplier; Data: forged safety configuration is accepted as originating from the approval authority; Function: a dangerous control command is accepted from a fake supervisory controller.',
                de: 'HW: eine gefälschte Sicherheitssteuerung wird als vertrauenswürdig akzeptiert; SW: ein Flottenadministrator wird vorgetäuscht; Firmware: ein schädliches Update eines vorgetäuschten vertrauenswürdigen Lieferanten wird angenommen; Daten: eine gefälschte Sicherheitskonfiguration wird der Freigabestelle zugeschrieben; Funktion: ein gefährlicher Steuerbefehl einer gefälschten übergeordneten Steuerung wird angenommen.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Choose I, II or III by what happens if protection fails. I: a local inconvenience or error handled through routine work; essential operation continues. II: substantial disruption, rework or sensitive disclosure affecting a product, service or group; deliberate recovery is needed. III: severe harm, loss of essential control or compromise of critical secrets, possibly across many assets. Apply this distinction separately to confidentiality, integrity, availability, authorization and authentication for hardware (HW), software (SW), firmware, data and functions. Any asset type can fall into any level: a status-display firmware and motor-control firmware need not have the same rating. For confidentiality, consider the information stored in, processed by or revealed through the asset; for authentication and authorization, consider its users, connected devices and services. I still requires protection. These are company guidance categories, not SL-T values. Use the examples as context, agree measurable boundaries and record the reason for each choice.',
        de: 'I, II oder III danach wählen, was bei einem Versagen des Schutzes geschieht. I: lokale Unannehmlichkeit oder Fehler, im Routinebetrieb behebbar; der wesentliche Betrieb läuft weiter. II: erhebliche Störung, Nacharbeit oder sensible Offenlegung bei einem Produkt, Dienst oder einer Gruppe; gezielte Wiederherstellung ist nötig. III: schwere Schäden, Verlust wesentlicher Steuerung oder Offenlegung kritischer Geheimnisse, gegebenenfalls über viele Assets hinweg. Diese Unterscheidung für Vertraulichkeit, Integrität, Verfügbarkeit, Autorisierung und Authentifizierung jeweils getrennt auf Hardware (HW), Software (SW), Firmware, Daten und Funktionen anwenden. Jeder Asset-Typ kann jede Stufe haben: Firmware für eine Statusanzeige und Firmware für eine Motorsteuerung müssen nicht gleich eingestuft werden. Bei Vertraulichkeit die im Asset gespeicherten, verarbeiteten oder darüber offengelegten Informationen betrachten; bei Authentifizierung und Autorisierung seine Benutzer, angeschlossenen Geräte und Dienste. Auch I erfordert Schutz. Dies sind unternehmensbezogene Orientierungskategorien, keine SL-T-Werte. Beispiele im jeweiligen Kontext verwenden, messbare Grenzen vereinbaren und jede Auswahl begründen.',
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
            en: 'Loss of calibrated measurement accuracy.',
            de: 'Verlust der kalibrierten Messgenauigkeit.',
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
            en: 'Accuracy',
            de: 'Genauigk.',
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
            en: 'Explain the harm, affected stakeholders and assumptions.',
            de: 'Schaden, Betroffene und Annahmen erläutern.',
          },
          values: {
            en: 'Optional free text.',
            de: 'Optionaler Freitext.',
          },
          example: {
            en: 'Incorrect readings cause unsuitable processing parameters.',
            de: 'Fehlerhafte Messwerte führen zu ungeeigneten Prozessparametern.',
          },
        },
      ],
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
            en: 'For each scenario, agree company thresholds for outage duration, recovery effort, financial loss, affected people and data sensitivity. If evidence is missing, state the uncertainty in the mandatory comment and arrange a review.',
            de: 'Je Szenario Unternehmensgrenzen für Ausfalldauer, Wiederherstellungsaufwand, finanzielle Verluste, Betroffene und Datensensibilität vereinbaren. Fehlende Nachweise im Pflichtkommentar als Unsicherheit festhalten und eine Prüfung veranlassen.',
          },
          interpretations: [
            {
              value: 'N/A',
              meaning: {
                en: 'Not applicable: this asset cannot credibly produce the stated damage in the assessed context. Do not use it for low impact or uncertainty. An untouched cell also displays N/A; record an explicit justification.',
                de: 'Nicht anwendbar: Dieses Asset kann den beschriebenen Schaden im bewerteten Kontext plausibel nicht auslösen. Nicht für geringe Folgen oder Unsicherheit verwenden. Auch eine unberührte Zelle zeigt N/A; ausdrücklich begründen.',
              },
              example: {
                en: 'Financial-record disclosure for a component that neither stores nor handles those records.',
                de: 'Offenlegung von Finanzunterlagen bei einer Komponente, die diese weder speichert noch verarbeitet.',
              },
            },
            {
              value: '1',
              meaning: {
                en: 'Limited, local and readily recoverable harm. Normal procedures or a practical workaround keep the consequences within routine tolerance; no credible injury or major knock-on effect.',
                de: 'Begrenzter, lokaler und leicht behebbarer Schaden. Routineverfahren oder eine praktikable Ersatzlösung halten die Folgen innerhalb der üblichen Toleranz; keine plausible Verletzung oder größere Folgewirkung.',
              },
              example: {
                en: 'DS3 Operation damage: a nonessential interface stops, but the component’s main operation continues via a usable alternative.',
                de: 'DS3 Betriebsschaden: Eine unwesentliche Schnittstelle fällt aus; der Hauptbetrieb der Komponente läuft über eine nutzbare Alternative weiter.',
              },
            },
            {
              value: '2',
              meaning: {
                en: 'Significant but contained harm. Service, production, finances or affected people are materially impacted; dedicated recovery, rework or specialist intervention is needed.',
                de: 'Erheblicher, aber begrenzter Schaden. Dienstleistung, Produktion, Finanzen oder Betroffene werden spürbar beeinträchtigt; gezielte Wiederherstellung, Nacharbeit oder fachlicher Eingriff sind erforderlich.',
              },
              example: {
                en: 'DS3 Operation damage: the component stops a production cell; specialist recovery and rework are needed, while the rest of the site operates.',
                de: 'DS3 Betriebsschaden: Die Komponente legt eine Produktionszelle still; fachliche Wiederherstellung und Nacharbeit sind nötig, während der übrige Standort weiterarbeitet.',
              },
            },
            {
              value: '3',
              meaning: {
                en: 'Severe, widespread or difficult-to-reverse harm. Examples include serious personal harm, loss of an essential service beyond the tolerable outage, major business loss or extensive exposure of highly sensitive data.',
                de: 'Schwerer, weitreichender oder schwer rückgängig zu machender Schaden. Beispiele sind schwere Personenschäden, Ausfall eines wesentlichen Dienstes über die tolerierbare Dauer hinaus, große Geschäftsverluste oder umfangreiche Offenlegung hochsensibler Daten.',
              },
              example: {
                en: 'DS3 Operation damage: loss of the component stops an essential process without a workable fallback and exceeds the agreed maximum tolerable outage.',
                de: 'DS3 Betriebsschaden: Der Komponentenausfall stoppt einen wesentlichen Prozess ohne nutzbare Ersatzlösung und überschreitet die vereinbarte maximal tolerierbare Ausfallzeit.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Proposed impact guidance for discussion and company adaptation. Assess the actual harmful outcome per scenario. The same Low / Medium / High principle applies to safety, financial, operation, privacy and legal consequences, with thresholds appropriate to each scenario.',
        de: 'Vorgeschlagene Auswirkungsbewertung zur Diskussion und unternehmensspezifischen Anpassung. Den tatsächlichen Schaden je Szenario bewerten. Dasselbe Prinzip Gering / Mittel / Hoch gilt für Sicherheits-, Finanz-, Betriebs-, Datenschutz- und rechtliche Folgen, mit zum jeweiligen Szenario passenden Grenzen.',
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
            en: 'High: loss of operation requires on-site replacement. N/A: this component stores no personal data.',
            de: 'High: Betriebsausfall erfordert Austausch vor Ort. N/A: Diese Komponente speichert keine personenbezogenen Daten.',
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
            en: 'A01: service interface.',
            de: 'A01: Serviceschnittstelle.',
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
            en: 'Install unauthorised firmware on the controller.',
            de: 'Unautorisierte Firmware auf der Steuerung installieren.',
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
            en: 'Reach maintenance port → bypass update validation.',
            de: 'Wartungsport erreichen → Updateprüfung umgehen.',
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
            en: 'Controller cannot perform its normal operation.',
            de: 'Steuerung kann ihre normale Betriebsfunktion nicht mehr ausführen.',
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
            en: 'One local device versus connected operational or business networks.',
            de: 'Ein lokales Gerät gegenüber vernetzten Betriebs- oder Geschäftsnetzen.',
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
            en: 'Firmware signing risks can concern manufacturing and maintenance.',
            de: 'Risiken der Firmware-Signierung können Fertigung und Wartung betreffen.',
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
            en: 'Service technicians can change firmware during maintenance.',
            de: 'Servicetechniker können bei der Wartung Firmware ändern.',
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
            en: 'Only authorised firmware can be installed.',
            de: 'Nur autorisierte Firmware kann installiert werden.',
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
            en: 'Link firmware authenticity and restricted maintenance access.',
            de: 'Firmware-Authentizität und eingeschränkten Wartungszugriff verknüpfen.',
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
          label: { en: 'Link to requirement', de: 'Link zur Anforderung' },
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
      en: 'Programming, assembly and factory credentials',
      de: 'Programmierung, Montage und Werkszugänge',
    },
    testing: {
      en: 'Test ports and diagnostic access',
      de: 'Testports und Diagnosezugriff',
    },
    transport: {
      en: 'Tampering during storage or shipping',
      de: 'Manipulation bei Lagerung oder Versand',
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
  ],
};
