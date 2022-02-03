# Parsable Templates Handling

A script to add attributes to all templates that still doesn't have the selected attribute.

## To Do

Add more ways to filter or control the templates, maybe a csv handler to read a file. Enable user to select a server (EU/US) currently have to change the base url in code to change servers.

## Pre-Requisites
```
Node
Yarn
```

## Usage
```bash
yarn start
Handle Templates in Bulk For Parsable
***** ver 0.0.1 *****
✔ Please enter your email: … martin.halum@parsable.com
✔ Please enter your password: … **********
Logging into Parsable... done
Fetching User Teams... done
? Please select a process › - Use arrow-keys. Return to submit.
❯   Update Attributes
? Please select your Team: › - Use arrow-keys. Return to submit.
❯   Loreal-US
    Henkel
    Tate-US
    Silgan PFC
    Sandbox.GB
    GB-Bakeries BBU
    eCompletions™ Shop
    Bimbo-Brasil
    TFMC Subsea Services
  ↓ Sandbox-Martin
? Please select attribute to add: › 
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    a: Toggle all
    enter/return: Complete answer
◯   Malabon
◯   Manila
◯   Pasig
◯   General
```