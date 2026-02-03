import React, { useState } from 'react';
import { Check, X, FileText, Download, Mail, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const NulmetingBurgerschap = () => {
  const [schoolType, setSchoolType] = useState('PO');
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTelefoon, setContactTelefoon] = useState('');
  const [consent, setConsent] = useState(false);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Check URL parameters for special modes
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoMode = urlParams.get('demo') === 'true';
  const isLeadMode = urlParams.get('lead') === 'true';

  const domeinen = [
    {
      id: 'democratie',
      naam: 'Democratisch burgerschap',
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
      aspecten: [
        { id: 'i1', tekst: 'Aandacht voor zelfbeeld en eigenwaarde' },
        { id: 'i2', tekst: 'Reflectie op eigen normen, waarden en overtuigingen' },
        { id: 'i3', tekst: 'Respect voor diverse achtergronden en levensovertuigingen' },
        { id: 'i4', tekst: 'Aandacht voor omgaan met verschillen en conflicten' }
      ]
    },
    {
      id: 'cohesie',
      naam: 'Sociale cohesie',
      aspecten: [
        { id: 'c1', tekst: 'Aandacht voor sociale vaardigheden en samenwerken' },
        { id: 'c2', tekst: 'Leerlingen leren elkaar respectvol bejegenen' },
        { id: 'c3', tekst: 'Klimaat waarin verschillen worden gewaardeerd' },
        { id: 'c4', tekst: 'Preventie van pesten en discriminatie' }
      ]
    },
    {
      id: 'organisatie',
      naam: 'Organisatie & Verantwoording',
      aspecten: [
        { id: 'o1', tekst: 'Burgerschap is verankerd in schoolbeleid/leerplan' },
        { id: 'o2', tekst: 'Docenten hebben nascholing gehad over burgerschapsonderwijs' },
        { id: 'o3', tekst: 'Er is evaluatie van burgerschapsonderwijs' },
        { id: 'o4', tekst: 'De school kan inspectie verantwoorden wat ze doet aan burgerschap' }
      ]
    }
  ];

  const handleResponse = (aspectId, value) => {
    setResponses(prev => ({
      ...prev,
      [aspectId]: value
    }));
  };

  const getScore = (domeinId) => {
    const domein = domeinen.find(d => d.id === domeinId);
    if (!domein) return 0;
    
    const totaal = domein.aspecten.length;
    const jaAntwoorden = domein.aspecten.filter(a => responses[a.id] === 'ja').length;
    const gedeeltelijkAntwoorden = domein.aspecten.filter(a => responses[a.id] === 'gedeeltelijk').length;
    
    return Math.round(((jaAntwoorden + (gedeeltelijkAntwoorden * 0.5)) / totaal) * 100);
  };

  const getTotaalScore = () => {
    const scores = domeinen.map(d => getScore(d.id));
    return Math.round(scores.reduce((a, b) => a + b, 0) / domeinen.length);
  };

  const getAdvies = (score) => {
    if (score >= 80) return { niveau: 'Uitstekend', kleur: '#22c55e', advies: 'Uw school doet het uitstekend op dit gebied. Blijf dit niveau vasthouden en deel uw goede praktijken met anderen.' };
    if (score >= 60) return { niveau: 'Goed', kleur: '#84cc16', advies: 'Uw school doet het goed. Er zijn enkele verbetermogelijkheden die u verder kunnen helpen.' };
    if (score >= 40) return { niveau: 'Voldoende', kleur: '#eab308', advies: 'Er is een basis aanwezig, maar er zijn duidelijke verbeterpunten. Overweeg gerichte acties op dit gebied.' };
    return { niveau: 'Aandachtspunt', kleur: '#ef4444', advies: 'Dit vraagt prioriteit. Laten we samen kijken hoe we dit kunnen verbeteren met concrete lessen en begeleiding.' };
  };

  const isNulmetingCompleet = () => {
    const totaalAspecten = domeinen.reduce((sum, d) => sum + d.aspecten.length, 0);
    return Object.keys(responses).length === totaalAspecten;
  };

  const generateRapport = () => {
    let rapport = `NULMETING BURGERSCHAPSONDERWIJS\n`;
    rapport += `=====================================\n\n`;
    rapport += `School: ${schoolName}\n`;
    rapport += `Type: ${schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs'}\n`;
    rapport += `Datum: ${new Date().toLocaleDateString('nl-NL')}\n\n`;
    rapport += `TOTAALSCORE: ${getTotaalScore()}%\n\n`;
    
    domeinen.forEach(domein => {
      const score = getScore(domein.id);
      const advies = getAdvies(score);
      rapport += `\n${domein.naam.toUpperCase()}\n`;
      rapport += `Score: ${score}% - ${advies.niveau}\n`;
      rapport += `${advies.advies}\n`;
      rapport += `\nDetails:\n`;
      domein.aspecten.forEach(aspect => {
        const antwoord = responses[aspect.id] || 'niet beantwoord';
        rapport += `- ${aspect.tekst}: ${antwoord}\n`;
      });
    });

    rapport += `\n\n=====================================\n`;
    rapport += `AANBEVOLEN VERVOLGSTAPPEN\n`;
    rapport += `=====================================\n\n`;
    
    const laagsteScores = domeinen
      .map(d => ({ naam: d.naam, score: getScore(d.id) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    rapport += `Focus prioriteit op:\n`;
    laagsteScores.forEach((item, index) => {
      rapport += `${index + 1}. ${item.naam} (${item.score}%)\n`;
    });

    rapport += `\n\nContact: info@focusmetaandacht.nl\n`;
    rapport += `Voor gepersonaliseerd advies en lespakketten\n`;
    
    return rapport;
  };

  const generateHTMLRapport = () => {
    let html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Nulmeting Burgerschapsonderwijs</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Focus met Aandacht</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0;">Schoolgegevens</h2>
          <p style="margin: 5px 0;"><strong>School:</strong> ${schoolName}</p>
          <p style="margin: 5px 0;"><strong>Type:</strong> ${schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs'}</p>
          <p style="margin: 5px 0;"><strong>Datum:</strong> ${new Date().toLocaleDateString('nl-NL')}</p>
        </div>

        <div style="text-align: center; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; font-size: 18px;">Totaalscore</h2>
          <div style="font-size: 48px; font-weight: bold;">${getTotaalScore()}%</div>
        </div>

        <h2 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">Scores per domein</h2>
    `;

    domeinen.forEach(domein => {
      const score = getScore(domein.id);
      const advies = getAdvies(score);
      
      html += `
        <div style="margin-bottom: 30px; border-left: 4px solid ${advies.kleur}; padding-left: 20px;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">${domein.naam}</h3>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-weight: bold; color: ${advies.kleur};">${advies.niveau}</span>
              <span style="font-size: 24px; font-weight: bold; color: ${advies.kleur};">${score}%</span>
            </div>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">${advies.advies}</p>
          </div>
        </div>
      `;
    });

    const laagsteScores = domeinen
      .map(d => ({ naam: d.naam, score: getScore(d.id) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    html += `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">Aanbevolen focus gebieden</h3>
          <ol style="margin: 0; padding-left: 20px; color: #78350f;">
            ${laagsteScores.map(item => `<li style="margin-bottom: 8px;">${item.naam} (${item.score}%)</li>`).join('')}
          </ol>
        </div>

        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Volgende stappen</h3>
          <p style="margin: 0 0 15px 0;">Wilt u uw burgerschapsonderwijs verder versterken?</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Contact: <a href="mailto:info@focusmetaandacht.nl" style="color: white; text-decoration: underline;">info@focusmetaandacht.nl</a>
          </p>
        </div>
      </div>
    </div>
    `;

    return html;
  };

  const handleDownloadRapport = () => {
    const rapport = generateRapport();
    const blob = new Blob([rapport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nulmeting-burgerschap-${schoolName.replace(/\s+/g, '-')}-${new Date().toLocaleDateString('nl-NL')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

    // Demo mode - alleen download, geen verzending
    if (isDemoMode) {
      console.log('DEMO MODE - Geen verzending');
      handleDownloadRapport();
      setSubmitSuccess(true);
      setIsSubmitting(false);
      return;
    }

    const domeinscores = {};
    domeinen.forEach(d => {
      domeinscores[d.naam] = getScore(d.id) + '%';
    });

    // EmailJS configuratie
    const EMAILJS_SERVICE_ID = 'service_nebjm8o';
    const EMAILJS_TEMPLATE_ID = 'template_379kfon';
    const EMAILJS_PUBLIC_KEY = 'kgnlp3ATcUWA_btSC';

    // Getform endpoint
    const GETFORM_ENDPOINT = 'https://getform.io/f/bejjjxxa';

    try {
      // 1. Getform submission (altijd)
      const getformPayload = {
        schoolnaam: schoolName,
        schooltype: schoolType === 'PO' ? 'Primair Onderwijs' : 'Voortgezet Onderwijs',
        contactpersoon: contactName,
        email: contactEmail,
        telefoon: contactTelefoon || 'Niet opgegeven',
        totaalscore: getTotaalScore() + '%',
        ...domeinscores,
        datum: new Date().toLocaleString('nl-NL'),
        lead_mode: isLeadMode ? 'JA - School krijgt geen email' : 'NEE - School krijgt email'
      };

      const getformResponse = await fetch(GETFORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getformPayload)
      });

      if (!getformResponse.ok) {
        throw new Error('Getform submission failed');
      }

      console.log('Getform submission successful');

      // 2. Email naar school (alleen als NIET in lead mode)
      if (!isLeadMode) {
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
          datum: new Date().toLocaleString('nl-NL')
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );

        console.log('Email sent to school');
      } else {
        console.log('Lead mode - No email sent to school');
      }

      setSubmitSuccess(true);
      handleDownloadRapport();

    } catch (error) {
      console.error('Submission error:', error);
      alert('Er is een fout opgetreden bij het verzenden. Probeer het opnieuw of neem contact met ons op.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    },
    card: {
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '40px 30px',
      textAlign: 'center'
    },
    content: {
      padding: '30px'
    },
    domeinCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    },
    aspectItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    buttonJa: {
      backgroundColor: '#22c55e',
      color: 'white'
    },
    buttonGedeeltelijk: {
      backgroundColor: '#eab308',
      color: 'white'
    },
    buttonNee: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    scoreCard: {
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      fontSize: '16px',
      marginBottom: '15px'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }
  };

  if (submitSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1>✅ Bedankt voor uw inzending!</h1>
          </div>
          <div style={styles.content}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Check size={64} color="#22c55e" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ color: '#1f2937', marginBottom: '15px' }}>Uw nulmeting is succesvol ontvangen</h2>
              {isLeadMode ? (
                <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>
                  Het rapport is gedownload naar uw computer. <br/>
                  Wij nemen binnen 2 werkdagen contact met u op om de resultaten te bespreken.
                </p>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>
                  U heeft een email ontvangen met uw persoonlijke rapport. <br/>
                  Check ook uw spam folder als u deze niet direct ziet.
                </p>
              )}
              <div style={{ marginTop: '30px' }}>
                <button 
                  onClick={handleDownloadRapport}
                  style={{
                    ...styles.submitButton,
                    width: 'auto',
                    margin: '10px auto',
                    backgroundColor: '#059669'
                  }}
                >
                  <Download size={20} />
                  Download rapport opnieuw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Nulmeting Burgerschapsonderwijs</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '18px' }}>Focus met Aandacht</p>
          {isDemoMode && (
            <div style={{ marginTop: '15px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '6px' }}>
              <AlertCircle size={20} style={{ display: 'inline-block', marginRight: '8px' }} />
              DEMO MODE - Geen verzending
            </div>
          )}
          {isLeadMode && (
            <div style={{ marginTop: '15px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '6px' }}>
              <Mail size={20} style={{ display: 'inline-block', marginRight: '8px' }} />
              LEAD MODE - U krijgt geen automatische email
            </div>
          )}
        </div>

        <div style={styles.content}>
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>Welkom bij de nulmeting</h3>
            <p style={{ margin: '0 0 10px 0', lineHeight: '1.6' }}>
              Deze nulmeting helpt u inzichtelijk maken waar uw school staat op het gebied van burgerschapsonderwijs. 
              Beantwoord de vragen zo eerlijk mogelijk. U ontvangt direct een rapport met concrete adviezen.
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
              ⏱️ Tijdsinvestering: ongeveer 5-10 minuten
            </p>
          </div>

          {/* School Type Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#1f2937' }}>
              Type onderwijs *
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setSchoolType('PO')}
                style={{
                  ...styles.button,
                  flex: 1,
                  padding: '15px',
                  backgroundColor: schoolType === 'PO' ? '#3b82f6' : '#f3f4f6',
                  color: schoolType === 'PO' ? 'white' : '#1f2937'
                }}
              >
                Primair Onderwijs (PO)
              </button>
              <button
                onClick={() => setSchoolType('VO')}
                style={{
                  ...styles.button,
                  flex: 1,
                  padding: '15px',
                  backgroundColor: schoolType === 'VO' ? '#3b82f6' : '#f3f4f6',
                  color: schoolType === 'VO' ? 'white' : '#1f2937'
                }}
              >
                Voortgezet Onderwijs (VO)
              </button>
            </div>
          </div>

          {/* Domeinen */}
          {domeinen.map((domein, index) => (
            <div key={domein.id} style={styles.domeinCard}>
              <h2 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '22px' }}>
                {index + 1}. {domein.naam}
              </h2>
              
              {domein.aspecten.map(aspect => {
                const selected = responses[aspect.id];
                return (
                  <div key={aspect.id} style={styles.aspectItem}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                      <p style={{ margin: 0, color: '#1f2937' }}>{aspect.tekst}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleResponse(aspect.id, 'ja')}
                        style={{
                          ...styles.button,
                          ...styles.buttonJa,
                          opacity: selected === 'ja' ? 1 : 0.5,
                          transform: selected === 'ja' ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <Check size={16} />
                        Ja
                      </button>
                      <button
                        onClick={() => handleResponse(aspect.id, 'gedeeltelijk')}
                        style={{
                          ...styles.button,
                          ...styles.buttonGedeeltelijk,
                          opacity: selected === 'gedeeltelijk' ? 1 : 0.5,
                          transform: selected === 'gedeeltelijk' ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        Gedeeltelijk
                      </button>
                      <button
                        onClick={() => handleResponse(aspect.id, 'nee')}
                        style={{
                          ...styles.button,
                          ...styles.buttonNee,
                          opacity: selected === 'nee' ? 1 : 0.5,
                          transform: selected === 'nee' ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <X size={16} />
                        Nee
                      </button>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Score {domein.naam}:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: getAdvies(getScore(domein.id)).kleur }}>
                    {getScore(domein.id)}%
                  </span>
                </div>
                {domein.aspecten.every(a => responses[a.id]) && (
                  <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    {getAdvies(getScore(domein.id)).advies}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Totaalscore */}
          {isNulmetingCompleet() && (
            <div style={styles.scoreCard}>
              <h2 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>Totaalscore</h2>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getAdvies(getTotaalScore()).kleur }}>
                {getTotaalScore()}%
              </div>
              <p style={{ margin: '10px 0 0 0', color: '#6b7280' }}>
                {getAdvies(getTotaalScore()).advies}
              </p>
            </div>
          )}

          {/* Contact Form */}
          {isNulmetingCompleet() && (
            <div style={{ marginTop: '30px', padding: '30px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
                <FileText size={24} style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
                Ontvang uw rapport
              </h2>

              <input
                type="text"
                placeholder="Naam school *"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={styles.input}
                required
              />

              <input
                type="text"
                placeholder="Naam contactpersoon *"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                style={styles.input}
                required
              />

              <input
                type="email"
                placeholder="E-mailadres *"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={styles.input}
                required
              />

              <input
                type="tel"
                placeholder="Telefoonnummer (optioneel)"
                value={contactTelefoon}
                onChange={(e) => setContactTelefoon(e.target.value)}
                style={styles.input}
              />

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: '4px', marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                    Ik ga akkoord met het ontvangen van het rapport en eventuele opvolging door Focus met Aandacht. *
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmitToGetform}
                disabled={isSubmitting || !consent || !schoolName || !contactEmail}
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting || !consent || !schoolName || !contactEmail ? 0.5 : 1,
                  cursor: isSubmitting || !consent || !schoolName || !contactEmail ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>Bezig met verzenden...</>
                ) : (
                  <>
                    <Mail size={20} />
                    {isLeadMode ? 'Verstuur en download rapport' : 'Verstuur rapport per e-mail'}
                  </>
                )}
              </button>

              <p style={{ marginTop: '15px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                {isLeadMode 
                  ? 'Het rapport wordt gedownload. Wij nemen contact met u op.'
                  : 'U ontvangt het rapport direct per e-mail na verzending.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        <p>© {new Date().getFullYear()} Focus met Aandacht | info@focusmetaandacht.nl</p>
      </div>
    </div>
  );
};

export default NulmetingBurgerschap;
