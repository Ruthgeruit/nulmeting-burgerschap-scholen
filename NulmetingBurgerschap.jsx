import React, { useState } from 'react';
import { Check, X, FileText, Download, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

const NulmetingBurgerschap = () => {
  const [schoolType, setSchoolType] = useState('PO');
  const [schoolName, setSchoolName] = useState('');
  const [responses, setResponses] = useState({});
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTelefoon, setContactTelefoon] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const domeinen = [
    {
      id: 'democratie',
      naam: 'Democratisch burgerschap',
      uitleg: 'Democratisch burgerschap gaat over kennis van en respect voor de basiswaarden van de democratische rechtsstaat: vrijheid van meningsuiting, gelijkwaardigheid, verdraagzaamheid en het afwijzen van discriminatie.',
      scoreKaders: {
        goed: 'Leerlingen krijgen regelmatig gelegenheid om te oefenen met democratische besluitvorming, er is actieve inspraak (bijv. leerlingenraad), en grondrechten worden in verschillende vakken behandeld.',
        voldoende: 'Er is aandacht voor democratie in het lesprogramma en leerlingen hebben enige vorm van inspraak, maar dit gebeurt nog niet structureel.',
        beperkt: 'Democratie komt soms ter sprake, maar er is geen doorgaande lijn en weinig mogelijkheden voor leerlingen om te oefenen.',
        niet: 'Er is geen aandacht voor democratische waarden en leerlingen hebben geen inspraak.'
      },
      aspecten: [
        { id: 'd1', tekst: 'Leerlingen leren over democratische besluitvorming en verkiezingen' },
        { id: 'd2', tekst: 'Leerlingen oefenen met inspraak en medezeggenschap (bijv. leerlingenraad)' },
        { id: 'd3', tekst: 'Aandacht voor grondrechten en vrijheden' },
        { id: 'd4', tekst: 'Kennismaking met lokale/nationale democratische instellingen' }
      ]
    },
    {
      id: 'participatie',
      naam: 'Maatschappelijke participatie',
      uitleg: 'Maatschappelijke participatie gaat over actieve betrokkenheid bij de samenleving. Leerlingen ontwikkelen vaardigheden om samen te werken, problemen te signaleren en bij te dragen aan hun omgeving.',
      scoreKaders: {
        goed: 'Leerlingen werken structureel aan (school)projecten, hebben contact met lokale organisaties en leren actief problemen op te lossen.',
        voldoende: 'Er zijn enkele projecten en activiteiten waarbij leerlingen samenwerken, maar dit is nog niet systematisch verankerd.',
        beperkt: 'Af en toe is er een project, maar er is geen structurele aandacht voor maatschappelijke betrokkenheid.',
        niet: 'Leerlingen werken nauwelijks samen aan projecten en er is geen contact met de lokale gemeenschap.'
      },
      aspecten: [
        { id: 'p1', tekst: 'Leerlingen werken samen aan (school)projecten' },
        { id: 'p2', tekst: 'Aandacht voor vrijwilligerswerk en maatschappelijke betrokkenheid' },
        { id: 'p3', tekst: 'Contact met lokale organisaties of gemeenschap' },
        { id: 'p4', tekst: 'Leerlingen leren problemen signaleren en oplossingen bedenken' }
      ]
    },
    {
      id: 'identiteit',
      naam: 'Identiteitsontwikkeling',
      uitleg: 'Identiteitsontwikkeling gaat over wie je bent en wat je belangrijk vindt. Leerlingen leren reflecteren op eigen normen en waarden en ontwikkelen respect voor verschillende achtergronden en levensovertuigingen.',
      scoreKaders: {
        goed: 'Er is regelmatig aandacht voor zelfbeeld, normen en waarden, diversiteit wordt gevierd en leerlingen leren respectvol omgaan met verschillen en overeenkomsten.',
        voldoende: 'Identiteit en diversiteit komen aan bod in lessen, maar dit gebeurt nog niet structureel over alle leerjaren.',
        beperkt: 'Soms is er aandacht voor wie je bent en verschillen tussen mensen, maar zonder duidelijke leerlijn.',
        niet: 'Er is nauwelijks aandacht voor identiteitsontwikkeling en het respecteren van diversiteit.'
      },
      aspecten: [
        { id: 'i1', tekst: 'Aandacht voor zelfbeeld en eigenwaarde' },
        { id: 'i2', tekst: 'Reflectie op eigen normen, waarden en overtuigingen' },
        { id: 'i3', tekst: 'Respect voor diverse achtergronden en levensovertuigingen' },
        { id: 'i4', tekst: 'Aandacht voor omgaan met verschillen en overeenkomsten' }
      ]
    },
    {
      id: 'sociale',
      naam: 'Sociale cohesie',
      uitleg: 'Sociale cohesie gaat over hoe we met elkaar omgaan. Leerlingen ontwikkelen vaardigheden voor conflicthantering, empathie, respect en werken aan een veilig schoolklimaat waar iedereen zich welkom voelt.',
      scoreKaders: {
        goed: 'Leerlingen leren actief omgaan met conflicten, er is structurele aandacht voor respect en empathie, en de school heeft een veilig klimaat met heldere afspraken tegen pesten en discriminatie.',
        voldoende: 'Er zijn afspraken over omgangsvormen en bij conflicten wordt ingegrepen, maar leerlingen leren nog niet systematisch hoe ze zelf constructief kunnen handelen.',
        beperkt: 'Schoolregels zijn er, maar er is weinig aandacht voor het aanleren van sociale vaardigheden of conflicthantering.',
        niet: 'Er zijn regelmatig conflicten en geen duidelijke aanpak voor een veilig en respectvol schoolklimaat.'
      },
      aspecten: [
        { id: 's1', tekst: 'Leerlingen leren omgaan met conflicten en meningsverschillen' },
        { id: 's2', tekst: 'Aandacht voor respect, empathie en samenwerking' },
        { id: 's3', tekst: 'Positief schoolklimaat waarin iedereen zich veilig voelt' },
        { id: 's4', tekst: 'Aandacht voor pesten, uitsluiting en discriminatie' }
      ]
    },
    {
      id: 'organisatie',
      naam: 'Organisatie & Verantwoording',
      uitleg: 'Dit gaat over hoe burgerschap is georganiseerd op school. Heeft de school een duidelijke visie? Is burgerschap verankerd in het schoolplan? Zijn leraren geschoold en kan de school verantwoording afleggen aan de inspectie?',
      scoreKaders: {
        goed: 'School heeft een heldere visie en beleid, burgerschap staat in schoolplan en jaarplan, team is geschoold, en er is concrete verantwoording met voorbeelden mogelijk.',
        voldoende: 'Er is een visie en burgerschap staat op papier, maar de uitvoering en verantwoording kunnen nog worden versterkt.',
        beperkt: 'Er is enig beleid, maar dit is niet concreet uitgewerkt en het team heeft weinig scholing gehad.',
        niet: 'Er is geen duidelijke visie of beleid en de school kan moeilijk verantwoording afleggen.'
      },
      aspecten: [
        { id: 'o1', tekst: 'School heeft een visie/beleid op burgerschapsonderwijs' },
        { id: 'o2', tekst: 'Burgerschap is verankerd in schoolplan en jaarplan' },
        { id: 'o3', tekst: 'Team is geschoold in burgerschapsonderwijs' },
        { id: 'o4', tekst: 'School kan verantwoording afleggen aan inspectie (met voorbeelden)' },
        { id: 'o5', tekst: 'Evaluatie en bijsturing van burgerschapsactiviteiten vindt plaats' }
      ]
    }
  ];

  const handleResponse = (aspectId, waarde) => {
    setResponses(prev => ({ ...prev, [aspectId]: waarde }));
  };

  const getScore = (domeinId) => {
    const domein = domeinen.find(d => d.id === domeinId);
    const aspectIds = domein.aspecten.map(a => a.id);
    const domeinResponses = aspectIds.map(id => responses[id]).filter(r => r !== undefined);
    if (domeinResponses.length === 0) return null;
    const sum = domeinResponses.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / (aspectIds.length * 3)) * 100);
  };

  const getTotaalScore = () => {
    const scores = domeinen.map(d => getScore(d.id)).filter(s => s !== null);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getKleur = (score) => {
    if (score === null) return 'bg-gray-200';
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAdvies = (score) => {
    if (score === null) return '';
    if (score >= 75) return 'Goed op orde! Blijf monitoren en verder ontwikkelen.';
    if (score >= 50) return 'Basis aanwezig. Focus op versterking en systematische aanpak.';
    return 'Aandachtspunt! Dit vraagt prioriteit en gerichte actie.';
  };

  const isNulmetingCompleet = () => {
    const totaalAspecten = domeinen.reduce((sum, d) => sum + d.aspecten.length, 0);
    return Object.keys(responses).length === totaalAspecten;
  };

  const generateHTMLRapport = () => {
    const totaalScore = getTotaalScore();
    const getScoreColor = (score) => {
      if (score >= 75) return '#10b981';
      if (score >= 50) return '#f59e0b';
      return '#ef4444';
    };

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .info-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .score-card { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .score-title { font-size: 18px; font-weight: bold; color: #1f2937; }
    .score-value { font-size: 24px; font-weight: bold; }
    .score-bar { width: 100%; height: 24px; background-color: #e5e7eb; border-radius: 12px; overflow: hidden; }
    .score-fill { height: 100%; transition: width 0.3s ease; }
    .advice-box { padding: 12px; border-radius: 6px; margin: 10px 0; font-size: 14px; }
    .advice-good { background-color: #d1fae5; color: #065f46; }
    .advice-ok { background-color: #fef3c7; color: #92400e; }
    .advice-poor { background-color: #fee2e2; color: #991b1b; }
    .aspect-list { margin: 15px 0; }
    .aspect-item { padding: 8px; margin: 5px 0; background-color: white; border-radius: 4px; font-size: 14px; display: flex; align-items: center; }
    .aspect-icon { margin-right: 10px; font-weight: bold; }
    .icon-good { color: #10b981; }
    .icon-ok { color: #f59e0b; }
    .icon-poor { color: #ef4444; }
    .action-section { background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .action-title { color: #991b1b; font-weight: bold; font-size: 18px; margin-bottom: 10px; }
    .next-steps { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 8px; margin: 30px 0; }
    .next-steps h3 { margin-top: 0; }
    .next-steps ul { padding-left: 20px; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-signature { margin: 20px 0; }
    .footer-signature strong { display: block; margin: 5px 0; color: #4f46e5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Nulmeting Burgerschapsonderwijs</h1>
      <p>Focus met Aandacht</p>
    </div>
    
    <div class="content">
      <div class="info-box">
        <strong>School:</strong> ${schoolName}<br>
        <strong>Type:</strong> ${schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs'}<br>
        <strong>Contactpersoon:</strong> ${contactName}<br>
        <strong>Datum:</strong> ${new Date().toLocaleDateString('nl-NL')}
      </div>

      <div class="score-card" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
        <div class="score-header">
          <div class="score-title">Totaalscore Burgerschapsonderwijs</div>
          <div class="score-value" style="color: ${getScoreColor(totaalScore)}">${totaalScore}%</div>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${totaalScore}%; background-color: ${getScoreColor(totaalScore)};"></div>
        </div>
        <p style="margin-top: 15px; font-size: 14px;">
          ${totaalScore >= 75 ? '✅ Goed op orde! Blijf monitoren en verder ontwikkelen.' : 
            totaalScore >= 50 ? '⚠️ Basis aanwezig. Focus op versterking en systematische aanpak.' : 
            '🔴 Aandachtspunt! Dit vraagt prioriteit en gerichte actie.'}
        </p>
      </div>

      <h2 style="color: #4f46e5; margin-top: 40px;">📊 Scores per domein</h2>
`;

    domeinen.forEach(domein => {
      const score = getScore(domein.id);
      const scoreColor = getScoreColor(score);
      const adviceClass = score >= 75 ? 'advice-good' : score >= 50 ? 'advice-ok' : 'advice-poor';

      html += `
      <div class="score-card">
        <div class="score-header">
          <div class="score-title">${domein.naam}</div>
          <div class="score-value" style="color: ${scoreColor}">${score}%</div>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${score}%; background-color: ${scoreColor};"></div>
        </div>
        <div class="advice-box ${adviceClass}">
          ${getAdvies(score)}
        </div>
        <div class="aspect-list">
`;

      domein.aspecten.forEach(aspect => {
        const resp = responses[aspect.id];
        const icon = resp === 3 ? '✓✓✓' : resp === 2 ? '✓✓' : resp === 1 ? '✓' : '✗';
        const iconClass = resp === 3 ? 'icon-good' : resp === 2 ? 'icon-ok' : resp === 1 ? 'icon-poor' : 'icon-poor';
        const label = resp === 3 ? 'Goed' : resp === 2 ? 'Voldoende' : resp === 1 ? 'Beperkt' : 'Niet';

        html += `
          <div class="aspect-item">
            <span class="aspect-icon ${iconClass}">${icon}</span>
            <span><strong>${label}:</strong> ${aspect.tekst}</span>
          </div>
`;
      });

      html += `
        </div>
      </div>
`;
    });

    let heeftActiepunten = false;
    let actiepuntenHTML = '';
    
    domeinen.forEach(domein => {
      const score = getScore(domein.id);
      if (score !== null && score < 75) {
        const zwakkePunten = domein.aspecten.filter(a => responses[a.id] !== undefined && responses[a.id] < 2);
        if (zwakkePunten.length > 0) {
          heeftActiepunten = true;
          actiepuntenHTML += `<h4 style="color: #991b1b; margin-top: 15px;">${domein.naam} (${score}%)</h4><ul style="margin: 5px 0;">`;
          zwakkePunten.forEach(aspect => {
            actiepuntenHTML += `<li>${aspect.tekst}</li>`;
          });
          actiepuntenHTML += '</ul>';
        }
      }
    });

    if (heeftActiepunten) {
      html += `
      <div class="action-section">
        <div class="action-title">⚡ Prioriteiten & Actiepunten</div>
        <p>De volgende aspecten verdienen extra aandacht:</p>
        ${actiepuntenHTML}
      </div>
`;
    }

    html += `
      <div class="next-steps">
        <h3>🚀 Volgende Stappen</h3>
        <p>Op basis van deze nulmeting kunnen wij u ondersteunen met:</p>
        <ul>
          <li>Gerichte lessen op de domeinen die aandacht nodig hebben</li>
          <li>Inspectieproof lesdocumentatie en verantwoording</li>
          <li>Scholing voor het team over burgerschapsonderwijs</li>
          <li>Begeleiding bij het opstellen van beleid en jaarplannen</li>
        </ul>
        <p style="margin-top: 20px; font-weight: bold;">Wij nemen binnen 2 werkdagen contact met u op om de mogelijkheden te bespreken.</p>
      </div>
    </div>

    <div class="footer">
      <div class="footer-signature">
        <p style="margin: 5px 0;">Met vriendelijke groet,</p>
        <strong>Jeannette Uiterwijk</strong>
        <strong style="color: #4f46e5;">Focus met Aandacht</strong>
      </div>
      <p style="font-size: 14px; color: #6b7280;">
        <a href="http://www.focusmetaandacht.nl" style="color: #4f46e5; text-decoration: none;">www.focusmetaandacht.nl</a><br>
        <a href="mailto:info@focusmetaandacht.nl" style="color: #4f46e5; text-decoration: none;">info@focusmetaandacht.nl</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
        Dit rapport is gegenereerd op ${new Date().toLocaleString('nl-NL')}
      </p>
    </div>
  </div>
</body>
</html>
`;

    return html;
  };

  const handleSubmitToGetform = async () => {
    if (!schoolName || !contactEmail || !consent) {
      alert('Vul alle verplichte velden in en geef toestemming om te verzenden.');
      return;
    }

    if (!isNulmetingCompleet()) {
      alert('Beantwoord eerst alle vragen voordat u het formulier verstuurt.');
      return;
    }

    setIsSubmitting(true);

    const domeinscores = {};
    domeinen.forEach(d => {
      domeinscores[d.naam] = getScore(d.id) + '%';
    });

    const EMAILJS_SERVICE_ID = 'service_nebjm8o';
    const EMAILJS_TEMPLATE_ID = 'template_379kfon';
    const EMAILJS_PUBLIC_KEY = 'kgnlp3ATcUWA_btSC';

    const emailParams = {
      schoolnaam: schoolName,
      schooltype: schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs',
      contactpersoon: contactName,
      email: contactEmail,
      telefoon: contactTelefoon || 'Niet opgegeven',
      totaalscore: getTotaalScore() + '%',
      democratisch_burgerschap: domeinscores['Democratisch burgerschap'],
      maatschappelijke_participatie: domeinscores['Maatschappelijke participatie'],
      identiteitsontwikkeling: domeinscores['Identiteitsontwikkeling'],
      sociale_cohesie: domeinscores['Sociale cohesie'],
      organisatie_verantwoording: domeinscores['Organisatie & Verantwoording'],
      rapport_html: generateHTMLRapport(),
      datum: new Date().toLocaleString('nl-NL'),
      cc_email: 'info@focusmetaandacht.nl'  // Kopie naar Focus met Aandacht
    };

    // 🎯 FIX: Voeg rapport toe aan Getform payload
    const getformPayload = {
      schoolnaam: schoolName,
      schooltype: schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs',
      contactpersoon: contactName,
      email: contactEmail,
      telefoon: contactTelefoon || 'Niet opgegeven',
      totaalscore: getTotaalScore() + '%',
      democratisch_burgerschap: domeinscores['Democratisch burgerschap'],
      maatschappelijke_participatie: domeinscores['Maatschappelijke participatie'],
      identiteitsontwikkeling: domeinscores['Identiteitsontwikkeling'],
      sociale_cohesie: domeinscores['Sociale cohesie'],
      organisatie_verantwoording: domeinscores['Organisatie & Verantwoording'],
      rapport: generateHTMLRapport(), // ✅ TOEGEVOEGD: Het volledige HTML rapport
      datum: new Date().toLocaleString('nl-NL')
    };

    try {
      console.log('Versturen email naar:', contactEmail);
      
      const emailResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_PUBLIC_KEY
      );
      
      console.log('EmailJS SUCCESS:', emailResult);

      await fetch('https://getform.io/f/allqkmda', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(getformPayload),
      });

      setTimeout(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
      
    } catch (error) {
      console.error('VOLLEDIGE ERROR:', error);
      setIsSubmitting(false);
      
      if (error.text) {
        alert('❌ Email kon niet worden verzonden: ' + error.text + '\nNeem contact op met info@focusmetaandacht.nl');
      } else {
        alert('❌ Er ging iets mis bij het verzenden: ' + (error.message || 'Onbekende fout') + '\nNeem contact op via info@focusmetaandacht.nl');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Nulmeting Burgerschapsonderwijs</h1>
          <p className="text-gray-600 mb-6">
            Voor verantwoording aan de inspectie volgens het inspectiekader 2024
          </p>

          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-indigo-900 mb-2">Hoe werkt het?</h3>
            <ol className="text-sm text-indigo-800 space-y-1 ml-4">
              <li>1. Kies uw onderwijstype en vul schoolnaam in</li>
              <li>2. Beantwoord alle vragen over de 5 domeinen</li>
              <li>3. Vul contactgegevens in onderaan de pagina</li>
              <li>4. Verstuur en ontvang uw rapport direct per email</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schoolnaam *
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="bijv. OBS De Regenboog"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type onderwijs *
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSchoolType('PO')}
                  className={'flex-1 px-4 py-2 rounded-lg font-medium transition ' +
                    (schoolType === 'PO'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                >
                  Primair Onderwijs
                </button>
                <button
                  onClick={() => setSchoolType('VO')}
                  className={'flex-1 px-4 py-2 rounded-lg font-medium transition ' +
                    (schoolType === 'VO'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                >
                  Voortgezet Onderwijs
                </button>
              </div>
            </div>
          </div>
        </div>

        {getTotaalScore() !== null && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Uw totaalscore</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Burgerschapsonderwijs</span>
                  <span className="font-bold text-2xl">{getTotaalScore()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={'h-6 rounded-full transition-all duration-500 ' + getKleur(getTotaalScore())}
                    style={{ width: getTotaalScore() + '%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {isNulmetingCompleet() ? (
                <p className="text-green-600 font-medium">✓ Alle vragen beantwoord! Scroll naar beneden om te verzenden.</p>
              ) : (
                <p>Beantwoord alle vragen om uw complete score te zien.</p>
              )}
            </div>
          </div>
        )}

        {domeinen.map((domein) => {
          const score = getScore(domein.id);
          return (
            <div key={domein.id} className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{domein.naam}</h2>
                {score !== null && (
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl">{score}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-4">
                      <div
                        className={'h-4 rounded-full transition-all duration-500 ' + getKleur(score)}
                        style={{ width: score + '%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-2">Wat houdt dit domein in?</p>
                <p className="text-sm text-blue-800">{domein.uitleg}</p>
              </div>

              {score !== null && (
                <div className={'mb-4 p-3 rounded-lg ' + (score >= 75 ? 'bg-green-50 text-green-800' : score >= 50 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800')}>
                  <p className="text-sm font-medium">{getAdvies(score)}</p>
                </div>
              )}

              <details className="mb-4 cursor-pointer">
                <summary className="text-sm font-semibold text-indigo-700 hover:text-indigo-900 py-2">
                  ℹ️ Klik hier voor scorekaders - Hoe bepaal ik mijn score?
                </summary>
                <div className="mt-3 space-y-2 bg-gray-50 p-4 rounded-lg text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-green-700 min-w-24">Goed:</span>
                    <p className="text-gray-700">{domein.scoreKaders.goed}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-yellow-700 min-w-24">Voldoende:</span>
                    <p className="text-gray-700">{domein.scoreKaders.voldoende}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-orange-700 min-w-24">Beperkt:</span>
                    <p className="text-gray-700">{domein.scoreKaders.beperkt}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-red-700 min-w-24">Niet:</span>
                    <p className="text-gray-700">{domein.scoreKaders.niet}</p>
                  </div>
                </div>
              </details>

              <div className="space-y-4">
                {domein.aspecten.map((aspect) => (
                  <div key={aspect.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 mb-3 font-medium">{aspect.tekst}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { waarde: 0, label: 'Niet', icon: X, kleur: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300' },
                        { waarde: 1, label: 'Beperkt', icon: Check, kleur: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300' },
                        { waarde: 2, label: 'Voldoende', icon: Check, kleur: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300' },
                        { waarde: 3, label: 'Goed', icon: Check, kleur: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300' }
                      ].map(({ waarde, label, icon: Icon, kleur }) => (
                        <button
                          key={waarde}
                          onClick={() => handleResponse(aspect.id, waarde)}
                          className={'px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 border-2 ' +
                            (responses[aspect.id] === waarde
                              ? kleur + ' border-current shadow-md'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300')}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isNulmetingCompleet() && !submitSuccess && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Verstuur uw rapport
            </h2>
            <p className="text-gray-600 mb-6">
              Vul uw contactgegevens in om het rapport per email te ontvangen. U krijgt direct een kopie en wij nemen binnen 2 werkdagen contact met u op.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contactpersoon *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="bijv. Anja de Vries"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="info@school.nl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoonnummer (optioneel)
                </label>
                <input
                  type="tel"
                  value={contactTelefoon}
                  onChange={(e) => setContactTelefoon(e.target.value)}
                  placeholder="06-12345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 mb-6 text-sm">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">
                Ik geef toestemming om deze nulmeting en contactgegevens te versturen naar Focus met Aandacht. 
                De gegevens worden uitsluitend gebruikt voor deze nulmeting en eventuele opvolging. *
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSubmitToGetform}
                disabled={isSubmitting}
                className={'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition w-full ' +
                  (isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700')}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Bezig met verzenden...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Verstuur rapport per email
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              U ontvangt het rapport per email. Wij nemen binnen 2 werkdagen contact met u op.
            </p>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 rounded-lg shadow-xl p-8 mb-6 border-2 border-green-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Rapport verzonden!</h2>
              <p className="text-green-800 mb-4">
                Bedankt voor het invullen van de nulmeting. Het rapport is verzonden naar <strong>{contactEmail}</strong>.
              </p>
              <p className="text-green-700 mb-6">
                <strong>Volgende stap:</strong> Wij nemen binnen 2 werkdagen contact met u op om de mogelijkheden 
                voor lessen op maat te bespreken en uw school optimaal te ondersteunen.
              </p>
              <p className="text-sm text-green-600">
                Heeft u het rapport niet ontvangen? Check uw spam folder of neem contact met ons op.
              </p>
            </div>
          </div>
        )}

        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Over deze nulmeting
          </h3>
          <div className="text-sm text-indigo-800 space-y-2">
            <p>
              Deze nulmeting is gebaseerd op de vier domeinen van burgerschap volgens de Inspectie van het Onderwijs: 
              democratisch burgerschap, maatschappelijke participatie, identiteitsontwikkeling en sociale cohesie.
            </p>
            <p>
              <strong>Na deze nulmeting:</strong> U ontvangt een volledig rapport met scores per domein, concrete actiepunten 
              en advies. Wij kunnen u vervolgens ondersteunen met gerichte lessen en inspectieproof documentatie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NulmetingBurgerschap;