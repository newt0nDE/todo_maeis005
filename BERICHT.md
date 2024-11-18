# Projektbericht: CI/CD - Softwarequalität WS24

## Teammitglieder
- Marvin Eisenberg, Matrikelnummer: 30243419

## 1. Vorgehensweise
### 1.1. Vorbereitung

- **Fork des Repositories erstellen**:<br>
Bevor ich mit der Bearbeitung des Codes und dem Erstellen von Testfällen starten konnte, war es notwendig das Original Github Repo zu forken. Dies geht direkt auf der Github Repo Seite über den Button "Fork". Anschließend habe ich eine geforkte Kopie des Original Repos in meinem Github Account "newt0nDE".

- **Github Codespaces einrichten**:<br>
Der erste für mich neue Schritte beim Bearbeiten der Aufgabe war es, Github Codespaces anstatt meiner lokalen Jetbrains Webstorm Umgebung zu nutzen. Das Erstellen eines neuen Code-Spaces ging direkt aus dem Repository auf der Github Webseite und war erstaunlich einfach. Die Umstellung auf VS Code war zum Glück ebenfalls wenig aufregend.

- **Todo Anwendung starten & verstehen**:<br>
Um die Aufgabe sinnvoll lösen zu können war es natürlich wichtig die Anwendung auch selber mal zu starten und sich ein wenig mit der aktuellen Code Basis auseinandern zu setzen. Die Anwendung selber startet man mit "npm start", wichtig hierbei ist es vorher in das /backend Verzeichnis zu wechseln. Bevor man "npm start" ausführt muss man einmalig auch "npm install" ausführen, damit NodeJS die benötigten Abhängigkeiten installiert. Damit ein Zugriff auf die laufende Anwendung (in Codespace) erfolgreich ist musste ich hier die Port-Sicherheit im Codespace auf "öffentlich" setzen. Dann kann man über eine umgeleitete Webadresse auf die Anwendung zugreifen. **ACHTUNG**: Hinter die URL muss noch /todo.html hinzugefügt werden damit das klappt.

Sieht im Browser dann so aus: ![first_start](/images/first_start.png)

### 1.2. Erstellung automatisierter Tests

- **Backend Tests erstellen**:<br>
Zuerst habe ich die Test für das Backend erstellt. Dafür war bereits eine Datei /backend/todo.test.js im Repo vorhanden, in der Testfälle für das Backend vorkonfiguriert waren. Als Testtool wurde hier das NodeJS Modul "Supertest" genutzt. Hier musste ich also lediglich die vorhandenen Testfälle ergänzen/ anpassen. Wichtig war es hierbei alle CRUD-Operationen abzudecken. Sprich:
1. Create: Neue Todos erstellen
2. Read: Todos ausgeben
3. Update: Bestehendes Todo aktualisieren
4. Delete: Bestehendes Todo löschen

- **Backend Tests ausführen**:<br>
Die erstellen Testfälle für das Backend lassen sich mit dem Befehl "npm test" ausführen, anschließend erhält man eine Zusammenfassung über die Ergebnisse: ![backend_tests](/images/backend_tests.png)

- **Frontend Tests erstellen**:<br>
Die Frontend Test wurden mit dem NodeJS Paket "Cypress" erstellt und durchgeführt. Dafür war es notwendig eine Verzeichnisstruktur anzulegen mit der Cypress arbeiten kann: /frontend/cypress/e2e. Bei der Durchführung der Tests mit Cypress erstellt Cypress dann selber noch das Verzeichnis /frontend/cypress/screenshots. Hier legt Cypress bei gefundenen Fehlern einen Screenshot vom integrierten Chromium ab, aus dem ersichtlich wird wo ein Test fehlschlägt und wie die Webanwendung zum Zeitpunkt des Fehlers aussieht. Im /frontend Verzeichnis musste noch eine Cypress-Konfiguration erstellt werden. Hierdrin wird Cypress mitgeteilt wo sich die Testfälle befinden und auf welchem Port die zu testende Anwendung ausgeführt wird. Übrigens habe ich auch hier wieder Testfälle für alle CRUD-Operationen erstellt, ähnlich zu den Backend Tests.

- **Frontend Tests ausführen**:<br>
Die Ausführung der Frontend Tests mit Cypress sollten wir lokal und nicht in Codespaces ausführen, wahrscheinlich weil der Befehl "npx cypress open" hier nicht funktioniert und die Weboberfläche die sich öffnet dann nicht korrekt gerendert wird: ![cypress_in_codespaces](/images/cypress_in_codespaces.png)

Ich habe mich auf Grund des Aufwands (Hin- und Herkopieren zwischen des Repos zwischen Lokal und Codespaces) dagegen entschieden es lokal zu machen und einfach stattdessen den Befehl "npx cypress run" zu nutzen. Hier wird Cypress dann einfach ohne GUI ausgeführt und die Browser-Sitzung simuliert. Fehler werden dann als Screenshot gerendert und, wie bereits oben erwähnt, im Verzeichnis /screenshots gespeichert.

Noch ein wichtiger Hinweis: Damit das klappt muss in einer 2. Konsolensitzung zuerst die NodeJS Anwendung gestartet werden und im Hintergrund laufen und erreichbar sein.

Wenn ein Test fehlschlägt sieht das ca. so aus: ![cypress_error](/images/cypress_error.png)


### 1.3. Einrichtung der GitHub-Action
Github Actions Workflows sind sequenzielle Workflows die in einer zentralen YAML-Datei konfiguriert werden können um definierte Tests und Qualitätssicherungen direkt vor einem Push/Pull auf einem Repository durzuführen. Zum erstellen des Workflows war es also notwendig diese YAML-Datei zu erstellen. Diese legt man im Repo an unter .github/workflows/main.yml. In dieser Datei werden auch Vorbedingungen angelegt die notwendig sind um die Tests durchzuführen, wie zum Beispiel die Konfiguration einer MongoDB Datenbank Instanz. Wichtige Keys sind hier also: 
1. name: Name des Workflows
2. on: definiert wann der Workflow getriggert werden soll
3. jobs/services: Zusätzliche Dienste/ Abhängigkeiten wie MongoDB
4. jobs/steps: Einzelne Schritte zu Testausführung

Ob der Github Actions Workflow funktioniert kann man testen, indem man einen Pullrequest erstellt - vor dem Merge wird der Workflow getriggert und bei Fehlern ist ein Merge nicht möglich. Hier muss dann entweder der Workflow oder der eingereichte Code überarbeitet werden.

Sieht im Github dann so aus: ![github_actions](/images/github_actions.png)

Wichtige Hinweise noch: Wie auch schon beim lokalen ausführen der Test ist es wichtig vor dem Starten der Tests in die korrekten Verzeichnisse zu wechseln! Das lässt sich ebenfalls in der YAML hinterlegen.

### 1.4. Integration von SonarQube
- **Projektanlage in SonarQube**: 
SonarQube ist ein Plattform-Tool zur statischen Codeanalyse. 

"SonarQube analysiert den Quelltext hinsichtlich folgender Qualitätsbereiche:

1. Doppelter Code
2. Abdeckung durch Modultests
3. Komplexität
4. Potentielle Fehler
5. Kodierrichtlinien
6. Kommentare"

(zitiert von SonarQube's Wikipedia Seite, Zugriff am 18.11.2024 20:30 uhr)

Zur Nutzung von SonarQube haben wir die folgende URL erhalten:
[hopper.fh-swf.de/sonarqube](https://hopper.fh-swf.de/sonarqube)

Hier kann man sich mit seinem bestehenden Github Account anmelden und ein neues lokales Projekt erstellen. Dabei vergibt man einen Namen und einen Key, diese sind in meinem Fall identisch und lauten wie mein Repo "todo_maeis005". Außerdem muss man seinen Main-Branch auswählen, da dieser bei mir aber tatsächlich auch "Main" heißt, war keine Anpassung notwendig.

Der nächste Schritt war die Erstellung von Env-Variablen in meinen Repo-Settings um dem SonarQube Zugriff auf meinen Code zu geben. Dazu in Github unter /repo/settings/security "new repository key" klicken und 2 Key erstellen. Einen für die "SONAR_HOST_URL" (hopper.fh-swf.de) und einen für den "SONAR_TOKEN", dieser wird bei dem Erstellen des Projektes in SonarQube mitgeteilt.

Der letzte notwendige Schritt war dann das Anpassen der Github Actions YAML-Datei, damit die statische Codeanalyse Teil des Testvorgangs wird. Die Anassung umfasst dann das Hinzufügen dieser Werte:

```yaml
- name: Run SonarQube Scan
  uses: sonarsource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

Wenn man jetzt den Github Actions Workflow anstartet kann man in der Weboberfläche des SonarQubes erste Ergebnisse für die Codeanalyse seines Repos bewundern:

![sonar_results](/images/sonar_results.png)

Besonderen Augenmerkt sollte man dabei dann wahrscheinlich auf den Reiter "Security" legen. Zum Glück ist hier nichts aufgefallen.

### 1.5. Pull-Request im Original Repo erstellen
Nachdem dann alles funktioniert hat war es an der Zeit meine Ergebnisse samit diesem Bericht als Pull-Request im Original Repo abzugeben und auf gute Note zu hoffen ;).

## 2. Aufgetretene Probleme und deren Lösungen
