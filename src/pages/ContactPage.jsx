import React, { useState } from 'react';

function ContactPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Chi siamo',
      answer: 'Siamo Evoka, la piattaforma che fa da “cupido” fra chi vuole organizzare un evento-bomba e chi vuole parteciparvi. Niente bacchetta magica, solo tecnologia (e un po’ di sana passione per le feste) per far incontrare privati e aziende in un attimo.',
    },
    {
      question: 'Cosa facciamo (in poche parole)',
      answer: (
        <ul className="list-disc list-inside space-y-2">
          <li>Mettiamo in vetrina il tuo evento – dal brunch improvvisato al convegno aziendale.</li>
          <li>Gestiamo prenotazioni e pagamenti – così tu pensi ai brindisi, noi ai bonifici.</li>
          <li>Ti paghiamo il 90 % di quanto incassato: trasparenza totale, fattura regolare, zero sbatti.</li>
        </ul>
      ),
    },
    {
      question: 'Come funziona per te che sei un privato',
      answer: (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-lg text-gray-600">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4">Paghi per partecipare?</th>
                  <th className="p-4">Commissione Evoka</th>
                  <th className="p-4">Limiti di pubblicazione</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Eventi gratuiti</td>
                  <td className="p-4">0 %</td>
                  <td className="p-4">Illimitati</td>
                </tr>
                <tr>
                  <td className="p-4">Eventi a pagamento</td>
                  <td className="p-4">10 % (irrevocabile)</td>
                  <td className="p-4">Illimitati</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Tradotto: se il tuo aperitivo-social costa zero, la piattaforma non trattiene nulla. Se invece chiedi un contributo, tratteniamo il 10 % per gestire la prenotazione e garantirti partecipanti seri.
          </p>
        </>
      ),
    },
    {
      question: 'Come funziona per la tua azienda',
      answer: (
        <ol className="list-decimal list-inside space-y-2">
          <li>Un mese di pubblicazione gratis – testaci senza rischi.</li>
          <li>Poi scegli il piano che ti sta più comodo:
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>3 mesi → 30 €</li>
              <li>6 mesi → 50 €</li>
              <li>12 mesi → 90 €</li>
            </ul>
          </li>
          <li>Su ogni prenotazione incassata tratteniamo sempre il 10 %. Il restante 90 % finisce al tuo conto, puntuale come un orologio svizzero.</li>
        </ol>
      ),
    },
    {
      question: 'Perché scegliere Evoka',
      answer: (
        <ul className="list-disc list-inside space-y-2">
          <li>Zero burocrazia: ci occupiamo noi di pagamenti, fatture e noie varie.</li>
          <li>Visibilità extra: la nostra community è in crescita costante – più occhi sul tuo evento.</li>
          <li>Assistenza umana: dubbi? Domande esistenziali? Scrivici a <a href="mailto:info@evoka.info" className="text-blue-600 hover:underline">info@evoka.info</a> e ti rispondiamo in carne, ossa e tastiera.</li>
        </ul>
      ),
    },
    {
      question: 'E adesso?',
      answer: 'Entra, crea il tuo evento e facciamo festa. L’iscrizione richiede meno tempo di un brindisi… e rende molto di più!',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

 return (
    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-12">
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-lg p-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Domande Frequenti
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-600">
              <button
                className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-600 dark:text-gray-300 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="py-4 text-lg text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-lg p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Contattaci
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 text-center">
          Hai un dubbio, un’idea fulminante o semplicemente vuoi farci un saluto?
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Siamo sempre a portata di clic o di squillo.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-gray-700 dark:text-gray-200 font-medium">Email:</span>
            <a
              href="mailto:info@evoka.info"
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              info@evoka.info
            </a>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-700 dark:text-gray-200 font-medium">Cellulare / WhatsApp:</span>
            <a
              href="tel:+393356150480"
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              +39 335 61 50 480
            </a>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-8 text-center italic">
          Scrivici quando vuoi: rispondiamo più in fretta di quanto ci metti a dire “evento”!
        </p>
      </section>
    </div>
);
}

export default ContactPage;