# Nulmeting Burgerschapsonderwijs - Focus met Aandacht

Complete nulmeting tool voor scholen om hun burgerschapsonderwijs te evalueren.

## 🎯 Wat is dit?

Een interactieve tool waarmee scholen:
- Hun burgerschapsonderwijs kunnen meten aan de hand van 5 domeinen
- Direct een rapport ontvangen met scores en adviezen
- Inzicht krijgen in verbeterpunten
- Inspectie verantwoording kunnen voorbereiden

## 📋 Features

- ✅ 20 aspecten verdeeld over 5 domeinen
- ✅ Automatische score berekening
- ✅ Email rapport naar school (via EmailJS)
- ✅ Lead opslag (via Getform)  
- ✅ PDF download optie
- ✅ Responsive design
- ✅ Demo & Lead modes

## 🚀 Installatie & Deploy naar Netlify

### **Stap 1: GitHub Repository maken**

1. Ga naar [GitHub](https://github.com) en log in
2. Klik op **"New repository"**
3. Naam: `nulmeting-burgerschap-scholen`
4. Kies **Public** (of Private als je premium hebt)
5. Klik **"Create repository"**

### **Stap 2: Upload code naar GitHub**

**Optie A: Via GitHub Desktop (makkelijkst)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone je nieuwe repository
3. Kopieer ALLE bestanden uit deze `nulmeting-scholen` map
4. Commit & Push

**Optie B: Via GitHub website**
1. In je nieuwe repository, klik **"uploading an existing file"**
2. Sleep ALLE bestanden uit deze map
3. Commit changes

### **Stap 3: Deploy naar Netlify**

1. Ga naar [Netlify](https://netlify.com) en maak een **nieuw account**
   - Of log in met je nieuwe account (NIET je oude account!)
   
2. Klik **"Add new site"** → **"Import an existing project"**

3. Kies **GitHub** als provider

4. Autoriseer Netlify om toegang te krijgen tot je repositories

5. Selecteer je **`nulmeting-burgerschap-scholen`** repository

6. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Klik **"Deploy site"**

7. **Wacht 2-3 minuten** terwijl Netlify de site bouwt

8. Je krijgt een URL zoals: `https://random-name-12345.netlify.app`

9. **Optioneel**: Wijzig de site naam
   - Site settings → Change site name → `nulmeting-scholen`
   - Je URL wordt: `https://nulmeting-scholen.netlify.app`

## 🔧 Configuratie

### EmailJS Setup (al geconfigureerd!)

De nulmeting is al geconfigureerd met jouw EmailJS credentials:
- Service ID: `service_nebjm8o`
- Template ID: `template_379kfon`
- Public Key: `kgnlp3ATcUWA_btSC`

### Getform Setup (al geconfigureerd!)

Formulier data wordt verzonden naar:
- Endpoint: `https://getform.io/f/bejjjxxa`

## 🎭 URL Modes

De nulmeting ondersteunt verschillende modes via URL parameters:

### **Normale mode** (productie)
```
https://jouw-site.netlify.app
```
- School ontvangt email
- Data naar Getform
- Volledig functioneel

### **Lead mode** (handmatig versturen)
```
https://jouw-site.netlify.app?lead=true
```
- School ontvangt GEEN email
- Alleen download rapport
- Jij krijgt data in Getform
- Voor personal outreach

### **Demo mode** (testen)
```
https://jouw-site.netlify.app?demo=true
```
- Geen emails
- Geen Getform  
- Alleen lokale download
- Voor demonstraties

## 📧 Email Template

Zorg dat je EmailJS template deze variabelen bevat:

```
{schoolnaam}
{schooltype}
{contactpersoon}
{email}
{telefoon}
{totaalscore}
{democratisch_burgerschap}
{maatschappelijke_participatie}
{identiteitsontwikkeling}
{sociale_cohesie}
{organisatie_verantwoording}
{rapport_html}
{datum}
```

## 🎨 Aanpassingen

### Kleuren wijzigen

Open `src/App.jsx` en zoek naar de kleuren:
- Primair: `#3b82f6` (blauw)
- Secundair: `#1d4ed8` (donkerblauw)
- Succes: `#22c55e` (groen)

### Teksten aanpassen

Alle teksten staan in `src/App.jsx`:
- Header tekst
- Domein namen
- Aspecten
- Adviezen

### Logo toevoegen

1. Plaats logo in `/public/logo.png`
2. Voeg toe in `src/App.jsx`:
```jsx
<img src="/logo.png" alt="Logo" className="h-16 mb-4" />
```

## 🧪 Lokaal testen

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Open browser naar:
# http://localhost:5173
```

## 📦 Handmatige deploy

Als je wilt deployen zonder GitHub:

```bash
# Build productie versie
npm run build

# Upload de 'dist' map via Netlify web interface
# Drag & drop de dist folder naar netlify.com
```

## ✅ Checklist na deploy

- [ ] Site is live op Netlify
- [ ] Test formulier invullen
- [ ] Check of email aankomt bij school
- [ ] Check of data in Getform zichtbaar is
- [ ] Test lead mode (`?lead=true`)
- [ ] Test demo mode (`?demo=true`)
- [ ] Eventueel custom domain instellen

## 🔗 Custom Domain (optioneel)

1. Netlify → Site settings → Domain management
2. Klik "Add custom domain"
3. Voer in: `nulmeting.focusmetaandacht.nl`
4. Volg instructies voor DNS instellingen

## 📞 Support

Voor vragen of problemen:
- Email: info@focusmetaandacht.nl
- Check EmailJS dashboard voor email statistieken
- Check Getform dashboard voor submissions

## 🎓 Credits

Gebouwd voor Focus met Aandacht
Burgerschapsonderwijs voor PO en VO

---

**Versie:** 1.0
**Laatst bijgewerkt:** Februari 2026
