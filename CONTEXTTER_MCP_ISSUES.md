# Contextter MCP / Keyword-Research-Probleme

Stand: 2026-08-31

## Produktionsabschluss der Stored-Read-Reparatur vom 2026-08-31

- Gesamtstatus: **PASS** fuer den oeffentlichen, workspacegebundenen MCP-Endpoint `https://app.contextter.com/api/mcp` und Workspace `ws_g1h1padb4chj`. Die acht vereinbarten Pruefbloecke wurden nach dem finalen Convex- und Vercel-Deploy ausschliesslich mit kostenlosen Stored Reads ausgefuehrt. Es blieben keine reproduzierten HTTP-500-, falschen retryable-503- oder Schemawidersprueche in diesem Abnahmeumfang.
- Finaler Code: Commit `2c1ff1017ff83736444959d6f9e54f57df986575` (`test(agent-platform): cover keyword taxonomy projection`) ist identisch mit `origin/main`. Der Fix baut auf den isolierten Commits `aa49e829b59100b6b0f51e973c8c4ba95613caf6`, `5cec3cb3122c233b9f1327f9d19620fba5ba23fb`, `01581fb81d09ae05f0d178166ebb0395491f1de1` und `1a6967290cacc99ceab7c89e7d2eb5eec46d6ea0` auf.
- Convex-Deployment: Die finalen Funktionen und das validierte Schema wurden aus dem finalen SHA auf das kanonische Self-hosted-Production-Ziel `https://convex.contextter.com` deployed; der CLI-Lauf endete mit `Deployed Convex functions`. Dieser Deployment-Pfad vergibt keine separate Convex-Deployment-ID.
- Vercel-Deployment: `dpl_AMgEpZYTfDE5qftX59HZfcXpmHcN`, Status `READY`, Target `production`, Deployment-URL `https://contextter-main-56jf4ca4d-lia-xims-projects.vercel.app`, Alias `https://app.contextter.com`.

### Bestaetigte Ursachen und Fixes

- Die Convex-Return-Validatoren der Keyword- und Ranking-Source-Reads enthielten nicht alle bereits projizierten beziehungsweise neu benoetigten Felder. Validatoren, Source-Modelle, MCP-Adapter und oeffentliche Projektionen wurden auf nullable Ranking-Felder, `countryCode`, Keyword-Taxonomie, normalisierte Competition-Metriken, Ranking-URLs und SERP-Features ausgerichtet.
- Die Keyword-Projektion liefert `countryCode`, die gespeicherte Google-Ads-Taxonomie als `category` und `competition` einheitlich als Wert mit Einheit `ratio`. `section=detail` ist ein oeffentlich akzeptierter Alias.
- `workMemory.overview` war zwar fachlich ein Read, lief aber in Production in eine Convex-Runtime-Grenze durch mehrere `.paginate()`-Aufrufe innerhalb derselben Funktion. Die Statusabfragen verwenden jetzt begrenzte `.take(limit + 1)`-Reads und behalten ehrliche `hasMore`-/Truncation-Angaben. Der Read ist als `included` klassifiziert und benoetigt keine Paid-Execution.
- `aiVisibility.run.list` war intern registriert, aber nicht durchgehend im ausgelieferten Toolkatalog, Eingabeschema und Runtime-Routing verbunden. `section=runs` und das gespeicherte Mentions-Routing sind jetzt oeffentlich erreichbar; providerinterne Routingdetails werden nicht als oeffentlicher Run-Subject-Vertrag ausgegeben.
- Fehlende Opportunity-Snapshots wurden faelschlich als retryable Infrastruktur-503 abgebildet. Der Adapter liefert jetzt einen erfolgreichen, strukturierten `status:notAvailable`-Zustand mit leerer Empfehlungsliste und konkretem Data-Gap, wenn kein zulassungsfaehiger gespeicherter Snapshot existiert.
- Das ehrliche Domain-Profile-Ergebnis `DOMAIN_PROFILE_NOT_FOUND` wurde unveraendert erhalten. Es wurde keine frische Domain-Analyse gestartet.

### Tests und Builds

- App/MCP-Handler und Discovery: 17/17 Tests bestanden.
- AI Source Reads und Work Graph: 12/12 Tests bestanden; `packages/ai` Typecheck bestanden.
- DB-Regressionen fuer Keyword-, Ranking- und Work-Reads: 16/16 Tests bestanden; `packages/db` Typecheck bestanden.
- Zusaetzliche fokussierte Laeufe: AI 29/29, DB 20/20 und Provider-neutral-Copy 1/1 bestanden.
- Prettier, paketbezogenes ESLint, Convex-Codegen und `git diff --check` waren gruen. Der lokale Vercel-App-Build mit der oeffentlichen Convex-URL kompilierte 144/144 Seiten; der finale Vercel-Cloud-Build war ebenfalls erfolgreich.
- Separater vorhandener Baseline-Fehler: Der vollstaendige App-Typecheck meldet weiterhin `apps/app/app/admin/users/[userId]/client.tsx(120,27)` (`Id<\"users\"> | undefined`). Der Fehler liegt ausserhalb der geaenderten MCP-Pfade. Repository-weite Agent-Platform-/Vercel-Vertragsgates enthalten ebenfalls nicht zu diesem Slice gehoerende Authorization- beziehungsweise Parallel-Trace-Hardening-Abweichungen.
- Die verpflichtenden GitHub-Actions-Jobs starteten wegen Account-Payment/Spending-Limit nicht und erzeugten deshalb kein Release-Zertifikat. Der autorisierte direkte Production-Deploy und die oeffentliche Endpunktabnahme sind erfolgreich; der fehlende Hosted-CI-Nachweis bleibt ein Infrastruktur-Risiko.

### Oeffentliche Production-Abnahme

1. **PASS - Capabilities:** `authorization_get_capabilities` antwortet erfolgreich. Alle Fresh-/Paid-Aktionen bleiben `enabled:false` mit dem tatsaechlichen Grund `AGENT_PLATFORM_PAID_EXECUTION_DISABLED`; Katalog und Runtime widersprechen sich fuer den getesteten Umfang nicht.
2. **PASS - Domain Profile:** Stored Profile fuer `ai-fanout.com` liefert sowohl US (`2840/en`) als auch DE (`2276/de`) erfolgreich und kostenfrei `availability:notAvailable`, Grund `DOMAIN_PROFILE_NOT_FOUND`.
3. **PASS - Opportunities:** Erfolgreiche Antwort `CTX-AGP-200-EVIDENCE_OPPORTUNITIES_ANALYZE`, `status:notAvailable`, keine Recommendations, Data-Gap `PROJECTION_MANIFEST_INCOMPLETE`, Billing `freeStoredRead`; kein retryable 503.
4. **PASS - Work Overview:** Erfolgreiche Antwort `CTX-AGP-200-WORK_MEMORY_OVERVIEW`, leere gespeicherte Decisions/Work-Items, `includedTerminal:true`, `truncated:false`, Billing `included`; weder Idempotency-Fehler noch HTTP 500.
5. **PASS - Keyword Research:** Detail fuer `kwd_kayg16szw0js` / `seo for ai search` liefert `countryCode:us`, `category:googleAdsTaxonomy:10004`, `searchVolume:10 count` und `competition:0.29 ratio`. Die History liefert zwei normalisierte Punkte mit Volume 10 und Competition 0.29. Die Keyword-Liste liefert 47/47 mit `hasMore:false`; die DE-Liste `kwl_hm0cj18c1oep` liefert 16 aktive DE-Mitglieder, `hasMore:false`, und meldet zwei verwaiste Mitgliedschaften ehrlich als Warning. `missingData` liefert 47 Eintraege mit feldgenauen Luecken und `hasMore:false`.
6. **PASS - Rankings:** `section=rankings`, `limit=50` liefert 10/10 gespeicherte Eintraege, `hasMore:false`, Coverage `ready`, `truncated:false`, Domain `ai-fanout.com`, Markt `2276/de`, Device `desktop` und SERP-Features. Nicht gespeicherte Positionen und URLs werden als `null` plus explizite Data-Gaps statt als erfundene Werte ausgegeben. Weil `hasMore:false`, war keine Cursor-Folgeseite vorhanden.
7. **PASS - AI Visibility:** `section=runs`, `limit=20` liefert erfolgreich `CTX-AGP-200-AI_VISIBILITY_RUN_LIST`, Zustand `empty`, 0 Runs, `hasMore:false`, Billing `freeStoredRead`. Eine direkte read-only Tabellenpruefung bestaetigte, dass `agentAiVisibilityRuns` keine Dokumente enthaelt; daher existierte keine echte `runId` fuer den bedingten Mentions-Folgeread. Das oeffentliche Stored-Mentions-Routing wurde zusaetzlich mit einer syntaktisch gueltigen, nicht vorhandenen ID geprueft und liefert erfolgreich `availability:notAvailable` / `AI_VISIBILITY_RUN_NOT_FOUND_OR_UNAVAILABLE`, nicht einen Schema- oder Runtimefehler. Es wurde kein kostenpflichtiger Run erzeugt.
8. **PASS - Billing und Mandate:** `seo_get_account_status` bleibt vor/nach der Abnahme bei `totalSpent:115`, `heldBalance:0`, `activeHolds:0`, `availableBalance:4985`, Billing `freeStoredRead`. `authorization_list_grants` liefert weiterhin `[]`; deshalb gibt es keine reale Grant-ID und keinen Mandat-Datensatz fuer einen zulaessigen `billing_get_mandate_status`-Read. Es wurde keine Grant-Anfrage erstellt.

### Verbleibende Einschraenkungen

- Eine Mentions-Antwort fuer eine reale AI-Visibility-Run-ID ist in diesem Workspace nicht nachweisbar, weil der kanonische Stored-Run-Bestand leer ist. Die oeffentliche Run-Liste und der strukturierte Not-Available-Pfad sind belegt; das Erzeugen eines Runs waere kostenpflichtig und war ausdruecklich verboten.
- Die zwei verwaisten Mitgliedschaften der DE-Keyword-Liste bleiben ein gespeicherter Datenqualitaetsbefund. Der Read verschweigt sie nicht und liefert die 16 vorhandenen Keywords korrekt.
- Ranking-Position und Ranking-URL sind in den vorhandenen gespeicherten Zeilen nicht vorhanden. Der Vertrag liefert die restlichen Kernfelder und markiert diese beiden Luecken explizit; er erzeugt keine scheinbar vollstaendigen Daten.
- Hosted CI konnte wegen des GitHub-Account-Billing-/Spending-Limit-Blockers nicht laufen. Fokussierte lokale Gates, Convex-Deployment, Vercel-Production-Build und die authentifizierte oeffentliche Abnahme sind davon getrennt belegt.

Diese Datei sammelt reproduzierbare Probleme, die waehrend der Live-Keyword-Recherche fuer `ai-fanout.com` auffallen. Sie wird im laufenden Durchgang ergaenzt. Die Bezeichnung "MCP" folgt dem Arbeitsauftrag; wo kein Contextter-MCP-Werkzeug erreichbar ist, wird das ausdruecklich von UI-Problemen getrennt.

## P0

Noch keine P0-Befunde.

## P1

### Authorization-Grant-Liste scheitert an fehlender Quotenrichtlinie

- Status: behoben und am 2026-08-30 authentifiziert am oeffentlichen Application-MCP verifiziert
- Oeffentlicher Reproduktionspfad: `https://app.contextter.com/api/mcp`, Tool `authorization_list_grants`, interne Operation `authorization.grants.list`, Eingabe `includeInactive: true`
- Oeffentliche Antwort vor dem Fix und nach dem lokalen Codegen-Gegencheck: `isError: true`, `code: INTERNAL_ERROR`, `reasonCode: AGENT_PLATFORM_QUOTA_CONFIGURATION_INVALID`, `retryable: false`
- Live-Ergebnis nach dem Deploy: `authorization_get_capabilities`, `authorization_list_grants`, `seo_get_workspace_overview` und der zusaetzliche kostenlose Read `seo_get_account_status` antworten am oeffentlichen Endpoint mit `isError: false` und `success: true`. `authorization_list_grants(includeInactive: true)` liefert fachlich erfolgreich `[]`; der fruehere Diagnosecode `AGENT_PLATFORM_QUOTA_CONFIGURATION_INVALID` tritt nicht mehr auf. Der Overview bestaetigt `ws_g1h1padb4chj`, Name/Domain `ai-fanout.com`, Lifecycle `active` und Billing-Klasse `freeStoredRead`.
- Produktionsbeleg vor dem Fix: Vercel-Request `vq7ng-1788098707236-9fb7320f762b`, Deployment `dpl_7BmjxJBY4XGCaw9JrkjLP63ZhsWd`, HTTP 200 am MCP-Transport. Der verwendete Connector exponierte die Antwortheader mit Application-Request-ID und Correlation-ID nicht; der Vercel-Datensatz enthielt keine `traceId` und keine Function-Logzeilen. Eine Application-Correlation-ID fuer die urspruengliche Reproduktion bleibt deshalb nicht belegt.
- Laufweg: MCP-Toolregistrierung -> Authorization-MCP-Handler -> signierter Authorization-Convex-Gateway-Aufruf -> Admission -> Quotenaufloesung und Rate-Limit-Verbrauch -> Authorization-Service -> workspace-, organization-, client- und owner-gebundene Grant-Abfrage -> MCP-Response-Mapping.
- Exakte Ursache: Der Quoten-Registry fehlten alle fuenf vom Authorization-Gateway verwendeten Operationen. `authorization.grants.list` wurde deshalb als `QUOTA_OPERATION_NOT_REGISTERED` fail-closed abgewiesen, bevor die leere Grant-Liste fachlich gelesen werden konnte. Admission fasste diesen Zustand zusammen mit anderen Konfigurationsfehlern unter `AGENT_PLATFORM_QUOTA_CONFIGURATION_INVALID` zusammen.
- Ausgeschlossen: keine fehlende Produktionsvariable, kein fehlerhafter Zahlenwert, keine falsche Einheit, kein widerspruechliches Soft-/Hard-Limit und kein falscher Vercel-Scope. Die Quotenrichtlinien dieses Pfads sind versionierte Code-Konstanten, keine Vercel-Variablen. Der kostenlose Read war auch nicht fachlich von Paid-Action-Budgets abhaengig; er scheiterte bereits an der fehlenden Registry-Zuordnung.
- Read-only gepruefte Vercel-Konfiguration fuer `contextter-main`: Die folgenden Namen sind im Scope `production` vorhanden; Werte wurden nicht gelesen oder ausgegeben: `AGENT_PLATFORM_API_ENABLED`, `AGENT_PLATFORM_MCP_ENABLED`, `AGENT_PLATFORM_MCP_AUTH_MODE`, `AGENT_PLATFORM_MCP_DEFAULT_PROFILE`, `AGENT_PLATFORM_GATEWAY_SECRET`, `AGENT_PLATFORM_OAUTH_ISSUER`, `AGENT_PLATFORM_OAUTH_RESOURCE`, `AGENT_PLATFORM_OAUTH_DISCOVERY_URL`, `AGENT_PLATFORM_OAUTH_DYNAMIC_CLIENT_REGISTRATION_ENABLED`, `AGENT_PLATFORM_OAUTH_DCR_PRODUCTION_APPROVED`, `AGENT_PLATFORM_OAUTH_CONSENT_READY`, `AGENT_PLATFORM_OAUTH_SECURITY_MONITORING_READY`, `AGENT_PLATFORM_OAUTH_MAX_TOKEN_LIFETIME_SECONDS`, `AGENT_PLATFORM_OAUTH_CLOCK_TOLERANCE_SECONDS` und `AGENT_PLATFORM_TRUSTED_PROXY_MODE`. OAuth, Capability-Read und Workspace-Overview belegen die funktionale Gueltigkeit des aktiven Auth-/Gateway-Grundpfads. Eine Quotenvariable fehlt nicht, weil der Runtime-Code keine erwartet.
- Enger Fix: Authorization-Reads verwenden jetzt die vorhandene kostenlose Stored-Read-Richtlinie, Authorization-Kommandos die vorhandene Command-Richtlinie. Rate-Limits bleiben fuer Organization, Workspace und Client aktiv und fail-closed. Die Richtlinie validiert positive sichere Ganzzahlen, Millisekundenfenster, Retention, Policy-Version sowie `organization >= workspace >= client`. Fehlende Operationen, ungueltige Richtlinien, inkonsistente Buckets und ungueltige Eingaben erhalten getrennte Diagnosecodes.
- Unveraenderte Sicherheitsgrenzen: OAuth-Client-Status, Security-State, Organization, Workspace, Owner, Scope und die signierte Gateway-Bindung wurden nicht gelockert. Ein fehlendes `capabilities:read` wird weiterhin vor Quotenverbrauch abgewiesen; ein fremder Workspace wird nicht projiziert.
- Fokussierte Verifikation: 16/16 Authorization-/Quota-Tests, 28/28 MCP-Authorization-/Transporttests und 4/4 Changelog-Vertragstests bestanden. ESLint fuer alle geaenderten TypeScript-Dateien, Convex-Codegen, gezielter Convex-TypeScript-Check, Prettier und `git diff --check` waren gruen. Die Testmatrix deckt gueltige, fehlende und malformed Richtlinien, leere/aktive/inaktive Grants, fremden Workspace, fehlenden OAuth-Scope, Rate-Limit-Ueberschreitung und die Unabhaengigkeit von Paid-Action-Budgetreservierungen ab.
- Isolation: Der Shared-Worktree-Snapshot bestaetigt, dass ausschliesslich die elf beanspruchten Fix- und Changelog-Dateien veraendert wurden. Bereits vorhandene fremde Dirty-Tree-Dateien wurden weder bearbeitet noch gestaged oder committet. Die Direct-Deploys erfolgten anschliessend aus sauberen, auf den exakten SHA fixierten temporaeren Worktrees; die nur fuer das Vercel-Uploadpaket benoetigten Ignore-Anpassungen wurden nicht committet.
- Commit und Push: `eff4967faead78e1af986928794ac80959dea6d2` (`fix(agent-platform): register authorization quota policies`) wurde isoliert auf `origin/main` gepusht.
- Direkter Produktions-Deploy: Der Nutzer hat den Direct-Deploy in einem Folgeturn ausdruecklich autorisiert. Die Convex-Funktionen wurden aus dem sauberen SHA-Worktree mit dem kanonischen Self-hosted-Production-Ziel `https://convex.contextter.com` deployed; der Convex-CLI-Lauf endete mit `Deployed Convex functions`. Das Self-hosted CLI vergibt dabei keine separate Deployment-ID, deshalb bilden Ziel, SHA und Erfolgsausgabe den Deployment-Beleg. Vor dem Write bestaetigte ein Dry-run eine gueltige Schema-/Funktionsauslieferung ohne Indexloeschung.
- Vercel-Production-Deploy: Projekt `contextter-main`, Deployment `dpl_3UzfSFncbavkCv8Evp7JjGLDrnHV`, Build `bld_j0hh2bff3`, Quell-SHA `eff4967faead78e1af986928794ac80959dea6d2`, Status `READY`, Produktions-URL `https://contextter-main-oxdci2xdl-lia-xims-projects.vercel.app`; die Aliase `https://app.contextter.com`, `https://contextter-main.vercel.app` und `https://contextter-main-lia-xims-projects.vercel.app` sind zugewiesen. Der Cloud-Build kompilierte erfolgreich, erzeugte 144/144 statische Seiten und bestand die Vercel-Output-Pruefung.
- Authentifizierter Live-Beleg: Der Connector verwendet nach dem Deploy den vom Server validierten Workspace-Resource-Identifier `https://app.contextter.com/api/mcp?workspace=ws_g1h1padb4chj`; OAuth wurde dafuer neu gebunden. `authorization_get_capabilities` liefert die drei Phase-1-Capabilities, `authorization_list_grants(includeInactive: true)` liefert erfolgreich null Grants, `seo_get_workspace_overview` bestaetigt den Ziel-Workspace und `seo_get_account_status` bestaetigt `heldBalance = 0`, `activeHolds = 0` sowie weiterhin insgesamt `totalSpent = 115` EUR-Cent. `billing_get_mandate_status` wurde mangels realer Grant-ID bewusst uebersprungen. Es wurde keine Grant-Anfrage, Reservierung oder kostenpflichtige SEO-Aktion ausgefuehrt.
- Verbleibender externer Blocker: Die verpflichtenden GitHub-Actions-Laeufe fuer diesen SHA haben wegen Account-Billing beziehungsweise Spending-Limit weiterhin kein Release-Zertifikat erzeugt. Der nun ausdruecklich autorisierte Direct-Deploy behebt den Live-Fehler, ersetzt aber nicht den noch nachzuholenden zertifizierten `Release Vercel`-Nachweis. Ausserdem behalten bereits laufende Codex-Aufgaben ihre alte MCP-Transportkonfiguration; nach dem Wechsel auf den workspacegebundenen Resource-Identifier ist eine frische Aufgabe oder ein Neustart erforderlich.

### Kein Contextter-MCP-Werkzeug fuer die Keyword-Produktion verfuegbar

- Status: Transport-/Inventargap behoben; fachliche Fresh-Action-Luecken verbleiben
- Beobachtung: Eine frische Codex-Aufgabe erkennt jetzt 19 Contextter-Tools. Kostenlose Workspace-, Keyword-, Listen-, Research-, Data-Run-, Capability-, Grant- und Billing-Reads funktionieren. Damit ist die fruehere Aussage „kein Tool verfuegbar“ nicht mehr aktuell. Fresh Competitor-, AI-Visibility- und Keyword-Research-Aufrufe bleiben jedoch vor dem Quote feature-disabled, wie im naechsten Befund dokumentiert.
- Auswirkung: Stored Research ist agentisch auswertbar. Der vollstaendige kostenkontrollierte Ablauf `capability -> quote -> task grant -> execute -> operation -> settlement` ist fuer die wichtigsten neuen Analysen weiterhin nicht Ende-zu-Ende belegt.
- Erwartung: Das aktuelle Toolinventar muss je Aktion sichtbar zwischen gespeicherten Reads, verfuegbaren Fresh-Aktionen und feature-disabled Oberflaechen unterscheiden. Eine gelistete Aktion darf nicht erst nach fachlicher Eingabe offenlegen, dass kein Quote moeglich ist.

### Sechs Fresh-Toolfamilien brechen vor dem Quote mit FEATURE_DISABLED ab

- Status: am 2026-08-30 am oeffentlichen workspacegebundenen MCP reproduziert
- Reproduktionspfad: Fresh-Aufrufe mit minimalem Scope fuer Keyword Research, Keyword Metrics Refresh, Competitor Analysis, AI Visibility, Domain Analysis und Site Audit; exakter US-Kontext `locationCode = 2840`, `languageCode = en`, wo der Vertrag diese Felder annimmt
- Beobachtung: Alle sechs Familien antworteten mit `CTX-AGP-403-FEATURE_DISABLED`, Supportcode `CTX-INF-009`, `retryable: false`, bevor ein exakter Preis, eine Quote-ID oder eine ausfuehrbare Operation zurueckkam. Gleichzeitig listet `authorization_get_capabilities` `action.keyword-research.run` und `action.keyword-data.refresh` als kostenpflichtige `actions:execute`-Capabilities. Die gespeicherten Competitor-Vergleiche und Tracking-Competitors sind leer.
- Authorization: Fuer `action.keyword-research.run` war zuvor eine taskgebundene Anfrage mit maximal `385` EUR-Cent erstellt worden. Request `arq_kh8ibb48zh9c` ist inzwischen `expired`; `authorization_list_grants(includeInactive: true)` liefert weiterhin eine leere Grant-Liste. Da der Fresh-Pfad vor dem Quote feature-disabled ist, wurde bewusst keine neue Freigabe angefordert.
- Kosten: EUR 0.00 neu ausgegeben, EUR 0.00 gehalten, null aktive Holds. Die harte Restobergrenze des Auftrags bleibt EUR 3.85.
- Auswirkung: Organische Wettbewerber-Keywords, Ranking-URLs, SERP-Ueberschneidung, Content-Gaps sowie AI-Citation-/Visibility-Vergleiche koennen trotz sichtbarer Tooloberflaeche nicht strukturiert erhoben werden. Ein Agent kann Capability-Verfuegbarkeit nicht vor der fachlichen Anfrage verlaesslich pruefen und erhaelt keinen nachrechenbaren Preis.
- Erwartung: Capability-Read muss pro Tool und Modus `enabled`, erforderliche Scopes, Grant-Eligibility, Quote-Verfuegbarkeit und Feature-Flag-Grund liefern. Feature-disabled Aufrufe duerfen keine Authorization-Anfrage nahelegen. Ist die Aktion aktiv, muss vor jeder Reservierung ein taskgebundener, centgenauer Quote mit Markt, Scope, Cache/Coverage und Ablaufzeit entstehen.

### Kostenlose Opportunity- und Domain-/Site-Reads haben keinen stabilen oeffentlichen Eingabevertrag

- Status: am 2026-08-30 reproduziert
- Beobachtung: `seo_find_opportunities` und `seo_manage_work(operation = overview)` brachen bei kostenlosen Stored-Reads mit `CTX-AGP-500-INTERNAL_ERROR` ab. Gespeicherte Domain-Profile fuer US und DE endeten ebenfalls mit `CTX-AGP-500-INTERNAL_ERROR` und `retryable: false`. Kombinierte Overview-Aufrufe fuer Rankings, Search Performance und Site Audit scheiterten an Validierung, waehrend mehrere Einzel-Sections derselben Tools lesbar waren. Der Workspace-Overview selbst funktionierte und meldete Domain Overview, GSC, Site Audit und Backlinks als nicht vorhanden beziehungsweise nicht konfiguriert.
- Auswirkung: Der Agent kann nicht sicher unterscheiden, ob Stored Data fehlt, die Eingabe falsch ist oder der Handler intern scheitert. Redigierte Validierungsdetails verhindern eine selbststaendige Korrektur, obwohl keine kostenpflichtige Aktion betroffen ist.
- Erwartung: Jedes oeffentliche Tool braucht vollstaendige JSON-Schema-Beispiele, maschinenlesbare Validierungsfehler mit Feldpfad sowie einen eindeutigen `noData`-Zustand. Kostenlose Reads duerfen bei leerem Workspace nicht mit internem 500 enden.

### Keyword-Metriken und Feldstatus sind widerspruechlich

- Status: am 2026-08-30 im oeffentlichen Stored-Read reproduziert
- Beobachtung: Der Keyword-Detail-Read scheiterte fuer gueltige `kwd_*`-IDs, waehrend die History derselben IDs lesbar war. Fuer `seo for ai search` enthielt die History zwei nur Sekunden auseinanderliegende Punkte mit `competition = 29` und `competition = 0.29`, beide mit der Einheit `ratio`. `listMissingData` projizierte praktisch alle 47 Keywords als unvollstaendig, lieferte aber weder feldgenaue `dataGaps` noch eine belastbare Trennung von `missing`, `provider_no_data`, `stale` und `not_requested`. Fuer `ai query fanout tool` zeigte die History sowohl `data` ohne Metriken als auch `no_data`; der aktuelle Keyword-Read erklaerte diesen Zustand nicht.
- Auswirkung: Competition kann um den Faktor 100 fehlinterpretiert werden. Ein erfolgreicher Data-Run mit 49/49 Zeilen laesst sich nicht in eine verlaessliche Feldabdeckung uebersetzen; fehlend kann faelschlich als null oder als erneut kaufbeduerftig behandelt werden.
- Erwartung: Wert und Einheit muessen beim Speichern normalisiert werden. Keyword-Detail, History und Missing-Data-Projektion brauchen pro Feld einen gemeinsamen Statusvertrag mit Provider, Markt, Beobachtungszeit und Refresh-Empfehlung.

### Stored Rankings und AI-Visibility-Runs sind nicht vollstaendig adressierbar

- Status: am 2026-08-30 reproduziert
- Beobachtung: `seo_analyze_rankings` mit `section = rankings` lieferte trotz hoeherem Limit nur zehn truncierte Zeilen. Die Projektion enthielt Keywords, Zeitstempel und teilweise Suchvolumen, aber keine Position, Ranking-URL, Domain, Markt, Sprache, Geraet oder SERP-Features. `seo_measure_ai_visibility` verlangt fuer Stored-Reads eine bekannte `runId`, bietet im oeffentlichen Toolvertrag aber keine Run-Liste.
- Auswirkung: Die Ausgabe ist kein belastbarer Ranking- oder SERP-Snapshot und vorhandene AI-Visibility-Runs sind ohne vorher bekannte ID nicht auffindbar.
- Erwartung: Rankings brauchen Cursor-Pagination, Coverage und die bestellten Kernfelder. AI Visibility braucht einen kostenlosen, workspacegebundenen `listRuns`-/Inventory-Read mit Status, Provider, Markt, Zeit und Run-ID.

### GSC-Bulk-Inspection laeuft nach HTTP 504 weiter und verbraucht bei Retry doppelte Quote

- Status: am 2026-08-30 mit `sc-domain:ai-fanout.com` reproduziert
- Beobachtung: `bulk_inspect_urls` fuer 29 URLs lief seriell laenger als etwa 120 Sekunden und endete am Client mit HTTP 504. Server-seitig wurden die Inspections dennoch weiter ausgefuehrt und einzeln persistiert. Die Timeout-Antwort enthielt keine Operation-ID, keinen Fortschrittsstatus und keinen Idempotency-Key. Ein Retry fuer sechs zu diesem Zeitpunkt noch nicht sichtbare URLs erzeugte deshalb Doppelinspections. Die History enthaelt 35 Zeilen fuer 29 eindeutige URLs.
- Auswirkung: Ein Agent kann nach einem scheinbaren Fehlschlag nicht sicher entscheiden, ob er warten, fortsetzen oder wiederholen soll. Ein gutgemeinter Retry verbraucht zusaetzliche Google-URL-Inspection-Tagesquote, obwohl keine neue fachliche Arbeit noetig ist.
- Erwartung: Lange Bulk-Inspections muessen als asynchroner, idempotenter und resumierbarer Job starten. Die Startantwort braucht `operationId`, akzeptierten Scope und Status-URL; Retries mit demselben Schluessel duerfen bereits gestartete oder abgeschlossene URLs nicht erneut inspizieren.

### Neue Authorization- und Capability-Tools sind in der Agentensitzung nicht sichtbar

- Status: am 2026-08-30 nach dem gemeldeten Authorization-Rollout erneut reproduziert
- Beobachtung: Die aktuelle Agentensitzung exponiert weder Contextter-Fachtools noch die neuen Capability-, Authorization-Request-, Grant-, Revoke- oder Budgetmandat-Tools. Damit kann der Agent nicht maschinenlesbar feststellen, ob `keyword.discovery`, `keyword.enrich`, `serp.refresh`, `competitor.keywords` oder `keyword.import` erlaubt, zusaetzlich freigabefaehig oder grundsaetzlich nicht vorhanden sind.
- Auswirkung: Die neue inkrementelle Autorisierung kann vom Agenten nicht genutzt werden, obwohl sie serverseitig implementiert sein mag. Ein fehlendes Tool ist nicht von einem fehlenden Grant, einem unzureichenden OAuth-Scope, einer nicht neu verbundenen MCP-Sitzung oder einer nicht deployten Capability zu unterscheiden.
- Erwartung: Der Basis-Connector muss mindestens `capabilities.list` und `authorization.status` ohne Zusatzgrant exponieren. Nicht erlaubte Fachtools sollten auffindbar bleiben und strukturiert `ADDITIONAL_AUTHORIZATION_REQUIRED` mit Capability, Scope, Workspace, Quote/Budgetbedarf und Consent-URL liefern. Nach Freigabe braucht der Client eine dokumentierte Reconnect- oder Capability-Refresh-Strategie.

#### Live-Diagnose des fehlenden Tool-Inventars

- Status: Serverpfad und frischer Client-Handshake am 2026-08-30 produktiv verifiziert; laufende Alt-Sitzungen bleiben erwartungsgemaess stale
- Gepruefter Zielpfad: ausschliesslich der oeffentliche Application-Endpoint `https://app.contextter.com/api/mcp`, nicht Localhost
- Deployment: `app.contextter.com` zeigt jetzt auf Production-Deployment `dpl_3UzfSFncbavkCv8Evp7JjGLDrnHV` von `contextter-main` mit Commit `eff4967faead78e1af986928794ac80959dea6d2`. Die Authorization- und workspacegebundenen OAuth-Commits sind Vorfahren dieses Deployments.
- Registrierung: Der produktive MCP-Handler ruft `registerAuthorizationMcpTools` auf. Registriert werden `authorization_get_capabilities`, `authorization_request`, `authorization_get_status`, `authorization_list_grants`, `authorization_revoke_grant` und `billing_get_mandate_status`. Das Default-Toolprofil enthaelt diese Namen.
- Oeffentlicher Endpoint: Die OAuth-Resource-Metadaten zeigen auf `https://app.contextter.com/api/mcp`; ein nicht authentifizierter Initialize-Request erhaelt erwartungsgemaess HTTP 401 mit `CTX-AGP-401-AUTH_REQUIRED` und einer Clerk-OAuth-Challenge.
- Codex-Konfiguration: `contextter` ist als aktivierter Streamable-HTTP-MCP mit der oeffentlichen URL und OAuth eingetragen. Trotzdem enthaelt das Tool-Inventar dieser bereits laufenden Aufgabe null Contextter-Tools.
- Endgueltige Ursache: Ein fehlender fachlicher Grant und ein bloss veraltetes Task-Inventar wurden ausgeschlossen. Auch eine frische Codex-Aufgabe erhielt keine Tools. Die Codex-Runtime versuchte zunaechst den Basis-Endpoint mit einem gespeicherten OAuth-Token; Contextter antwortete mit `AUTH_SCOPE_DENIED` und `WORKSPACE_SELECTION_REQUIRED`, worauf Codex den MCP-Server als nicht bereit verwarf. Die offizielle Contextter-Installationsoberflaeche belegt fuer den Ziel-Workspace die ID `ws_g1h1padb4chj` und den Endpoint `https://app.contextter.com/api/mcp?workspace=ws_g1h1padb4chj`.
- Zweiter Blocker: Nach Korrektur der lokalen Codex-URL scheiterte `codex mcp login contextter` vor der Browserfreigabe. Der workspacegebundene angeforderte Resource-Identifier enthielt den Queryparameter, waehrend Contextters Protected-Resource-Metadaten weiterhin nur `https://app.contextter.com/api/mcp` als `resource` publizierten. Codex lehnte den exakten Resource-Mismatch korrekt ab. Damit konnten weder OAuth noch `tools/list` beginnen.
- Implementierte Loesung: Contextters OAuth-Challenge, Protected-Resource-Metadaten, Resource-Identifier, Audience und Token-Verifikation wurden konsistent an den validierten Workspace-Selector gebunden; ungueltige, mehrdeutige und fremde Workspace-Auswahl bleibt fail-closed. Der isolierte Fix wurde als Commit `53fd0a8677072008dcc3091a4db462976c83121c` auf `origin/main` gepusht. Fokussiertes ESLint, 61/61 OAuth-/MCP-Tests und `git diff --check` bestanden. Der breite App-Typecheck wurde nach 15 Minuten kontrolliert beendet und bleibt `NOT PROVEN`.
- Release-Status: Der Nutzer autorisierte in einem Folgeturn ausdruecklich den direkten Production-Deploy trotz des weiterhin fehlenden GitHub-Actions-Zertifikats. Der OAuth-/Workspace-Fix ist dadurch jetzt produktiv; der externe GitHub-Billing-/Spending-Blocker bleibt fuer den nachzuholenden zertifizierten Workflow bestehen.
- Funktionsfaehiger Codex-Pfad am 2026-08-30: Die MCP-Konfiguration verwendet den vom Server validierten oeffentlichen Workspace-Resource-Identifier `https://app.contextter.com/api/mcp?workspace=ws_g1h1padb4chj`. `codex mcp login contextter` wurde nach dem Production-Deploy fuer diese Resource erfolgreich erneuert. Der zuvor dokumentierte reine Headerpfad wurde bei der abschliessenden Verifikation nicht weiter als Beleg verwendet, weil der gepushte Handler die Workspace-Auswahl ueber den validierten URL-Selector bindet.
- Authentifizierter Live-Beleg: Eine danach frisch gestartete Codex-Aufgabe erhielt 19 Contextter-Tools. `authorization_get_capabilities` antwortete mit `success: true` und den Phase-1-Capabilities `action.keyword-research.run`, `action.keyword-data.refresh` und `keywordResearch.candidates.import`. `seo_get_workspace_overview` antwortete ebenfalls mit `success: true`, Code `CTX-AGP-200-WORKSPACE_GET_CONTEXT_WITH_COVERAGE`, Workspace `ws_g1h1padb4chj`, Name/Domain `ai-fanout.com` und Billing-Klasse `freeStoredRead`. Es gab keine strukturierten Fehler, Warnings oder Data-Gaps und keine kostenpflichtige Aktion.
- Verbleibende Grenzen: Bereits laufende Codex-Aufgaben laden eine geaenderte MCP-Resource beziehungsweise das nach erfolgreichem Login verfuegbare Toolinventar nicht nach; ein neuer Task oder Neustart bleibt erforderlich. Der Workspace-Overview meldet insgesamt zehn Quellen, davon fuenf bereit, drei mit Handlungsbedarf und zwei blockiert. Der Transport-, OAuth-, Workspace- und Capability-Pfad ist damit verifiziert; die Einsatzbereitschaft jeder einzelnen Keyword-/SERP-Datenquelle ist dadurch nicht automatisch bewiesen. Der Queryparameter-OAuth-Fix ist produktiv, aber der zertifizierte GitHub-/`Release Vercel`-Nachweis fehlt weiterhin aus externen Billinggruenden.
- Erwartung: Codex muss den Verbindungsstatus pro MCP sichtbar als `connected`, `authentication required`, `initialization failed` oder `stale tool inventory` melden. Nach `tools/list_changed`, erfolgreichem OAuth oder Server-Neustart sollte eine laufende Aufgabe die Toolliste aktualisieren koennen; andernfalls muss die UI explizit einen Neustart der App beziehungsweise eine neue Aufgabe verlangen.

#### Separater Befund: OAuth-Refresh-Issuer-Fallback

- Status: reproduziert, aber nicht als verbleibende Primaerursache bewiesen
- Beobachtung: Codex meldete bei den fuer den Basis-Endpoint gespeicherten OAuth-Zugangsdaten, dass die Refresh-Credentials keinem Issuer zugeordnet werden konnten. Der Client verwendete daraufhin den gespeicherten Access Token ohne Refresh. Dieser Request erreichte den Contextter-Server und wurde dort mit `WORKSPACE_SELECTION_REQUIRED` abgewiesen.
- Abgrenzung: Die Primaerursache fuer das fehlende Tool-Inventar war zuerst die ungebundene MCP-URL und danach der Resource-Metadata-Mismatch des offiziellen Links `https://app.contextter.com/api/mcp?workspace=ws_g1h1padb4chj`. Der Refresh-Issuer-Fallback erklaert diese beiden reproduzierbaren Fehler nicht.
- Entscheidung: Kein separater Refresh-Fix vorwegnehmen. Zuerst den workspacegebundenen Resource-/Audience-/Metadata-Vertrag deployen und einen vollstaendigen OAuth-Neulogin ausfuehren. Nur wenn danach erneut eine aktuelle Issuer-Bindungswarnung oder ein fehlgeschlagener Refresh auftritt, den Refresh-Pfad als eigenstaendigen Client-/Serververtrag untersuchen.
- Erwartung: Nach erfolgreichem Neu-Login muessen gespeicherter Issuer, Authorization Server, Resource-Identifier und Refresh-Credential eindeutig zusammenpassen. Diagnoselogs duerfen dabei weder Access- noch Refresh-Tokens ausgeben.

### Kein MCP-Vertrag fuer competitor-basierte Keyword Discovery

- Status: Funktionsgap in der aktuellen Agentensitzung; fachlich durch aktuelle SERP-Erkundung als relevant bestaetigt
- Beobachtung: Es ist kein Contextter-Tool erreichbar, das fuer eine Domain organische Keywords, Top-Seiten, Ranking-URLs, Keyword-Ueberschneidungen, Keyword-Gaps oder konkurrierende Domains marktbezogen liefert. Dadurch blieb die bezahlte Recherche im Wesentlichen seed- und autocomplete-getrieben. Eine kostenlose aktuelle Suche zeigte inzwischen weitere direkte Tool-Wettbewerber wie `queryfanout.io`, `trysight.ai`, `queryfanouts.com`, `lumina-seo.com`, `querytool.ai`, `astiva.ai`, `datawiseseo.com`, `ranked.ai`, `leadrescue.app`, `patrickstox.com` und `nyftylabs.com`; deren rankende Keyword-Sets konnten aber nicht strukturiert in Contextter untersucht werden.
- Auswirkung: Begriffe, die Wettbewerber bereits ueber Tool-, Vergleichs-, Workflow- oder Problemseiten abdecken, koennen fehlen. Der Agent kann weder `competitor -> organic keywords -> relevant gap -> import candidate` noch `keyword -> ranking domains -> weitere Keywords dieser Domains` reproduzierbar ausfuehren. Damit ist die Discovery brauchbar, aber nicht vollstaendig.
- Erwartung: Ein `competitor_keyword_discovery`-Vertrag sollte Domain, Zielmarkt, Sprache, Geraet, Rankingbereich, Mindestposition, optionales Mindestvolumen, Intentfilter und Ausschlussregeln akzeptieren. Das Ergebnis braucht Keyword, Position, Ranking-URL, Domain, Seitentyp, Volumenstatus, Datenquelle, Datenalter und Quote. Ein zweiter `keyword_competitors`-Pfad sollte aus einer priorisierten Keywordliste die wiederkehrenden rankenden Domains ermitteln. Beide Pfade muessen Vorschau, Deduplizierung und selektiven Import in eine benannte Liste unterstuetzen.

### Der bisherige Forschungsstand reicht fuer Architektur, aber nicht fuer vollstaendige Priorisierung

- Status: bestaetigte Research-Grenze
- Beobachtung: Die vorhandenen Daten reichten aus, um klare Nutzerintents, semantisch falsche Begriffe, Provider-Grenzen, Kannibalisierungsrisiken und acht tragfaehige bilinguale Guide-Rollen abzuleiten. Sie reichen nicht aus, um US-Nachfrage, KD, CPC, marktgerechte Top-10-SERPs oder Competitor-Keyword-Gaps vollstaendig zu verifizieren. Die bisherige Umsetzung folgte daher nicht nur den vorgegebenen Seednamen, sondern kombinierte sie mit Discovery-Kandidaten, vorhandenen Metriken, primaerer Providerdokumentation, Search Console, aktuellen Suchergebnissen und dem realen Produktvertrag. Competitor-Discovery wurde jedoch nur als oberflaechliche Domain-/SERP-Erkundung genutzt, nicht als vollstaendiger Keyword-Gap-Lauf.
- Auswirkung: Die gebauten Seiten sind bewusst konservativ und vermeiden Thin Pages, aber die Reihenfolge der naechsten Optimierungen ist bei mehreren Begriffen weiterhin `Supported` oder `Hypothesis` statt `Verified`. Ohne Competitor- und marktgerechte SERP-Daten koennen lohnende Longtails oder starke gegnerische Landingpages uebersehen werden.
- Erwartung: Research-Reports sollten explizit zwischen `genuegend fuer Seitenrolle`, `genuegend fuer Priorisierung`, `genuegend fuer neue URL` und `nicht ausreichend` unterscheiden. Ein Agent darf eine Architekturentscheidung treffen, ohne so zu tun, als sei damit die gesamte Keyword-Chance vermessen.

### Kein strukturierter Search-Fallback fuer Keywords ohne DataForSEO-Metriken

- Status: reproduziert
- Beobachtung: Fuer Keywords ohne Suchvolumen-, CPC- oder Difficulty-Datensatz gibt es im erreichbaren Contextter-MCP keinen separaten Search-/SERP-Aufruf. Eine allgemeine Websuche ist in der Agentenumgebung zwar verfuegbar, liegt aber ausserhalb des Contextter-Workspaces und kann ihre Ergebnisse nicht mit Keyword-ID, Liste, Markt, Kostenbeleg und Beobachtungszeitpunkt zurueckschreiben.
- Auswirkung: `Provider hat keine Metrik` wird faktisch zum Ende der Recherche, obwohl aktuelle organische Ergebnisse, Ergebnisarten, Domains und SERP-Features weiterhin als eigenstaendige Evidenz analysierbar waeren. Der Agent muss zwischen unverbundenen Werkzeugen und der UI wechseln; Provenienz und Deduplizierung gehen verloren.
- Erwartung: Contextter braucht einen workspace-gebundenen `analyze_search`-Vertrag mit Keyword-ID, Query, Land, Sprache, Geraet, Tiefe, organischen Positionen, SERP-Features, Provider, Cache-Status, `observedAt`, Quote und finalen Kosten. Search-Evidenz darf fehlendes Suchvolumen nicht ersetzen, muss aber als eigener belegter Datentyp gespeichert werden koennen.

### Fehlende Providerdaten haben keinen maschinenlesbaren Status

- Status: reproduziert; im lokalen Contextter-Agent-Read-Pfad teilweise behoben, noch nicht deployed
- Beobachtung: Bei mehreren priorisierten Keywords blieben Suchvolumen, CPC, Wettbewerb und Difficulty leer. Weder UI noch erreichbarer MCP-Vertrag unterschieden sichtbar zwischen `Provider hat keinen Datensatz`, `noch nicht angefordert`, `Anfrage fehlgeschlagen`, `Markt nicht unterstuetzt` und einem tatsaechlich gemessenen Wert von null.
- Auswirkung: Agenten und Exporte koennen fehlende Daten als Nullwert interpretieren, wiederholt unnoetige kostenpflichtige Abfragen starten oder eine Empfehlung mit einer nicht belegten Nachfrageaussage versehen.
- Erwartung: Jedes Feld benoetigt neben dem nullable Wert einen Status wie `verified`, `provider_no_data`, `not_requested`, `failed`, `unsupported_market` oder `stale` sowie Quelle, Markt und Abrufzeitpunkt. Ein fehlender Datensatz darf nie stillschweigend als `0` serialisiert werden.
- Lokale Verbesserung: `keyword.get` liefert fuer fehlende Kernfelder jetzt feldbezogene `*_NOT_STORED`-Data-Gaps; `keyword.list` fasst fehlende Felder als `KEYWORD_PAGE_CONTAINS_UNSTORED_FIELDS` zusammen. Numerische Nullwerte bleiben echte Metriken. Offen bleibt die feinere Ursache (`not_requested` versus `provider_no_data` versus `failed`), weil der aktuelle Keyword-Datensatz diese Historie nicht verlaesslich traegt.

### Externe Search-Evidenz kann nicht in den Keyword-Workspace uebernommen werden

- Status: reproduziert
- Beobachtung: Der Agent konnte aktuelle Web-Suchergebnisse ausserhalb Contextters abrufen und eine Search-Console-Property fuer `ai-fanout.com` lesen. Es existiert jedoch kein sichtbarer Importvertrag fuer strukturierte Beobachtungen wie Top-URLs, Domains, Result Types, SERP-Features, Markt, Zeitstempel und Evidenzstatus.
- Auswirkung: Nuetzliche Fallback-Evidenz bleibt in einem Bericht isoliert, statt am Keyword und an der Ziel-URL nachpruefbar zu werden. Eine spaetere Wiederholung kann Veraenderungen nicht gegen denselben Beobachtungsvertrag vergleichen.
- Erwartung: Ein autorisierter `attach_keyword_evidence`-Pfad sollte externe oder interne Search-Beobachtungen mit Provenienz, Hash, Markt, Zeit, Kosten und Ablaufdatum speichern. Importierte Evidenz muss klar von Contextter-eigenen Providerdaten getrennt bleiben.

### Deep-Discovery-Preisaufschluesselung ist rechnerisch inkonsistent

- Status: reproduziert
- Eingabe: `Deep`, Seed `ai query fanout`, Markt `United States (en)`.
- Beobachtung: Der Dialog zeigte `Semantic expansion 1,16 EUR`, `Metrics check 0,39 EUR`, `Keyword ideas 0,61 EUR`, `Bundle saving --0,18 EUR` und gleichzeitig einen Gesamtpreis von `1,55 EUR`. Die sichtbaren Einzelpositionen ergeben weder mit noch ohne den fehlerhaft doppelten Minusoperator `1,55 EUR`.
- Auswirkung: Der Nutzer kann den Quote nicht nachrechnen. Bei einem kostenpflichtigen MCP-/Agentenlauf fehlt damit eine belastbare Preisgrundlage, obwohl Start-Button und prognostizierter Kontostand konsistent `1,55 EUR` verwenden.
- Erwartung: Einzelpositionen, Rabatt und Gesamtpreis muessen centgenau aufgehen. Der Server-Quote sollte als strukturierter Vertrag mit `subtotal`, `discount`, `total`, Waehrung, Eingabe-Hash und Quote-ID geliefert werden; die UI darf keine Vorzeichen zusammensetzen, die bereits im Wert enthalten sind.

### Deep Discovery erzeugt massenhaft rekursive und sachfremde Autocomplete-Ketten

- Status: reproduziert
- Eingabe: `Deep`, Seed `ai query fanout`, Markt `United States (en)`.
- Ergebnis: 458 Kandidaten, darunter viele synthetisch wirkende Rekursionen und thematische Drift wie `what how ai query fanout works in servicenow ...`, SQL-, Azure-, SAP-, `near me`-, Tier-, Fortnite- und Kalenderjahr-Erweiterungen.
- Auswirkung: Die hohe Trefferzahl ist keine nutzbare Discovery-Tiefe. Relevanzfilterung und Import werden teuer und fehleranfaellig; die Masse kann echte Nischenchancen verdecken.
- Erwartung: Expansionstiefe begrenzen, bereits expandierte Frage-Praefixe nicht erneut expandieren, Seed-Entity und Suchkontext als semantischen Anker verwenden und Off-Topic-Kandidaten vor Ausgabe bewerten. Die UI sollte verworfene Provider-Rohkandidaten nicht als gleichwertige `keywords found` zaehlen.

## P2

### Research-Dialog uebernimmt alte Seeds in einen neuen Preisentwurf

- Status: reproduziert
- Schritte: Einen bereits zuvor benutzten Research-Dialog oeffnen, neue Seeds in das Feld `Starting keywords` eingeben und die Region wechseln.
- Beobachtung: Der alte Seed `wie funktioniert ki suche` blieb ausgewaehlt und wurde zusammen mit den neu eingegebenen US-Seeds kalkuliert.
- Auswirkung: Unbeabsichtigte Seeds koennen den Preis und den semantischen Scope eines Runs erhoehen. Bei einem strikten Kostenbudget ist das riskant.
- Erwartung: `New research` startet leer oder kennzeichnet unuebersehbar, dass ein Entwurf wiederhergestellt wurde. Ein sichtbarer `Clear all`-Pfad muss jederzeit erreichbar sein.

### Preisvorschau zeigt waehrend der Neuberechnung kurz veraltete Werte

- Status: reproduziert
- Beobachtung: Nach Wechsel von Tiefe, Seeds und Region zeigte der Dialog gleichzeitig `Updating the price...` und weiterhin den alten Gesamtpreis samt aktiv wirkendem Start-Button.
- Auswirkung: Der sichtbare Preis kann fuer kurze Zeit nicht zum aktuellen Auftrag passen. Automationen und schnelle Nutzer koennen einen falschen Betrag als aktuellen Quote interpretieren.
- Erwartung: Solange der Quote neu berechnet wird, muessen alter Preis und Start-Button deaktiviert oder eindeutig als veraltet markiert sein. Der Quote sollte eine stabile ID und die exakten Eingabeparameter anzeigen.

### Seed-Auswahl wird hinter `+1 more` verborgen

- Status: reproduziert
- Beobachtung: Bei neun ausgewaehlten Seeds waren nur acht direkt sichtbar; der letzte lag hinter `+1 more`.
- Auswirkung: Vor einem bezahlten Run ist die vollstaendige Eingabe nicht auf einen Blick pruefbar. Das erschwert Scope- und Kostenkontrolle.
- Erwartung: Vor der Zahlung sollten alle Seeds in einer kompakten, scrollbaren Liste mit Anzahl, Sprache/Markt und einem gut sichtbaren `Clear all` erscheinen.

### Zweiter Research-Start ist tabuebergreifend mehrdeutig

- Status: reproduziert
- Beobachtung: Nach Start des US-Deep-Runs blieb ein bereits geoeffneter DE-Quick-Dialog in einem zweiten Tab mit seinem vollstaendigen Quote sichtbar. Nach dem DE-Start blieb der Dialog offen und der Button wurde deaktiviert; die darunterliegende Run-Liste zeigte zunaechst nur den US-Run. Erst im anderen Tab erschien der DE-Run spaeter als `queued`.
- Auswirkung: Nutzer oder Agenten koennen nicht sicher erkennen, ob der zweite kostenpflichtige Start angenommen wurde, blockiert ist oder nur verzoegert sichtbar wird. Ein erneuter Klick waere ohne Idempotenzschutz riskant.
- Erwartung: Nach erfolgreichem Submit muss der Dialog schliessen oder eine eindeutige Erfolgsansicht mit Run-ID zeigen. Alle Tabs sollten denselben Jobstatus zeitnah anzeigen; Wiederholungen muessen ueber eine Idempotency-ID abgesichert sein.

### Laufende SERP-Anreicherung zeigt widerspruechlichen Scope und Kontostand

- Status: reproduziert
- Eingabe: Live-SERP fuer 49 ausgewaehlte Keywords, bestaetigter Quote `0,46 EUR`.
- Beobachtung: Nach einigen Minuten zeigte der Dialog gleichzeitig `12 of 49 keywords done`, `49 keywords remain; 0 already have SERP data and are skipped`, `37 keywords x 0,0095 EUR = 0,35 EUR` und `12 of 49 keywords are already enriched`. Die Activity-Seite listete zunaechst nur einzelne `Unlinked charge`-Zeilen statt einer zusammengehoerigen Operation. Der im Dialog angezeigte `Current balance` wich vom Header-Kontostand ab und wirkte, als wuerden offene Reservierung und Teilabrechnungen parallel abgezogen.
- Auswirkung: Fortschritt, Restkosten und verfuegbares Budget sind waehrend des Runs nicht eindeutig. Ein Agent koennte den Lauf doppelt starten oder das Budget falsch berechnen.
- Erwartung: Ein einziger Run-Datensatz mit Run-ID muss `requested`, `completed`, `failed`, `skipped`, `reserved`, `settled` und `released` konsistent zeigen. Die Activity-Seite sollte die Teilcharges unter dieser Operation gruppieren und der Quote-Dialog darf waehrend eines aktiven identischen Runs keinen neuen Start anbieten.

### SERP-Lauf bleibt bei 12/49 stehen, waehrend Activity keinen laufenden Job kennt

- Status: reproduziert
- Eingabe: Live-SERP fuer 49 Keywords, Start am 2026-08-30 gegen 01:28 Uhr MESZ.
- Beobachtung: Der reaktive Fortschritt blieb auch nach Reload und mehr als zehn Minuten bei `12 of 49 keywords done`. Die Activity-Seite meldete gleichzeitig `No running, partial, or failed work in this period` und zaehlte fuenf erfolgreiche Operationen. Die zwoelf SERP-Ergebnisse erschienen dort ausschliesslich als erfolgreiche `Workspace usage charge` / `Unlinked charge`-Zeilen zu je `0,01 EUR`; ein SERP-Run mit Status, Run-ID, Restmenge oder Fehlerdiagnose fehlte. Die Vercel-Produktionslogs zeigten fuer den Enqueue-Request HTTP 200 und keine nachfolgenden Warnungen oder Fehler des Heavy Workers.
- Auswirkung: Ein gestarteter, teilweise abgerechneter Auftrag kann operativ weder als laufend noch als partiell erkannt werden. Offene Reservierungen, haengende Worker-Aufgaben und eine sichere Wiederaufnahme sind fuer Nutzer und MCP-Agenten nicht pruefbar.
- Erwartung: Der SERP-Lauf braucht eine persistierte Run-Entitaet mit Heartbeat, Lease, Worker-Phase, verarbeitetem Scope, Fehlern und terminalem Status. Activity muss diesen Run statt einzelner unverbundener Charges zeigen. Ein Reaper muss einen fehlenden Fortschritt terminal markieren und den Rest der Reservierung freigeben oder idempotent wiederaufnehmen.

### Ein Bulk-SERP-Lauf mischt DE- und EN-US-Keywords in einem deutschen Suchkontext

- Status: reproduziert
- Beobachtung: Der fuer alle 49 Keywords gestartete Live-SERP-Lauf verwendete einen einheitlichen Kontext. Beim englischen Keyword `seo for ai search` zeigte die Ergebnisansicht `desktop · DE · 2276` und eine deutsche Google-SERP. Die Keywordlisten enthielten zu diesem Zeitpunkt sowohl deutsche als auch englische Begriffe; der Dialog bot keine pro Keyword beziehungsweise pro Liste sichtbare Marktzuordnung.
- Auswirkung: Ein technisch vorhandener SERP-Beleg ist fuer die EN-US-Entscheidung semantisch falsch. Ranking-URLs, Features und Konkurrenzdomains aus Google Deutschland duerfen nicht als US-Daten behandelt werden. Ein Bulk-Lauf kann so Geld verbrauchen, ohne den angegebenen Markt zu verifizieren.
- Erwartung: Kostenpflichtige SERP-Enrichment-Auftraege muessen Markt, Sprache und Geraet unuebersehbar im Quote und vor dem Start zeigen. Gemischte Selektionen sind nach Markt zu splitten oder zu blockieren. Die gespeicherten Ergebnisse und Activity-Eintraege muessen den Kontext je Keyword tragen.

### SERP-Enrichment-Dialog hat keinen Marktwaehler und faellt unsichtbar auf DE zurueck

- Status: im Live-Dialog und im produktiven Codepfad reproduziert
- Beobachtung: Auch nach sauberer Auswahl der Liste `EN-US AI Fanout` mit 31 englischen Keywords zeigte der kostenfreie SERP-Quote keinen Markt, keine Sprache und kein Geraet. Er bot `24 keywords x 0,0096 EUR = 0,23 EUR` an und betrachtete sieben bereits in Deutschland abgefragte englische Keywords als gecacht. Im produktiven Komponentenpfad werden `languageCode` und `locationCode` nicht an `KeywordEnrichmentDialog` uebergeben; dessen Panel-Defaults sind `de` und `2276`.
- Auswirkung: Der Nutzer kann ueber die Keyword-Datenbank keine belastbare US-SERP-Anreicherung starten. Noch kritischer: DE-Daten werden als Cache-Treffer fuer die EN-US-Auswahl behandelt und senken Quote und Scope, obwohl der Suchmarkt nicht passt.
- Erwartung: Der Dialog benoetigt einen verpflichtenden, sichtbaren SERP-Kontext. Cache-Identitaet und Preisermittlung muessen mindestens Keyword, Location, Sprache, Geraet und Modus enthalten. Listen- oder Keyword-Marktmetadaten sollten den Kontext vorbelegen, aber vor Zahlung editierbar und bestaetigungspflichtig bleiben.

### Essentials-Quote erkennt bereits sichtbare Keyworddaten nicht

- Status: reproduziert
- Beobachtung: Der abgeschlossene Essentials-Lauf wurde in Activity mit `49 / 49` und `0,10 EUR` als erfolgreich abgerechnet. Danach zeigte die Tabelle fuer mehrere EN-Keywords bereits Volumen, Trend und teilweise Intent. Ein neuer Quote fuer die 31 Keywords der EN-US-Liste behauptete dennoch `31 keywords remain; 0 already have data and are skipped` und bot Essentials erneut fuer `0,10 EUR` an.
- Auswirkung: Bereits bezahlte beziehungsweise sichtbar vorhandene Daten werden nicht als Cache-/Coverage-Treffer erkannt. Nutzer koennen denselben Scope erneut bezahlen, waehrend der Dialog zugleich eine falsche Datenabdeckung kommuniziert.
- Erwartung: `only missing data` muss denselben, marktbezogenen Coverage-Vertrag wie die Workbench-Tabelle verwenden. Der Quote sollte pro Feld und Keyword aufschluesseln, was vorhanden, veraltet, fehlend oder nicht vom Provider lieferbar ist.

### Zeilen-Checkboxen verwenden alle dasselbe Select-all-Label

- Status: reproduziert
- Beobachtung: In der Keyword-Tabelle trugen die Checkbox-Buttons vieler einzelner Keyword-Zeilen identische Labels wie `Select all visible` beziehungsweise nach Auswahl `Deselect all visible`.
- Auswirkung: Screenreader und Browser-/MCP-Automation koennen eine einzelne Zeilenauswahl nicht verlaesslich von der globalen Sichtbarkeitsauswahl unterscheiden. Selektoren treffen dutzende Elemente und erhoehen das Risiko einer falschen Massenaktion.
- Erwartung: Die Kopf-Checkbox behaelt das Select-all-Label; jede Zeilen-Checkbox nennt Aktion und Keyword eindeutig, zum Beispiel `Select keyword: ai query fanout`.

### Erfolgreiche Klicks werden vom Browser-/MCP-Layer als Timeout gemeldet

- Status: mehrfach reproduziert
- Beobachtung: Mehrere Klickaktionen loesten die erwartete Navigation oder UI-Aenderung sichtbar aus, waehrend der steuernde Browser-Layer anschliessend dennoch mit `Playwright selector deadline exceeded` abbrach. Dasselbe Muster trat spaeter unabhaengig in der lokalen Seiten-QA auf: Der CTA hatte korrekt zu `/de#tool` navigiert, H1 und Toolformular waren sichtbar und die Konsole fehlerfrei, aber `expectNavigation` meldete weiterhin einen URL-Timeout.
- Auswirkung: Ein Agent kann eine bereits ausgefuehrte Aktion faelschlich als fehlgeschlagen werten und sie wiederholen. Bei kostenpflichtigen Starts, Importen oder Loeschungen entsteht dadurch ein konkretes Doppelaktionsrisiko.
- Erwartung: Der Aktionsvertrag muss zwischen `action dispatched`, `navigation completed`, `postcondition reached` und echtem Timeout unterscheiden. Nach einer Navigation sollte die neue URL oder eine stabile Erfolgsbedingung Vorrang vor dem abgelaufenen Ursprungsselektor haben.

### Browser-MCP-Dokumentation beschreibt nicht unterstuetzte Methoden

- Status: reproduziert
- Beobachtung: Der vorgeschriebene Frontend-QA-Ablauf verlangt `tab.playwright.screenshot(...)`; am realen Tab existiert diese Methode nicht, waehrend `tab.screenshot(...)` funktioniert. Ausserdem listet der API-Vertrag `networkidle` als gueltigen Load-State und der QA-Ablauf fordert ihn, der reale Browser-Layer weist ihn jedoch mit `playwright_wait_for_load_state does not support networkidle` zurueck.
- Auswirkung: Ein Agent, der den dokumentierten Vertrag exakt befolgt, scheitert trotz funktionierender Seite und muss Methoden durch Versuch und Irrtum ersetzen. Das erzeugt vermeidbare Fehlermeldungen und kann echte Frontendprobleme verdecken.
- Erwartung: Skill-Beispiele, Type-Definitionen und das tatsaechliche Browser-Backend muessen denselben Methodenvertrag verwenden. Nicht unterstuetzte Load-States duerfen nicht als gueltige Werte dokumentiert werden; Screenshot-Beispiele muessen die reale `Tab`-Methode aufrufen.

### Keyword-Filter aktualisiert sich verzoegert und ohne sichtbaren Ladezustand

- Status: reproduziert
- Beobachtung: Nach Eingabe eines Suchbegriffs blieb die Tabelle fuer etwa 1,5 Sekunden beim vorherigen Ergebnis. Abfragen nach 180 bis 400 Millisekunden lieferten noch die alte Trefferliste und alte Zeilenanzahl; ein sichtbarer Status wie `Filter wird aktualisiert` fehlte.
- Auswirkung: Nutzer und MCP-Agenten koennen veraltete Treffer markieren, falsche Mengen melden oder eine Massenaktion auf einen anderen Scope anwenden als beabsichtigt.
- Erwartung: Die UI sollte Debounce und laufende Abfrage sichtbar machen, waehrenddessen Massenaktionen sperren und nach Abschluss eine stabile Ergebnis-ID beziehungsweise `aria-busy`-Semantik bereitstellen.

### Ausgewaehlte Keywords bleiben beim Wechsel zwischen Listen aktiv

- Status: reproduziert
- Beobachtung: Manuell markierte Zeilen blieben nach dem Wechsel von der DE- in die EN-US-Liste beziehungsweise zur Gesamtansicht ausgewaehlt. Die Bulk-Aktionsleiste machte nicht deutlich, dass die Auswahl aus einem anderen Listenkontext stammt.
- Auswirkung: Eine nachfolgende Anreicherung, Listenaktion oder Loeschung kann unbeabsichtigt Keywords aus mehreren Maerkten betreffen. Zusammen mit dem unsichtbaren SERP-Marktdefault ist das besonders riskant.
- Erwartung: Ein Listenwechsel setzt die Auswahl zurueck oder zeigt Scope und Herkunft jeder fortbestehenden Auswahl eindeutig an. Vor destruktiven oder kostenpflichtigen Bulk-Aktionen muss die UI die betroffenen Listen, Maerkte und exakte Keywordzahl bestaetigen.

### Tabellenrollen fuehren zu aufgeblasenen Zeilenzaehlungen

- Status: reproduziert
- Beobachtung: Rollenbasierte Browser-/MCP-Abfragen auf `row` lieferten mehr Elemente als sichtbare Keywordzeilen, weil verschachtelte Tabellen-/Collection-Strukturen ebenfalls als Zeilen im Accessibility-Baum erschienen.
- Auswirkung: Automationen koennen Bestands-, Auswahl- und Importzahlen falsch berechnen, obwohl die sichtbare Tabelle korrekt aussieht.
- Erwartung: Datensaetze brauchen eine eindeutige semantische Rolle und stabile ID, etwa `data-keyword-id`; Layout- und Gruppencontainer duerfen nicht wie zusaetzliche Datenzeilen exponiert werden.

### Kein zugaenglicher Operator-Trace fuer Heavy-Inngest-Jobs

- Status: reproduziert
- Beobachtung: Der Inngest-Dashboard-Aufruf endete in einer Login-Seite. Ein direkter Aufruf des administrativen Runtime-Pfads wurde im Browser mit `ERR_BLOCKED_BY_CLIENT` blockiert. Die Contextter-Activity selbst zeigte fuer den partiellen SERP-Lauf weder Run-ID noch Worker-Heartbeat oder Fehlerdiagnose.
- Auswirkung: Selbst mit Zugriff auf Workspace und Billing laesst sich nicht belegen, ob der Heavy Worker laeuft, abgestuerzt ist, keinen Lease erhalten hat oder nur die UI veraltet ist.
- Erwartung: Der autorisierte Workspace-/MCP-Vertrag sollte eine nicht-sensitive Operatoransicht mit Run-ID, Queue-Zeit, Worker-Phase, letztem Heartbeat, Versuch, verarbeitetem Scope und terminaler Ursache liefern. Der produktive Diagnoseweg darf nicht von einem separaten, nicht verbundenen Dashboard-Login abhaengen.

### Agent-Platform-Gateway-Vertrag ist lokal nicht isoliert gruen pruefbar

- Status: am 2026-08-30 lokal reproduziert; Produktionsauswirkung nicht bewiesen
- Beobachtung: Der fokussierte bestehende Test `agentPlatform.source-gateway.test.ts` lieferte fuer alle drei unveraenderten Gateway-Faelle bereits `ok: false`, bevor der Keyword-Source-Adapter erreicht wurde. Gleichzeitig erschienen im gemeinsam genutzten Contextter-Worktree parallele, nicht zu diesem Auftrag gehoerende Aenderungen an Authorization- und Gateway-Dateien. Der neue reine Keyword-Data-Gap-Test lief dagegen isoliert gruen.
- Auswirkung: Source-Adapter-Aenderungen koennen derzeit nicht verlaesslich ueber den vollstaendigen Gateway-Pfad regressionsgeprueft werden. Ein fehlgeschlagener End-to-End-Test laesst sich ohne stabilen Authorization-Baseline-Stand nicht sicher dem Adapter, der Admission Policy oder parallelen Aenderungen zuordnen.
- Erwartung: Gateway- und Authorization-Baseline in einem sauberen, eingefrorenen Worktree gruen herstellen; danach Source-Adapter-E2E erneut ausfuehren. CI sollte parallel veraenderte Vertragsdateien beziehungsweise einen dirty Test-Stand sichtbar machen, damit ein Agent lokale Fremdaenderungen nicht als Produktregression meldet.

### Listenbadge zaehlt geloeschte Keywords weiter

- Status: in UI und oeffentlichem MCP-Stored-Read reproduziert
- Beobachtung: Nach dem gezielten Loeschen der zwei neu importierten, semantisch falschen DE-Keywords zeigte die Liste `DE AI Fanout` weiterhin den Badge `18`. Die gefilterte Listenansicht enthielt tatsaechlich nur 16 sichtbare Keywordzeilen; beide geloeschten Begriffe waren nicht mehr auffindbar. Der spaetere MCP-Read bestaetigte dieselbe Abweichung: Listenmetadaten `18`, aber nur 16 zurueckgegebene Mitglieder, Zustand `partial` und Warning `KEYWORD_LIST_MEMBERSHIP_PARTIAL`.
- Auswirkung: Listen- und Marktgroessen sind fuer Nutzer und MCP-Agenten nicht verlaesslich. Deduplizierungs-, Export- und Kostenentscheidungen koennen auf einer falschen Anzahl basieren.
- Erwartung: Der Listencount muss geloeschte Keyworddokumente ausschliessen oder die Mitgliedschaft beim Loeschen atomar entfernen. Badge, Listenabfrage und Export muessen denselben Bestand zaehlen.

### EN-US-Liste enthaelt Records mit deutscher Marktkategorie

- Status: am 2026-08-30 im oeffentlichen Stored-Read reproduziert
- Beobachtung: Die Liste `EN-US AI Fanout` meldet 31 Mitglieder, darunter die Records `query fanout seo` und `ai fanout tool`, deren gespeicherte Kategorie/Zuordnung auf den deutschen Research-Kontext verweist. Der englische Wortlaut allein beweist damit keine US-Marktzustaendigkeit.
- Auswirkung: Liste, Keyword-Sprache und Datenmarkt koennen auseinanderfallen. Ein Batch kann deutsche Cache-/SERP-Daten fuer eine EN-US-Entscheidung wiederverwenden oder die Listengroesse als saubere Marktstichprobe fehlinterpretieren.
- Erwartung: Keyword-Records und Listenmitgliedschaften muessen Markt, Sprache und Datenkontext getrennt tragen. Beim Hinzufuegen in eine abweichende Markt-Liste braucht es entweder eine neue marktbezogene Observation oder einen sichtbaren Warnstatus; keine stille Umdeutung.

### SERP-Ansicht liefert keinen stabilen Top-10-Vertrag

- Status: reproduziert
- Beobachtung: Einzelne SERP-Ansichten zeigten Ergebnisblöcke ohne durchgaengige Rangnummern; in rekonstruierten Ausgaben fehlten Positionen innerhalb der sichtbaren Reihenfolge und teilweise erschien zusaetzlich Position 11.
- Auswirkung: `aktuelle Top-10-SERP` ist nicht deterministisch als genau zehn geordnete organische Ergebnisse extrahierbar. Ranking-URL- und Konkurrenzanalysen koennen dadurch Positionen verwechseln oder einen elften Treffer als Teil der Top 10 behandeln.
- Erwartung: Die Ergebnis-API sollte exakt rankende Eintraege mit `rank`, `url`, `domain`, `resultType`, `isOrganic` und SERP-Kontext liefern. Die UI kann Zusatztreffer zeigen, muss sie aber klar von der bestellten Top-10-Menge trennen.

## P3

### Billing und Workspace-Aktivitaet liefern keine gemeinsame Kostenwahrheit

- Status: reproduziert
- Beobachtung: Die Workspace-Aktivitaet meldete fuer zwei erfolgreiche Keyword-Imports `EUR 0.00` settled spend und keine offenen/fehlgeschlagenen Arbeiten. Im spaeteren Endstand waren fuer den Rechercheauftrag dort `1,03 EUR` nachvollziehbar, waehrend die Organisations-Abrechnung am selben lokalen Tag nur `0,15 EUR` Monatsverbrauch auswies und insgesamt `1,15 EUR` als verbraucht zeigte. Fruehere Eintraege erschienen als `Other Operation` im `General workspace`, ohne Bezug zum `ai-fanout.com`-Workspace. Der aktuelle oeffentliche Account-Read bestaetigt `totalSpent = 115` EUR-Cent, `heldBalance = 0`, `activeHolds = 0` und `availableBalance = 4985`, waehrend seine Cost-Breakdown-Zeilen weiterhin nur 103 Cent (81 Discovery, 12 SERP, 10 Data) erklaeren.
- Auswirkung: Ein auf einen Rechercheauftrag begrenztes Budget kann nicht allein aus einer Ansicht sicher rekonstruiert werden.
- Erwartung: Jede Operation sollte workspaceId, operationId, capability, quote, reserved, settled, released und final status zusammenfuehren. Organisations- und Workspace-Ansicht sollten auf dieselben IDs verlinken.

### GSC-Wizard-Zusammenfassung berechnet eine widerspruechliche Durchschnittsposition

- Status: reproduziert am 2026-08-30
- Eingabe: `get_site_summary` fuer `sc-domain:ai-fanout.com`, letzte 28 abgeschlossene Tage.
- Beobachtung: Die Zusammenfassung meldete fuer eine einzige Impression `avgPosition: 1`. Dieselbe Antwort wies fuer den einzigen Impressionstag Position `7` aus; die separate Seitenabfrage meldete fuer die einzige URL ebenfalls Position `7`.
- Auswirkung: Selbst bei einem minimalen Datensatz widerspricht der KPI den zugrunde liegenden Zeilen. Ein Agent kann dadurch eine falsche Rankingverbesserung melden oder eine Seite mit Position eins annehmen, obwohl der reproduzierbare Rohwert sieben ist.
- Erwartung: Die Summary muss denselben impressionsgewichteten Positionswert wie die zugrunde liegenden Search-Analytics-Zeilen verwenden. Bei leerer Vorperiode darf `0` nicht wie eine reale Position behandelt werden; Antwort und UI sollten Aggregationsweg und Datenquelle nennen.

### Bing-Nachfrage-Fallback ist im verbundenen GSC-Wizard nicht konfiguriert

- Status: reproduziert am 2026-08-30
- Eingabe: acht EN-US- und DE-DE-Abfragen ueber `get_bing_keyword_stats`.
- Beobachtung: Jede Abfrage lieferte `notConfigured: true` und den Hinweis, dass fuer das verbundene Google-Konto kein Bing-Webmaster-API-Key hinterlegt ist.
- Auswirkung: Die vorgesehene zweite Nachfragequelle kann fehlende DataForSEO-Datensaetze derzeit nicht ergaenzen. Das ist kein Beleg fuer null Nachfrage, sondern ein Konfigurations-Gap.
- Erwartung: Die Integration sollte ihren Capability-Status vor einem Batch offenlegen. Der Agent braucht `configured`, unterstuetzte Laender/Sprachen, Datenfrische und eventuelle Kosten, bevor einzelne Keywords abgefragt werden. Nach Konfiguration muss Bing-Evidenz als eigene Quelle gekennzeichnet bleiben und darf nicht als Google-Suchvolumen erscheinen.

### Datumsanzeige mischt lokale Workspace-Zeit und UTC ohne Kennzeichnung

- Status: reproduziert
- Beobachtung: Position-Tracking- beziehungsweise Reportansichten zeigten den 29.08., waehrend die zugehoerige Workspace-Aktivitaet im lokalen Nutzungskontext bereits am 30.08. stattfand. Eine sichtbare Zeitzone fehlte.
- Auswirkung: Kosten, Runs und Rankings lassen sich bei Tagesgrenzen nicht sicher zusammenfuehren. Das erschwert Budget- und Incident-Rekonstruktion.
- Erwartung: Zeitstempel sollten ISO-Zeit und Zeitzone im Detail liefern und in allen Oberflaechen dieselbe, klar bezeichnete Darstellungszone verwenden.

## Positiv verifiziert

- Die Activity-Seite meldete fuer den 90-Tage-Zeitraum zwei erfolgreiche Keyword-Imports, null laufende, null partielle und null fehlgeschlagene Jobs.
- Der Dialog zeigt vor dem Start eine Kostenaufschluesselung und den prognostizierten Kontostand.
