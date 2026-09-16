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
            en: 'Component: hardware or interfaces. Data: information and software artefacts. Function: a capability or behaviour.',
            de: 'Komponente: Hardware oder Schnittstellen. Daten: Informationen und Softwareartefakte. Funktion: Fähigkeit oder Verhalten.',
          },
          example: {
            en: 'Component: controller, USB port. Data: firmware, cryptographic keys. Function: internal diagnostics, system shutdown.',
            de: 'Komponente: Steuerung, USB-Port. Daten: Firmware, kryptografische Schlüssel. Funktion: interne Diagnose, Systemabschaltung.',
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
                en: 'Disclosure causes limited inconvenience and is readily contained.',
                de: 'Offenlegung verursacht begrenzte, leicht beherrschbare Nachteile.',
              },
              example: {
                en: 'Internal equipment inventory without credentials or personal information.',
                de: 'Interne Geräteliste ohne Zugangsdaten oder personenbezogene Informationen.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Disclosure exposes sensitive business or personal information and causes significant harm to affected people or business activities.',
                de: 'Offenlegung sensibler Geschäfts- oder Personendaten schädigt Betroffene oder Geschäftsabläufe erheblich.',
              },
              example: {
                en: 'Customer contact records or non-public engineering drawings.',
                de: 'Kundenkontaktdaten oder nicht öffentliche Konstruktionszeichnungen.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Disclosure can cause severe or widespread harm, compromise essential secrets, or enable control of critical systems.',
                de: 'Offenlegung kann schwere oder weitreichende Schäden verursachen, wesentliche Geheimnisse preisgeben oder Zugriff auf kritische Systeme ermöglichen.',
              },
              example: {
                en: 'A private firmware-signing key or administrator credentials for an entire fleet.',
                de: 'Privater Firmware-Signaturschlüssel oder Administrator-Zugangsdaten für eine gesamte Geräteflotte.',
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
                en: 'Incorrect or changed information has limited consequences and can be detected and corrected through routine work.',
                de: 'Fehlerhafte oder veränderte Informationen haben begrenzte Folgen und lassen sich im Routinebetrieb erkennen und korrigieren.',
              },
              example: {
                en: 'A nonessential dashboard label is changed; control decisions are unaffected.',
                de: 'Eine unwesentliche Dashboard-Beschriftung wird geändert; Steuerungsentscheidungen bleiben unbeeinflusst.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Unauthorised changes can materially affect decisions, product quality or operations and require deliberate recovery.',
                de: 'Unbefugte Änderungen können Entscheidungen, Produktqualität oder Betrieb erheblich beeinträchtigen und gezielte Wiederherstellung erfordern.',
              },
              example: {
                en: 'A production recipe is altered, causing rejected batches and rework.',
                de: 'Eine Produktionsrezeptur wird verändert und verursacht Ausschuss und Nacharbeit.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Unauthorised changes can cause dangerous behaviour, loss of trusted control or severe, widespread damage.',
                de: 'Unbefugte Änderungen können gefährliches Verhalten, Verlust vertrauenswürdiger Steuerung oder schwere, weitreichende Schäden verursachen.',
              },
              example: {
                en: 'Manipulated safety limits, control firmware or trusted update packages.',
                de: 'Manipulierte Sicherheitsgrenzen, Steuerungsfirmware oder vertrauenswürdige Update-Pakete.',
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
                en: 'Interruption causes limited inconvenience; normal work can continue with a practical workaround and routine recovery.',
                de: 'Eine Unterbrechung verursacht begrenzte Nachteile; die Arbeit kann mit einer praktikablen Ersatzlösung und routinemäßiger Wiederherstellung fortgesetzt werden.',
              },
              example: {
                en: 'A reporting dashboard is offline while the controlled process keeps running.',
                de: 'Ein Berichts-Dashboard fällt aus, während der gesteuerte Prozess weiterläuft.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Interruption materially disrupts service or production; workarounds are limited and recovery effort is significant.',
                de: 'Eine Unterbrechung stört Dienstleistung oder Produktion erheblich; Ersatzlösungen sind begrenzt und die Wiederherstellung ist aufwendig.',
              },
              example: {
                en: 'One production cell stops until a controller is restored.',
                de: 'Eine Produktionszelle steht still, bis eine Steuerung wiederhergestellt ist.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Interruption can stop an essential function, exceed the tolerable outage or cause severe cascading or safety consequences.',
                de: 'Eine Unterbrechung kann eine wesentliche Funktion stilllegen, die tolerierbare Ausfallzeit überschreiten oder schwere Folge- bzw. Sicherheitsschäden verursachen.',
              },
              example: {
                en: 'Loss of an essential monitoring or control function with no workable fallback.',
                de: 'Ausfall einer wesentlichen Überwachungs- oder Steuerungsfunktion ohne nutzbare Ersatzlösung.',
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
                en: 'Exceeding assigned permissions affects only low-consequence actions or information and is easily corrected.',
                de: 'Eine Überschreitung zugewiesener Rechte betrifft nur wenig folgenschwere Aktionen oder Informationen und lässt sich leicht korrigieren.',
              },
              example: {
                en: 'A viewer changes a nonessential display preference shared by a small team.',
                de: 'Ein Betrachter ändert eine unwesentliche Anzeigeeinstellung für ein kleines Team.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Exceeding permissions can alter important settings, expose sensitive data or disrupt a bounded part of operations.',
                de: 'Eine Rechteüberschreitung kann wichtige Einstellungen ändern, sensible Daten offenlegen oder einen begrenzten Betriebsbereich stören.',
              },
              example: {
                en: 'An operator changes maintenance settings outside their assigned role.',
                de: 'Ein Bediener ändert Wartungseinstellungen außerhalb seiner zugewiesenen Rolle.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'Exceeding permissions can bypass critical safeguards or grant broad administrative control with severe consequences.',
                de: 'Eine Rechteüberschreitung kann kritische Schutzmaßnahmen umgehen oder umfassende Administratorrechte mit schweren Folgen gewähren.',
              },
              example: {
                en: 'A normal user disables safety controls or deploys software across the fleet.',
                de: 'Ein normaler Benutzer deaktiviert Schutzfunktionen oder verteilt Software in der gesamten Flotte.',
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
                en: 'Mistaking an identity has limited consequences because the identity can access only low-consequence functions or information.',
                de: 'Eine falsche Identitätszuordnung hat begrenzte Folgen, da die Identität nur auf wenig folgenschwere Funktionen oder Informationen zugreifen kann.',
              },
              example: {
                en: 'Impersonating a user of a nonsensitive, read-only status portal.',
                de: 'Nachahmen eines Benutzers eines unkritischen Statusportals mit reinem Lesezugriff.',
              },
            },
            {
              label: {
                en: 'II',
                de: 'II',
              },
              meaning: {
                en: 'Impersonating a user, device or service can expose sensitive information or disrupt a bounded part of operations.',
                de: 'Das Vortäuschen einer Benutzer-, Geräte- oder Dienstidentität kann sensible Informationen offenlegen oder einen begrenzten Betriebsbereich stören.',
              },
              example: {
                en: 'A fake maintenance user gains access to one machine’s configuration.',
                de: 'Ein vorgetäuschter Wartungsbenutzer erhält Zugriff auf die Konfiguration einer Maschine.',
              },
            },
            {
              label: {
                en: 'III',
                de: 'III',
              },
              meaning: {
                en: 'A false identity can gain critical privileges or trusted access with severe or widespread consequences.',
                de: 'Eine falsche Identität kann kritische Rechte oder vertrauenswürdigen Zugang mit schweren oder weitreichenden Folgen erhalten.',
              },
              example: {
                en: 'Impersonating a fleet administrator or a trusted firmware update service.',
                de: 'Vortäuschen eines Flottenadministrators oder eines vertrauenswürdigen Firmware-Update-Dienstes.',
              },
            },
          ],
        },
      ],
      intro: {
        en: 'Proposed protection needs: I = limited consequences, II = significant consequences, III = severe consequences. Assess each property separately; I still means protection is needed. These are company guidance levels, not IEC security levels. Examples illustrate possible contexts, not automatic classifications. Agree measurable boundaries and record assumptions.',
        de: 'Vorgeschlagener Schutzbedarf: I = begrenzte Folgen, II = erhebliche Folgen, III = schwere Folgen. Jede Eigenschaft getrennt bewerten; auch I erfordert Schutz. Dies sind unternehmensbezogene Orientierungsstufen, keine IEC-Security-Levels. Beispiele zeigen mögliche Kontexte, keine automatischen Einstufungen. Messbare Grenzen vereinbaren und Annahmen dokumentieren.',
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
            en: 'Select existing goals that address this risk. Create new goals in Security Goals first.',
            de: 'Vorhandene Ziele auswählen, die dieses Risiko adressieren. Neue Ziele zuerst unter Security-Ziele anlegen.',
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
            en: 'Leaf notes / rationale',
            de: 'Blattnotizen / Begründung',
          },
          kind: 'conditional',
          help: {
            en: 'Explain the treatment decision and evidence.',
            de: 'Behandlungsentscheidung und Nachweise erläutern.',
          },
          values: {
            en: 'Required for a complete Accepted or Delegated leaf; optional for Mitigated.',
            de: 'Für ein vollständiges akzeptiertes oder delegiertes Blatt erforderlich; bei Mitigiert optional.',
          },
          example: {
            en: 'Integrator contract assigns network isolation; reference the agreement and owner.',
            de: 'Integratorenvertrag weist Netztrennung zu; Vereinbarung und Verantwortlichen nennen.',
          },
        },
        {
          id: 'residual-measure',
          label: {
            en: 'Security concept measure',
            de: 'Maßnahme aus Security-Konzept',
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
            en: 'Whole-risk residual notes',
            de: 'Restrisikonotiz zum gesamten Risiko',
          },
          kind: 'conditional',
          help: {
            en: 'Record the overall residual-risk decision and remaining limitations.',
            de: 'Gesamtentscheidung zum Restrisiko und verbleibende Einschränkungen dokumentieren.',
          },
          values: {
            en: 'Required for the completion indicator when the residual class is High or Critical; optional for lower classes.',
            de: 'Für die Vollständigkeitsanzeige bei hohem oder kritischem Restrisiko erforderlich; bei niedrigeren Klassen optional.',
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
        en: 'Settings → Residual SL matrix',
        de: 'Einstellungen → Restrisiko-SL-Matrix',
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
            en: 'Residual SL-C planning matrix',
            de: 'Planungsmatrix für Restrisiko-SL-C',
          },
          kind: 'conditional',
          help: {
            en: 'Assign an output level for each combination of feasibility band and impact band.',
            de: 'Für jede Kombination aus Durchführbarkeits- und Auswirkungsband einen Ergebnislevel festlegen.',
          },
          values: {
            en: 'Each of 16 cells accepts blank or SL 0–4. Complete all cells to enable the result. This is a company-defined planning lookup, not evidence of IEC 62443 capability or a prescribed IEC matrix. It does not change SL-T.',
            de: 'Jede der 16 Zellen erlaubt leer oder SL 0–4. Alle Zellen für ein Ergebnis ausfüllen. Unternehmensdefinierte Planungszuordnung, kein Nachweis einer IEC-62443-Fähigkeit und keine vorgeschriebene IEC-Matrix. SL-T bleibt unverändert.',
          },
          example: {
            en: 'Record why a particular residual feasibility/impact pair maps to the chosen level.',
            de: 'Begründen, warum eine Kombination aus verbleibender Durchführbarkeit und Auswirkung dem gewählten Level zugeordnet wird.',
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
