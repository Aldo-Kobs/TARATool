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
      en: 'Guide to the fields you fill in, grouped by tab and entry window. Asset and damage examples focus on automated window systems and an Automation Manager that can control multiple windows. Adapt the proposed levels to the mechanisms, installation conditions and agreed company thresholds.',
      de: 'Anleitung zu auszufüllenden Feldern, nach Tab und Eingabefenster geordnet. Asset- und Schadensbeispiele beziehen sich auf automatisierte Fenstersysteme und einen Automation Manager, der mehrere Fenster steuern kann. Die vorgeschlagenen Stufen an Mechanismen, Einbaubedingungen und vereinbarte Unternehmensgrenzen anpassen.',
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
            en: 'Name the window-system asset and its scope: an individual window, a window group or the shared Automation Manager. Required to save.',
            de: 'Das Asset des Fenstersystems und seinen Geltungsbereich benennen: einzelnes Fenster, Fenstergruppe oder gemeinsamer Automation Manager. Zum Speichern erforderlich.',
          },
          values: {
            en: 'Free text. IDs such as A01 are generated automatically.',
            de: 'Freitext. Kennungen wie A01 werden automatisch erzeugt.',
          },
          example: {
            en: 'Window actuator and controller; Automation Manager; window-group configuration and cryptographic keys; obstacle-stop function.',
            de: 'Fensterantrieb und Steuerung; Automation Manager; Fenstergruppenkonfiguration und kryptografische Schlüssel; Hindernisstoppfunktion.',
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
            en: 'A window assembly combines its actuator and sensors with controller firmware, settings and opening/closing functions. The Automation Manager adds shared control software, window-group data, cryptographic keys and coordinated operation.',
            de: 'Eine Fenstereinheit verbindet Antrieb und Sensoren mit Steuerungsfirmware, Einstellungen und Öffnungs-/Schließfunktionen. Der Automation Manager ergänzt gemeinsame Steuerungssoftware, Fenstergruppendaten, kryptografische Schlüssel und koordinierte Bedienung.',
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
            en: 'Describe the mechanism, operating role, interfaces and dependencies. State which windows the asset can affect and which local controls remain available if the Automation Manager fails.',
            de: 'Mechanismus, Betriebsaufgabe, Schnittstellen und Abhängigkeiten beschreiben. Angeben, welche Fenster das Asset beeinflussen kann und welche lokalen Bedienelemente bei Ausfall des Automation Managers verfügbar bleiben.',
          },
          values: {
            en: 'Optional free text; can be maintained in English and German.',
            de: 'Optionaler Freitext; auf Englisch und Deutsch pflegbar.',
          },
          example: {
            en: 'Automation Manager sends open/close commands to a defined window group. Record the group size, command permissions, network connection, local overrides and whether obstacle detection remains active independently.',
            de: 'Der Automation Manager sendet Öffnungs-/Schließbefehle an eine festgelegte Fenstergruppe. Gruppengröße, Befehlsberechtigungen, Netzwerkverbindung, lokale Übersteuerung und die Unabhängigkeit der Hinderniserkennung dokumentieren.',
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
            en: 'Choose by the highest credible consequence for this window-system asset. Consider its mechanism, location, users, affected window group and dependence on the Automation Manager.',
            de: 'Nach der höchsten plausiblen Folge für dieses Asset des Fenstersystems wählen. Mechanismus, Einbauort, Nutzer, betroffene Fenstergruppe und Abhängigkeit vom Automation Manager berücksichtigen.',
          },
          example: {
            en: 'Compare one locally operated window with a Manager controlling many windows. Record whether local controls and protective functions remain effective, and the consequences if they do not. Asset type or window count alone does not determine the category.',
            de: 'Ein lokal bedientes Fenster mit einem Manager für viele Fenster vergleichen. Dokumentieren, ob lokale Bedienung und Schutzfunktionen wirksam bleiben und welche Folgen ihr Ausfall hätte. Asset-Typ oder Fensteranzahl allein bestimmen die Kategorie nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Limited disclosure — exposes non-sensitive window-system details, without revealing access secrets, occupants’ behaviour or proprietary control knowledge.',
                de: 'Begrenzte Offenlegung — nicht sensible Details des Fenstersystems werden bekannt, jedoch keine Zugangsgeheimnisse, Verhaltensmuster der Nutzer oder proprietären Steuerungskenntnisse.',
              },
              example: {
                en: 'Someone reads the window model, public software version or general operating instructions. No access secrets or personal information are exposed.',
                de: 'Jemand liest das Fenstermodell, die öffentliche Softwareversion oder allgemeine Bedienhinweise. Zugangsgeheimnisse oder personenbezogene Informationen werden nicht offengelegt.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Sensitive disclosure — reveals proprietary design, customer installation details or patterns of window use that can expose occupants’ routines. The harm is substantial but contained.',
                de: 'Sensible Offenlegung — proprietäre Konstruktion, kundenspezifische Installationsdetails oder Fenster-Nutzungsmuster werden bekannt, aus denen sich Gewohnheiten der Bewohner ableiten lassen. Der Schaden ist erheblich, aber begrenzt.',
              },
              example: {
                en: 'Internal controller designs or customer ventilation schedules are disclosed, revealing proprietary know-how or occupants’ routines.',
                de: 'Interne Steuerungsentwürfe oder kundenspezifische Lüftungszeitpläne werden offengelegt und verraten proprietäres Wissen oder Gewohnheiten der Bewohner.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical disclosure — exposes secrets that enable dangerous or extensive control of windows, or highly sensitive occupancy information with severe consequences.',
                de: 'Kritische Offenlegung — Geheimnisse werden bekannt, die gefährliche oder weitreichende Fenstersteuerung ermöglichen, oder hochsensible Belegungsinformationen mit schweren Folgen.',
              },
              example: {
                en: 'Automation Manager administrator credentials or a private firmware-signing key are exposed, enabling unauthorized control or malicious updates across many windows.',
                de: 'Administrator-Zugangsdaten des Automation Managers oder ein privater Firmware-Signaturschlüssel werden offengelegt. Dadurch werden unbefugte Steuerung oder schädliche Updates vieler Fenster möglich.',
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
            en: 'Choose by the highest credible consequence for this window-system asset. Consider its mechanism, location, users, affected window group and dependence on the Automation Manager.',
            de: 'Nach der höchsten plausiblen Folge für dieses Asset des Fenstersystems wählen. Mechanismus, Einbauort, Nutzer, betroffene Fenstergruppe und Abhängigkeit vom Automation Manager berücksichtigen.',
          },
          example: {
            en: 'Compare one locally operated window with a Manager controlling many windows. Record whether local controls and protective functions remain effective, and the consequences if they do not. Asset type or window count alone does not determine the category.',
            de: 'Ein lokal bedientes Fenster mit einem Manager für viele Fenster vergleichen. Dokumentieren, ob lokale Bedienung und Schutzfunktionen wirksam bleiben und welche Folgen ihr Ausfall hätte. Asset-Typ oder Fensteranzahl allein bestimmen die Kategorie nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Locally correctable change — alters presentation or descriptive information while window movement, protective functions and meaningful operating decisions remain unaffected.',
                de: 'Lokal korrigierbare Änderung — Darstellung oder beschreibende Informationen ändern sich; Fensterbewegung, Schutzfunktionen und wesentliche Betriebsentscheidungen bleiben unbeeinflusst.',
              },
              example: {
                en: 'A display colour or descriptive installation note is changed. Window movement and protective functions remain unaffected.',
                de: 'Eine Anzeigefarbe oder beschreibende Installationsnotiz wird verändert. Fensterbewegung und Schutzfunktionen bleiben unbeeinflusst.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operationally significant change — changes window position, schedules or group assignment, causing contained disruption, loss of comfort or repair work. Assume local protective functions remain effective.',
                de: 'Betrieblich erhebliche Änderung — Fensterposition, Zeitpläne oder Gruppenzuordnung ändern sich und verursachen begrenzte Störungen, Komfortverlust oder Reparaturaufwand. Annahme: Lokale Schutzfunktionen bleiben wirksam.',
              },
              example: {
                en: 'Changed calibration, schedules or window-group assignments disrupt ventilation in one zone and require service. Local protective functions remain effective.',
                de: 'Geänderte Kalibrierung, Zeitpläne oder Fenstergruppenzuordnungen stören die Lüftung einer Zone und erfordern Service. Lokale Schutzfunktionen bleiben wirksam.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical change — permits dangerous movement, defeats an obstacle-stop function or causes severe damage through coordinated commands. One accessible window can already have severe consequences.',
                de: 'Kritische Änderung — gefährliche Bewegung wird möglich, ein Hindernisstopp wird außer Kraft gesetzt oder koordinierte Befehle verursachen schwere Schäden. Bereits ein einzelnes zugängliches Fenster kann schwere Folgen haben.',
              },
              example: {
                en: 'Manipulated control logic or force limits disable obstacle stop and permit dangerous closing. A compromised Automation Manager could send harmful commands to many windows at once.',
                de: 'Manipulierte Steuerlogik oder Kraftgrenzen setzen den Hindernisstopp außer Kraft und erlauben gefährliches Schließen. Ein kompromittierter Automation Manager könnte schädliche Befehle gleichzeitig an viele Fenster senden.',
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
            en: 'Choose by the highest credible consequence for this window-system asset. Consider its mechanism, location, users, affected window group and dependence on the Automation Manager.',
            de: 'Nach der höchsten plausiblen Folge für dieses Asset des Fenstersystems wählen. Mechanismus, Einbauort, Nutzer, betroffene Fenstergruppe und Abhängigkeit vom Automation Manager berücksichtigen.',
          },
          example: {
            en: 'Compare one locally operated window with a Manager controlling many windows. Record whether local controls and protective functions remain effective, and the consequences if they do not. Asset type or window count alone does not determine the category.',
            de: 'Ein lokal bedientes Fenster mit einem Manager für viele Fenster vergleichen. Dokumentieren, ob lokale Bedienung und Schutzfunktionen wirksam bleiben und welche Folgen ihr Ausfall hätte. Asset-Typ oder Fensteranzahl allein bestimmen die Kategorie nicht.',
          },
          valueSource: 'protection',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Tolerable interruption — a convenience feature is unavailable, but required window operation and protective functions remain usable through an accessible alternative.',
                de: 'Tolerierbare Unterbrechung — eine Komfortfunktion fällt aus; erforderliche Fensterbedienung und Schutzfunktionen bleiben über eine zugängliche Alternative nutzbar.',
              },
              example: {
                en: 'The Manager display or remote status view is temporarily unavailable. Users can still operate the windows with accessible local buttons.',
                de: 'Manager-Anzeige oder entfernte Statusansicht fallen vorübergehend aus. Nutzer können die Fenster weiterhin über zugängliche lokale Taster bedienen.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Disruptive interruption — a window or defined window group cannot provide expected opening, closing or ventilation until service restores it. The outage causes substantial but contained harm.',
                de: 'Störende Unterbrechung — ein Fenster oder eine abgegrenzte Fenstergruppe kann erst nach Wiederherstellung durch den Service wie vorgesehen öffnen, schließen oder lüften. Der Ausfall verursacht erhebliche, aber begrenzte Schäden.',
              },
              example: {
                en: 'An actuator failure or lost group configuration interrupts automatic ventilation in one zone until an installer restores it. Local operation limits the disruption.',
                de: 'Ein Antriebsdefekt oder eine verlorene Gruppenkonfiguration unterbricht die automatische Lüftung einer Zone bis zur Wiederherstellung durch einen Installateur. Lokale Bedienung begrenzt die Störung.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical interruption — required closing, ventilation or protective operation is lost beyond the tolerable outage, with no usable local fallback and severe consequences.',
                de: 'Kritische Unterbrechung — erforderliches Schließen, Lüften oder Schutzverhalten fällt über die tolerierbare Dauer hinaus aus; eine nutzbare lokale Ersatzlösung fehlt und schwere Folgen entstehen.',
              },
              example: {
                en: 'A shared power, firmware or Manager failure leaves exposed windows open before severe weather. They cannot be closed locally in time, resulting in extensive building damage.',
                de: 'Ein gemeinsamer Stromversorgungs-, Firmware- oder Manager-Ausfall lässt exponierte Fenster vor Unwetter offen. Sie können nicht rechtzeitig lokal geschlossen werden, wodurch umfangreiche Gebäudeschäden entstehen.',
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
            en: 'Choose by the highest credible consequence for this window-system asset. Consider its mechanism, location, users, affected window group and dependence on the Automation Manager.',
            de: 'Nach der höchsten plausiblen Folge für dieses Asset des Fenstersystems wählen. Mechanismus, Einbauort, Nutzer, betroffene Fenstergruppe und Abhängigkeit vom Automation Manager berücksichtigen.',
          },
          example: {
            en: 'Compare one locally operated window with a Manager controlling many windows. Record whether local controls and protective functions remain effective, and the consequences if they do not. Asset type or window count alone does not determine the category.',
            de: 'Ein lokal bedientes Fenster mit einem Manager für viele Fenster vergleichen. Dokumentieren, ob lokale Bedienung und Schutzfunktionen wirksam bleiben und welche Folgen ihr Ausfall hätte. Asset-Typ oder Fensteranzahl allein bestimmen die Kategorie nicht.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Minor permission overreach — an identified user changes nonessential presentation or notes outside their role, without gaining control of window movement or access to sensitive data.',
                de: 'Geringfügige Rechteüberschreitung — ein identifizierter Benutzer ändert außerhalb seiner Rolle unwesentliche Darstellungen oder Notizen, erhält aber keine Kontrolle über Fensterbewegung oder sensible Daten.',
              },
              example: {
                en: 'A viewer changes a shared dashboard appearance or a nonessential note without permission, but cannot operate windows or change protective settings.',
                de: 'Ein Betrachter ändert unberechtigt das gemeinsame Dashboard-Design oder eine unwesentliche Notiz, kann aber keine Fenster bedienen oder Schutzeinstellungen ändern.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Significant permission overreach — a user can operate windows or change schedules and settings outside their assigned room or group, causing contained disruption or disclosure.',
                de: 'Erhebliche Rechteüberschreitung — ein Benutzer kann außerhalb seines zugewiesenen Raums oder seiner Gruppe Fenster bedienen, Zeitpläne oder Einstellungen ändern und dadurch begrenzte Störungen oder Offenlegung verursachen.',
              },
              example: {
                en: 'A room user changes another room’s ventilation schedule or accesses its usage logs beyond their assigned permissions. The effects remain limited to that group.',
                de: 'Ein Raumnutzer ändert außerhalb seiner Berechtigungen den Lüftungszeitplan eines anderen Raums oder greift auf dessen Nutzungsprotokolle zu. Die Folgen bleiben auf diese Gruppe begrenzt.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical permission overreach — a user can disable protective functions, replace trusted firmware or command many windows without the required authority, with severe consequences.',
                de: 'Kritische Rechteüberschreitung — ein Benutzer kann ohne erforderliche Berechtigung Schutzfunktionen deaktivieren, vertrauenswürdige Firmware ersetzen oder viele Fenster mit schweren Folgen steuern.',
              },
              example: {
                en: 'An ordinary account gains Manager administrator rights and can issue building-wide movement commands, replace trusted firmware or disable obstacle stop.',
                de: 'Ein gewöhnliches Konto erhält Administratorrechte im Manager und kann gebäudeweite Bewegungsbefehle auslösen, vertrauenswürdige Firmware ersetzen oder den Hindernisstopp deaktivieren.',
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
            en: 'Choose by the highest credible consequence for this window-system asset. Consider its mechanism, location, users, affected window group and dependence on the Automation Manager.',
            de: 'Nach der höchsten plausiblen Folge für dieses Asset des Fenstersystems wählen. Mechanismus, Einbauort, Nutzer, betroffene Fenstergruppe und Abhängigkeit vom Automation Manager berücksichtigen.',
          },
          example: {
            en: 'Compare one locally operated window with a Manager controlling many windows. Record whether local controls and protective functions remain effective, and the consequences if they do not. Asset type or window count alone does not determine the category.',
            de: 'Ein lokal bedientes Fenster mit einem Manager für viele Fenster vergleichen. Dokumentieren, ob lokale Bedienung und Schutzfunktionen wirksam bleiben und welche Folgen ihr Ausfall hätte. Asset-Typ oder Fensteranzahl allein bestimmen die Kategorie nicht.',
          },
          valueSource: 'protectionNA',
          interpretations: [
            {
              label: {
                en: 'I',
                de: 'I',
              },
              meaning: {
                en: 'Low-consequence impersonation — a false identity affects only non-sensitive displays or reports, with no ability to issue window commands or change protective settings.',
                de: 'Wenig folgenschwere Identitätstäuschung — eine falsche Identität betrifft nur nicht sensible Anzeigen oder Berichte; Fensterbefehle oder Änderungen von Schutzeinstellungen sind nicht möglich.',
              },
              example: {
                en: 'Someone impersonates a viewer of a public demonstration display. They can see non-sensitive information but cannot issue window commands.',
                de: 'Jemand gibt sich als Betrachter einer öffentlichen Demonstrationsanzeige aus. Nicht sensible Informationen sind sichtbar, Fensterbefehle jedoch nicht möglich.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Operational impersonation — a false occupant, installer, device or service identity gains access to one window or a limited group, causing contained operational or privacy harm.',
                de: 'Betrieblich erhebliche Identitätstäuschung — eine falsche Bewohner-, Installateur-, Geräte- oder Dienstidentität erhält Zugriff auf ein Fenster oder eine begrenzte Gruppe und verursacht begrenzte Betriebs- oder Datenschutzschäden.',
              },
              example: {
                en: 'A fake installer or service tool is trusted and changes one window group’s calibration or schedule, causing contained operational disruption.',
                de: 'Einem falschen Installateur oder Servicewerkzeug wird vertraut. Geänderte Kalibrierung oder Zeitpläne einer Fenstergruppe verursachen begrenzte Betriebsstörungen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Critical impersonation — a false Manager, administrator, protective sensor or firmware supplier is trusted, allowing dangerous movement or compromise of many windows.',
                de: 'Kritische Identitätstäuschung — einem falschen Manager, Administrator, Schutzsensor oder Firmware-Lieferanten wird vertraut; gefährliche Bewegung oder die Kompromittierung vieler Fenster wird möglich.',
              },
              example: {
                en: 'Window controllers trust a fake Automation Manager or firmware supplier and accept dangerous commands or malicious updates affecting many windows.',
                de: 'Fenstersteuerungen vertrauen einem falschen Automation Manager oder Firmware-Lieferanten und akzeptieren gefährliche Befehle oder schädliche Updates für viele Fenster.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'For automated window systems, assess HW, SW, firmware, data and functions separately. I: local inconvenience handled through routine work while required window operation remains available. II: substantial but contained disruption, repair effort or sensitive disclosure involving a window, room or group. III: severe injury, major building damage, loss of essential control or exposure of critical secrets. Assess each security property separately. An Automation Manager can propagate commands, configuration changes or updates to many windows: document its actual reach and the independence of local controls. A single window can also be category III if dangerous movement can seriously injure someone. A Manager is not automatically III when local operation limits the consequences. Examples assume the named mechanism or feature exists; adapt them to the installation. These are protection-need categories, distinct from SL-T. Record the rationale and agreed company thresholds.',
        de: 'Bei automatisierten Fenstersystemen HW, SW, Firmware, Daten und Funktionen getrennt bewerten. I: lokale Unannehmlichkeit, im Routinebetrieb behebbar; die erforderliche Fensterbedienung bleibt verfügbar. II: erhebliche, aber begrenzte Störung, Reparaturaufwand oder sensible Offenlegung bei einem Fenster, Raum oder einer Gruppe. III: schwere Verletzung, großer Gebäudeschaden, Verlust wesentlicher Steuerung oder Offenlegung kritischer Geheimnisse. Jede Sicherheitseigenschaft getrennt bewerten. Ein Automation Manager kann Befehle, Konfigurationsänderungen oder Updates an viele Fenster verteilen: tatsächliche Reichweite und Unabhängigkeit lokaler Steuerungen dokumentieren. Auch ein einzelnes Fenster kann Kategorie III haben, wenn gefährliche Bewegung schwere Verletzungen verursachen kann. Ein Manager ist nicht automatisch III, wenn lokale Bedienung die Folgen begrenzt. Beispiele setzen voraus, dass der genannte Mechanismus oder die Funktion vorhanden ist; an die Installation anpassen. Dies sind Schutzbedarfskategorien, getrennt von SL-T. Begründung und vereinbarte Unternehmensgrenzen dokumentieren.',
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
            en: 'Injury from unintended window closing; rainwater damage from windows left open; loss of ventilation in an occupied building zone.',
            de: 'Verletzung durch unbeabsichtigtes Fensterschließen; Regenwasserschaden durch offen bleibende Fenster; Ausfall der Lüftung einer belegten Gebäudezone.',
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
            en: 'Pinching; Rainwater; VentLoss.',
            de: 'Einklemmen; Regen; LüftAusf.',
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
            en: 'Describe the harmful outcome, affected people or property, and assumptions: mechanism, window accessibility, number of windows, weather, occupancy, local fallback and restoration time.',
            de: 'Schädliche Folge, betroffene Personen oder Sachwerte und Annahmen beschreiben: Mechanismus, Zugänglichkeit der Fenster, Fensteranzahl, Wetter, Belegung, lokale Ersatzbedienung und Wiederherstellungsdauer.',
          },
          values: {
            en: 'Optional free text for custom scenarios. The five standard damage scenarios below explain which type of harm to assess; one incident may affect several scenarios.',
            de: 'Optionaler Freitext für eigene Szenarien. Die fünf Standardszenarien unten erläutern die jeweils zu bewertende Schadensart; ein Vorfall kann mehrere Szenarien betreffen.',
          },
          example: {
            en: 'A compromised Automation Manager leaves an exposed window group open during heavy rain. Water damages interiors and customer equipment because the windows cannot be reached or closed locally in time. State the affected rooms, assumed conditions and available manual intervention.',
            de: 'Ein kompromittierter Automation Manager lässt eine exponierte Fenstergruppe bei Starkregen offen. Wasser beschädigt Innenräume und Kundenausrüstung, weil die Fenster nicht rechtzeitig erreicht oder lokal geschlossen werden können. Betroffene Räume, angenommene Bedingungen und mögliche manuelle Eingriffe angeben.',
          },
          interpretations: [
            {
              label: {
                en: 'DS1 — Danger to life and limb',
                de: 'DS1 — Gefahr für Leib und Leben',
              },
              meaning: {
                en: 'Harm to occupants, installers or service staff caused by unsafe window behaviour. Consider unintended movement, trapping or crushing, and failure of protective functions. Assess the possible injury and who can be exposed; one window can already cause severe harm.',
                de: 'Schaden für Bewohner, Installateure oder Servicepersonal durch unsicheres Fensterverhalten. Unbeabsichtigte Bewegung, Einklemmen oder Quetschen sowie ausgefallene Schutzfunktionen berücksichtigen. Mögliche Verletzung und gefährdete Personen bewerten; bereits ein Fenster kann schwere Schäden verursachen.',
              },
              example: {
                en: 'A window closes while a hand is in the closing area and obstacle detection fails to stop the movement.',
                de: 'Ein Fenster schließt, während sich eine Hand im Schließbereich befindet, und die Hinderniserkennung stoppt die Bewegung nicht.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No credible path from this asset to injury in the assessed installation. Document why movement or protective functions cannot be affected.',
                    de: 'Kein plausibler Weg von diesem Asset zu einer Verletzung in der bewerteten Installation. Begründen, warum Bewegung oder Schutzfunktionen nicht beeinflusst werden können.',
                  },
                  example: {
                    en: 'An isolated copy of a public window illustration has no connection to the control system.',
                    de: 'Eine isolierte Kopie einer öffentlichen Fensterabbildung hat keine Verbindung zum Steuerungssystem.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'Brief discomfort or minor, temporary harm with no lasting impairment. Assess the credible physical consequence, including who can reach the window.',
                    de: 'Kurzes Unbehagen oder geringfügige, vorübergehende Beeinträchtigung ohne bleibende Folgen. Die plausible körperliche Folge bewerten, einschließlich der Personen, die das Fenster erreichen können.',
                  },
                  example: {
                    en: 'Unexpected ventilation causes temporary discomfort; the documented installation rules out contact with moving parts.',
                    de: 'Unerwartete Lüftung verursacht vorübergehendes Unbehagen; die dokumentierte Installation schließt Kontakt mit bewegten Teilen aus.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A reversible injury with a meaningful recovery period or temporary restriction of normal activities, within the agreed company severity criteria.',
                    de: 'Eine reversible Verletzung mit nennenswerter Erholungszeit oder vorübergehender Einschränkung normaler Tätigkeiten, innerhalb der vereinbarten Unternehmenskriterien.',
                  },
                  example: {
                    en: 'Unintended closing causes a hand injury that temporarily prevents normal work, with no expected permanent impairment.',
                    de: 'Unbeabsichtigtes Schließen verursacht eine Handverletzung, die normale Arbeit vorübergehend verhindert, ohne erwartete bleibende Beeinträchtigung.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Serious injury, permanent impairment or a life-threatening outcome. One exposed person and one window are sufficient for this rating.',
                    de: 'Schwere Verletzung, bleibende Beeinträchtigung oder lebensbedrohliche Folge. Bereits eine gefährdete Person und ein Fenster reichen für diese Einstufung aus.',
                  },
                  example: {
                    en: 'Closing continues after obstacle detection fails and causes a severe crushing injury.',
                    de: 'Nach Ausfall der Hinderniserkennung setzt sich die Schließbewegung fort und verursacht eine schwere Quetschverletzung.',
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
                en: 'Direct and indirect monetary loss for the customer, building operator or manufacturer. Include damaged windows or interiors, repair visits, replacement, downtime costs and service campaigns or recalls. Assess the total credible cost and how many installations could be affected.',
                de: 'Direkte und indirekte finanzielle Verluste für Kunden, Gebäudebetreiber oder Hersteller. Beschädigte Fenster oder Innenräume, Reparatureinsätze, Ersatz, Ausfallkosten sowie Serviceaktionen oder Rückrufe berücksichtigen. Plausible Gesamtkosten und die Anzahl möglicherweise betroffener Installationen bewerten.',
              },
              example: {
                en: 'The Automation Manager leaves several windows open during heavy rain. Water damages interiors and equipment, requiring repairs and customer compensation.',
                de: 'Der Automation Manager lässt mehrere Fenster bei Starkregen offen. Wasser beschädigt Innenräume und Geräte; Reparaturen und Entschädigungen für Kunden werden erforderlich.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No credible financial loss for the customer, operator or manufacturer from this asset/scenario pair. Explain the absence of repair, recovery and indirect costs.',
                    de: 'Kein plausibler finanzieller Verlust für Kunden, Betreiber oder Hersteller durch dieses Asset/Szenario-Paar. Begründen, warum Reparatur-, Wiederherstellungs- und indirekte Kosten entfallen.',
                  },
                  example: {
                    en: 'Someone reads an already public brochure; no additional cost or commercial loss is credible.',
                    de: 'Jemand liest eine bereits öffentliche Broschüre; zusätzliche Kosten oder geschäftliche Verluste sind nicht plausibel.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A small, local cost within the agreed routine-service threshold. No significant replacement, property damage or wider corrective action is needed.',
                    de: 'Geringe lokale Kosten innerhalb der vereinbarten Grenze für Routine-Service. Kein erheblicher Ersatz, Sachschaden oder umfassender Korrekturbedarf.',
                  },
                  example: {
                    en: 'An installer corrects one window setting during an already planned visit without replacing parts.',
                    de: 'Ein Installateur korrigiert bei einem ohnehin geplanten Besuch eine Fenstereinstellung, ohne Teile auszutauschen.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A substantial but contained cost requiring an unplanned repair, replacement or customer compensation. Use agreed financial bands and total credible costs.',
                    de: 'Erhebliche, aber begrenzte Kosten durch ungeplante Reparatur, Ersatz oder Kundenentschädigung. Vereinbarte finanzielle Bandgrenzen und plausible Gesamtkosten verwenden.',
                  },
                  example: {
                    en: 'A faulty window damages its actuator and nearby interior fittings, requiring a dedicated repair visit.',
                    de: 'Ein fehlerhaftes Fenster beschädigt seinen Antrieb und nahe Innenausstattung; ein gesonderter Reparatureinsatz ist nötig.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Major financial loss exceeding the agreed high-impact threshold, through extensive property damage, a large service campaign or other substantial direct and indirect costs.',
                    de: 'Großer finanzieller Verlust oberhalb der vereinbarten Grenze für hohe Auswirkungen, durch umfangreiche Sachschäden, eine große Serviceaktion oder andere erhebliche direkte und indirekte Kosten.',
                  },
                  example: {
                    en: 'The Manager leaves many exposed windows open during a storm, causing extensive water damage and compensation claims.',
                    de: 'Der Manager lässt bei einem Sturm viele exponierte Fenster offen; umfangreiche Wasserschäden und Entschädigungsforderungen entstehen.',
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
                en: 'Loss or degradation of the intended window-system operation: opening, closing, ventilation, status feedback or coordinated group control. Assess the affected windows, outage duration and recovery effort. Check whether accessible local controls provide an effective alternative when the Automation Manager fails.',
                de: 'Ausfall oder Einschränkung des vorgesehenen Fenstersystembetriebs: Öffnen, Schließen, Lüften, Statusrückmeldung oder koordinierte Gruppensteuerung. Betroffene Fenster, Ausfalldauer und Wiederherstellungsaufwand bewerten. Prüfen, ob zugängliche lokale Bedienelemente bei Ausfall des Automation Managers eine wirksame Alternative bieten.',
              },
              example: {
                en: 'A corrupted Manager configuration stops scheduled ventilation in one building zone until an installer restores the window-group settings.',
                de: 'Eine beschädigte Manager-Konfiguration unterbricht die zeitgesteuerte Lüftung einer Gebäudezone, bis ein Installateur die Fenstergruppeneinstellungen wiederherstellt.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'The asset does not support current window operation, monitoring, maintenance or recovery, and its loss cannot impair them in the assessed scope.',
                    de: 'Das Asset unterstützt weder aktuellen Fensterbetrieb noch Überwachung, Wartung oder Wiederherstellung; sein Verlust kann diese im bewerteten Umfang nicht beeinträchtigen.',
                  },
                  example: {
                    en: 'An obsolete duplicate demonstration file is neither used by the running system nor needed for service.',
                    de: 'Eine veraltete doppelte Demonstrationsdatei wird weder vom laufenden System verwendet noch für den Service benötigt.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A short or minor loss of convenience. Required opening, closing and protective functions remain available through a practical alternative.',
                    de: 'Kurzer oder geringfügiger Komfortverlust. Erforderliches Öffnen, Schließen und Schutzfunktionen bleiben über eine praktikable Alternative verfügbar.',
                  },
                  example: {
                    en: 'The Manager status screen is unavailable, but occupants can still operate the windows using accessible local buttons.',
                    de: 'Die Statusanzeige des Managers fällt aus; Bewohner können die Fenster weiterhin über zugängliche lokale Taster bedienen.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'Important operation is interrupted for a window or group and needs deliberate recovery. A usable fallback contains the disruption within the agreed tolerable period.',
                    de: 'Wichtiger Betrieb eines Fensters oder einer Gruppe ist unterbrochen und erfordert gezielte Wiederherstellung. Eine nutzbare Ersatzlösung begrenzt die Störung innerhalb der vereinbarten tolerierbaren Dauer.',
                  },
                  example: {
                    en: 'Scheduled ventilation stops in one zone until an installer restores the Manager settings; staff can temporarily operate those windows locally.',
                    de: 'Zeitgesteuerte Lüftung einer Zone fällt bis zur Wiederherstellung der Manager-Einstellungen aus; Personal kann die Fenster vorübergehend lokal bedienen.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Required operation is lost beyond the maximum tolerable outage with no effective fallback. Assess the essential function and consequences, not only the number of windows.',
                    de: 'Erforderlicher Betrieb fällt über die maximal tolerierbare Ausfallzeit hinaus aus, ohne wirksame Ersatzlösung. Wesentliche Funktion und Folgen bewerten, nicht nur die Fensteranzahl.',
                  },
                  example: {
                    en: 'A failed shared update leaves inaccessible windows open and unable to close when weather protection is needed.',
                    de: 'Ein fehlgeschlagenes gemeinsames Update lässt unzugängliche Fenster offen; sie können trotz erforderlichen Wetterschutzes nicht geschlossen werden.',
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
                en: 'Loss of confidentiality or control over personal, customer or sensitive technical information. Window-use histories can reveal occupancy and routines; installation details, credentials and proprietary designs can also be sensitive. Assess what is exposed, who is affected and the extent of the disclosure.',
                de: 'Verlust der Vertraulichkeit oder Kontrolle über personenbezogene, kundenbezogene oder sensible technische Informationen. Fenster-Nutzungsverläufe können Belegung und Gewohnheiten offenbaren; auch Installationsdetails, Zugangsdaten und proprietäre Entwürfe können sensibel sein. Offengelegte Informationen, Betroffene und Umfang der Offenlegung bewerten.',
              },
              example: {
                en: 'An unauthorized person downloads Manager logs linking window opening times to named rooms and occupants, revealing when those rooms are used.',
                de: 'Eine unbefugte Person lädt Manager-Protokolle herunter, die Fensteröffnungszeiten mit benannten Räumen und Bewohnern verknüpfen und deren Nutzung offenlegen.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No personal, confidential customer or sensitive technical information can be exposed through this asset in the assessed context. Record what information is actually present.',
                    de: 'Über dieses Asset können im bewerteten Kontext keine personenbezogenen, vertraulichen Kunden- oder sensiblen technischen Informationen offengelegt werden. Tatsächlich vorhandene Informationen dokumentieren.',
                  },
                  example: {
                    en: 'A standalone public demonstration contains only published product information and has no customer connection or credentials.',
                    de: 'Eine eigenständige öffentliche Demonstration enthält nur veröffentlichte Produktinformationen und weder Kundenanbindung noch Zugangsdaten.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'Limited disclosure of low-sensitivity internal information, without access secrets or identifiable occupant behaviour. Consequences are local and minor.',
                    de: 'Begrenzte Offenlegung wenig sensibler interner Informationen, ohne Zugangsgeheimnisse oder identifizierbares Bewohnerverhalten. Die Folgen sind lokal und gering.',
                  },
                  example: {
                    en: 'An internal list of window models and software versions is exposed without customer names, addresses or usage histories.',
                    de: 'Eine interne Liste von Fenstermodellen und Softwareversionen wird ohne Kundennamen, Adressen oder Nutzungsverläufe offengelegt.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'Disclosure of sensitive customer, technical or personal information causes substantial but contained harm. Consider identifiability, detail and likely use of the information.',
                    de: 'Offenlegung sensibler Kunden-, Technik- oder Personendaten verursacht erheblichen, aber begrenzten Schaden. Identifizierbarkeit, Detailgrad und mögliche Nutzung der Informationen berücksichtigen.',
                  },
                  example: {
                    en: 'Opening histories for one installation are disclosed with room and occupant details, revealing daily routines.',
                    de: 'Öffnungsverläufe einer Installation werden mit Raum- und Bewohnerangaben offengelegt und verraten Tagesabläufe.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Exposure of critical secrets or highly sensitive information causes severe or lasting harm. Extensive disclosure can increase severity, but one critical secret may already qualify.',
                    de: 'Offenlegung kritischer Geheimnisse oder hochsensibler Informationen verursacht schwere oder dauerhafte Schäden. Ein großer Umfang kann die Schwere erhöhen; bereits ein kritisches Geheimnis kann genügen.',
                  },
                  example: {
                    en: 'Manager administrator credentials for many installations or the manufacturer’s private firmware-signing key are disclosed.',
                    de: 'Manager-Administratorzugangsdaten vieler Installationen oder der private Firmware-Signaturschlüssel des Herstellers werden offengelegt.',
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
                en: 'Consequences of failing applicable legal or regulatory obligations, such as those concerning product safety or data protection. Record the relevant obligation and the credible consequence, which may include corrective action, restrictions on supply, liability or penalties. Rate this separately from the associated injury, outage or financial loss.',
                de: 'Folgen der Nichterfüllung anwendbarer gesetzlicher oder regulatorischer Pflichten, etwa zur Produktsicherheit oder zum Datenschutz. Relevante Pflicht und plausible Folge festhalten, beispielsweise Korrekturmaßnahmen, Beschränkungen der Bereitstellung, Haftung oder Sanktionen. Diese Folgen getrennt von zugehöriger Verletzung, Betriebsausfall oder finanziellem Verlust bewerten.',
              },
              example: {
                en: 'A defect disables a required protective function. Assess the legal consequences of supplying the affected window systems against the obligations applicable to that product and market.',
                de: 'Ein Defekt deaktiviert eine erforderliche Schutzfunktion. Die rechtlichen Folgen der Bereitstellung betroffener Fenstersysteme anhand der für Produkt und Markt anwendbaren Pflichten bewerten.',
              },
              ratings: [
                {
                  value: 'N/A',
                  meaning: {
                    en: 'No applicable legal or regulatory obligation can credibly be affected by this asset/scenario pair. Document the scope and basis; uncertainty about obligations is not N/A.',
                    de: 'Durch dieses Asset/Szenario-Paar kann plausibel keine anwendbare gesetzliche oder regulatorische Pflicht betroffen sein. Umfang und Grundlage dokumentieren; unklare Pflichten bedeuten nicht N/A.',
                  },
                  example: {
                    en: 'An isolated demonstration theme has no role in the delivered product, required information or personal-data handling, as documented in the assessment.',
                    de: 'Ein isoliertes Demonstrationsdesign hat laut dokumentierter Bewertung keine Rolle im ausgelieferten Produkt, in vorgeschriebenen Informationen oder bei der Verarbeitung personenbezogener Daten.',
                  },
                },
                {
                  value: '1',
                  meaning: {
                    en: 'A limited compliance issue with minor consequences that can be corrected through routine action. The applicable obligation and expected consequence must support this rating.',
                    de: 'Begrenzte Abweichung mit geringen Folgen, die durch Routinekorrektur behoben werden kann. Anwendbare Pflicht und erwartete Folge müssen diese Einstufung tragen.',
                  },
                  example: {
                    en: 'A minor error in required product information needs correction, with no credible effect on safe use or privacy and no substantial further consequence under the applicable obligation.',
                    de: 'Ein kleiner Fehler in erforderlichen Produktinformationen muss korrigiert werden; nach der anwendbaren Pflicht bestehen keine plausiblen Folgen für sichere Nutzung oder Privatsphäre und keine erheblichen weiteren Konsequenzen.',
                  },
                },
                {
                  value: '2',
                  meaning: {
                    en: 'A material but contained failure to meet an applicable obligation requires formal corrective action or creates significant liability. Assess the actual obligation, rather than assuming every breach has the same consequence.',
                    de: 'Wesentliche, aber begrenzte Nichterfüllung einer anwendbaren Pflicht erfordert formelle Korrekturmaßnahmen oder begründet erhebliche Haftung. Die konkrete Pflicht bewerten, statt jede Verletzung gleich einzustufen.',
                  },
                  example: {
                    en: 'Improper handling of one customer’s Manager logs leads to a substantiated complaint and a documented formal correction process.',
                    de: 'Fehlerhafter Umgang mit Manager-Protokollen eines Kunden führt zu einer begründeten Beschwerde und einem dokumentierten formellen Korrekturverfahren.',
                  },
                },
                {
                  value: '3',
                  meaning: {
                    en: 'Severe consequences under the applicable obligations, potentially including restrictions on supply, a mandatory recall, major penalties or serious liability. State the basis for these consequences; they are not automatic.',
                    de: 'Schwere Folgen nach den anwendbaren Pflichten, möglicherweise einschließlich Bereitstellungsbeschränkungen, verpflichtendem Rückruf, erheblichen Sanktionen oder schwerwiegender Haftung. Die Grundlage dieser Folgen angeben; sie treten nicht automatisch ein.',
                  },
                  example: {
                    en: 'A defect defeats a required protective function across a delivered window range. The documented legal assessment identifies a mandatory recall or restriction on further supply.',
                    de: 'Ein Defekt setzt eine erforderliche Schutzfunktion einer ausgelieferten Fensterbaureihe außer Kraft. Die dokumentierte rechtliche Bewertung ergibt einen verpflichtenden Rückruf oder eine Beschränkung weiterer Bereitstellung.',
                  },
                },
              ],
            },
          ],
        },
      ],
      intro: {
        en: 'Describe the harmful outcome for occupants, customers, building operators or the manufacturer. Examples include injury from window movement, water damage and repair costs, loss of ventilation, or exposure of occupancy information. Choose the matching configured damage category, including legal consequences where applicable. A forged Manager command is a possible cause; the resulting injury or damage is the scenario to assess.',
        de: 'Die schädliche Folge für Bewohner, Kunden, Gebäudebetreiber oder Hersteller beschreiben. Beispiele sind Verletzungen durch Fensterbewegung, Wasserschäden und Reparaturkosten, Lüftungsausfall oder Offenlegung von Belegungsinformationen. Die passende konfigurierte Schadenskategorie wählen, gegebenenfalls einschließlich rechtlicher Folgen. Ein gefälschter Manager-Befehl ist eine mögliche Ursache; die daraus folgende Verletzung oder der Schaden ist das zu bewertende Szenario.',
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
            en: 'Compare the consequence of a failed window actuator with the same failure affecting all windows managed together. Agree limits for service downtime, repair/recall costs, affected rooms and people, and data sensitivity. Document accessible local controls, weather exposure and the agreed maximum tolerable outage.',
            de: 'Die Folgen eines ausgefallenen Fensterantriebs mit demselben Ausfall aller gemeinsam verwalteten Fenster vergleichen. Grenzen für Betriebsausfall, Reparatur-/Rückrufkosten, betroffene Räume und Personen sowie Datensensibilität vereinbaren. Zugängliche lokale Bedienung, Witterungsexposition und die vereinbarte maximal tolerierbare Ausfallzeit dokumentieren.',
          },
          interpretations: [
            {
              value: 'N/A',
              meaning: {
                en: 'Not applicable: this asset cannot credibly cause the specific damage in the assessed installation. Do not use it for low impact or uncertainty. An untouched cell also displays N/A; record an explicit justification.',
                de: 'Nicht anwendbar: Dieses Asset kann den konkreten Schaden in der bewerteten Installation plausibel nicht verursachen. Nicht für geringe Folgen oder Unsicherheit verwenden. Auch eine unberührte Zelle zeigt N/A; ausdrücklich begründen.',
              },
              example: {
                en: 'An isolated public window brochure cannot control an actuator or affect obstacle detection. Record this separation when marking personal injury as not applicable.',
                de: 'Eine isolierte öffentliche Fensterbroschüre kann keinen Antrieb steuern oder die Hinderniserkennung beeinflussen. Diese Trennung bei der Einstufung von Personenschäden als nicht anwendbar dokumentieren.',
              },
            },
            {
              value: '1',
              meaning: {
                en: 'Low — limited, local harm handled through routine work or an effective alternative. Required window operation remains available and there is no credible serious injury or major secondary damage.',
                de: 'Gering — begrenzter, lokaler Schaden, durch Routinearbeit oder wirksame Ersatzlösung beherrschbar. Erforderliche Fensterbedienung bleibt möglich; schwere Verletzung oder großer Folgeschaden ist nicht plausibel.',
              },
              example: {
                en: 'The Manager display stops working, but local buttons and protective functions remain available. The result is a temporary inconvenience resolved during routine service.',
                de: 'Die Manager-Anzeige fällt aus, lokale Taster und Schutzfunktionen bleiben jedoch verfügbar. Es entsteht eine vorübergehende Unannehmlichkeit, die beim regulären Service behoben wird.',
              },
            },
            {
              value: '2',
              meaning: {
                en: 'Medium — substantial but contained harm to people, window operation, customer property or the manufacturer. Dedicated repair, recovery or corrective action is needed.',
                de: 'Mittel — erheblicher, aber begrenzter Schaden für Personen, Fensterbetrieb, Kundeneigentum oder Hersteller. Gezielte Reparatur, Wiederherstellung oder Korrekturmaßnahmen sind nötig.',
              },
              example: {
                en: 'One window group loses automatic ventilation and needs an installer to restore it. Local controls contain the disruption, but the customer faces a service visit, repair costs and temporary loss of comfort.',
                de: 'Die automatische Lüftung einer Fenstergruppe fällt aus und muss durch einen Installateur wiederhergestellt werden. Lokale Bedienung begrenzt die Störung, für den Kunden entstehen jedoch Servicebesuch, Reparaturkosten und vorübergehender Komfortverlust.',
              },
            },
            {
              value: '3',
              meaning: {
                en: 'High — severe harm, widespread disruption or damage that is difficult to reverse. A single window can qualify through serious injury; shared Manager control can increase the number of affected windows and people.',
                de: 'Hoch — schwerer Schaden, weitreichende Störung oder schwer rückgängig zu machende Folgen. Ein einzelnes Fenster kann durch schwere Verletzung genügen; gemeinsame Manager-Steuerung kann die Anzahl betroffener Fenster und Personen erhöhen.',
              },
              example: {
                en: 'Dangerous closing causes serious injury, or a Manager failure leaves many windows open during severe weather and causes extensive water damage. Loss of required operation without fallback beyond the maximum tolerable outage can also qualify.',
                de: 'Gefährliches Schließen verursacht schwere Verletzungen, oder ein Manager-Ausfall lässt viele Fenster bei Unwetter offen und verursacht umfangreiche Wasserschäden. Auch der Ausfall erforderlicher Bedienung ohne Ersatzlösung über die maximal tolerierbare Ausfallzeit hinaus kann diese Stufe begründen.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Rate each asset against each damage scenario in the installed window system. I/II/III describe an asset’s protection need; Low/Medium/High describe a particular harmful outcome, so do not copy the labels mechanically. Consider actuator force and travel, reachable closing areas, weather exposure, room use, number of jointly controlled windows and available local operation. An Automation Manager may spread a fault across a group or building; independent local protective functions may limit that harm. State these assumptions rather than assigning a higher rating solely because more windows are connected. Use only mechanisms and functions present in the product, and agree company thresholds for each damage category.',
        de: 'Jedes Asset gegen jedes Schadensszenario im installierten Fenstersystem bewerten. I/II/III beschreiben den Schutzbedarf eines Assets; Gering/Mittel/Hoch beschreiben eine konkrete schädliche Folge. Die Stufen daher nicht schematisch übertragen. Antriebskraft und -weg, erreichbare Schließbereiche, Witterung, Raumnutzung, Anzahl gemeinsam gesteuerter Fenster und lokale Bedienbarkeit berücksichtigen. Ein Automation Manager kann einen Fehler auf eine Gruppe oder ein Gebäude ausweiten; unabhängige lokale Schutzfunktionen können den Schaden begrenzen. Diese Annahmen dokumentieren, statt allein wegen mehr angeschlossener Fenster höher zu bewerten. Nur im Produkt vorhandene Mechanismen und Funktionen verwenden und Unternehmensgrenzen je Schadenskategorie vereinbaren.',
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
            en: 'Medium for DS3: the Automation Manager serves 12 windows in one zone. Automatic ventilation stops, but accessible local buttons remain usable and obstacle detection runs independently. An installer can restore the configuration during the agreed service period. Record evidence and any unverified assumptions.',
            de: 'Mittel bei DS3: Der Automation Manager bedient 12 Fenster einer Zone. Automatische Lüftung fällt aus, zugängliche lokale Taster bleiben nutzbar und Hinderniserkennung arbeitet unabhängig. Ein Installateur kann die Konfiguration innerhalb der vereinbarten Servicefrist wiederherstellen. Nachweise und ungeprüfte Annahmen festhalten.',
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
