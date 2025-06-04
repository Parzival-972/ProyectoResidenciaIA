"use client";

import Link from "next/link";
import { ArrowRight, Brain, Activity, Shield, Clock } from "lucide-react";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const Content: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      appName: "NeuroDetect",
      hero: {
        title: "Early Detection for Alzheimer's and Parkinson's",
        description:
          "Empowering you with advanced AI technology to detect early signs of Alzheimer's and Parkinson's diseases.",
        cta: "Get Started",
        learnMore: "Learn More",
      },
      features: {
        title: "Key Features",
        ai: {
          title: "AI-Powered Analysis",
          description:
            "Advanced algorithms analyze cognitive and motor function tests.",
        },
        testing: {
          title: "Comprehensive Testing",
          description:
            "A range of tests to assess various aspects of neurological health.",
        },
        security: {
          title: "Secure and Private",
          description:
            "Your health data is encrypted and protected at all times.",
        },
      },
      whyEarly: {
        title: "Why Early Detection Matters",
        description:
          "Early detection of Alzheimer's and Parkinson's can significantly improve treatment outcomes and quality of life. Our app provides a convenient way to monitor your neurological health from the comfort of your home.",
        timeCrucial: {
          title: "Time is Crucial",
          description:
            "The earlier these conditions are detected, the more effective treatments can be. Regular check-ups with our app can help catch potential issues before they become severe.",
        },
        cta: "Learn More About Early Detection",
      },
      footer: {
        copyright: "© 2024 NeuroDetect. All rights reserved.",
        terms: "Terms of Service",
        privacy: "Privacy",
      },
    },
    es: {
      appName: "NeuroDetect",
      hero: {
        title: "Detección Temprana de Alzheimer y Parkinson",
        description:
          "Empoderándote con tecnología de IA avanzada para detectar signos tempranos de Alzheimer y Parkinson.",
        cta: "Comenzar",
        learnMore: "Más Información",
      },
      features: {
        title: "Características Principales",
        ai: {
          title: "Análisis Impulsado por IA",
          description:
            "Algoritmos avanzados analizan pruebas de función cognitiva y motora.",
        },
        testing: {
          title: "Pruebas Exhaustivas",
          description:
            "Una gama de pruebas para evaluar varios aspectos de la salud neurológica.",
        },
        security: {
          title: "Seguro y Privado",
          description:
            "Tus datos de salud están encriptados y protegidos en todo momento.",
        },
      },
      whyEarly: {
        title: "Por Qué Importa la Detección Temprana",
        description:
          "La detección temprana de Alzheimer y Parkinson puede mejorar significativamente los resultados del tratamiento y la calidad de vida. Nuestra aplicación proporciona una forma conveniente de monitorear tu salud neurológica desde la comodidad de tu hogar.",
        timeCrucial: {
          title: "El Tiempo es Crucial",
          description:
            "Cuanto antes se detecten estas condiciones, más efectivos pueden ser los tratamientos. Los chequeos regulares con nuestra aplicación pueden ayudar a detectar problemas potenciales antes de que se vuelvan graves.",
        },
        cta: "Más Información Sobre la Detección Temprana",
      },
      footer: {
        copyright: "© 2024 NeuroDetect. Todos los derechos reservados.",
        terms: "Términos de Servicio",
        privacy: "Privacidad",
      },
    },
  };

  const t = content[language];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link className="flex items-center space-x-2" href="/">
              <Brain className="h-6 w-6" />
              <span className="font-bold">{t.appName}</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main
          key={language}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          className="flex-1"
        >
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    {t.hero.title}
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    {t.hero.description}
                  </p>
                </div>
                <div className="space-x-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    {t.hero.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/learn-more"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  >
                    {t.hero.learnMore}
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                {t.features.title}
              </h2>
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Brain className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">
                    {t.features.ai.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t.features.ai.description}
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Activity className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">
                    {t.features.testing.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t.features.testing.description}
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Shield className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">
                    {t.features.security.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t.features.security.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    {t.whyEarly.title}
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    {t.whyEarly.description}
                  </p>
                </div>
                <div className="flex flex-col items-start space-y-4">
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold">
                    {t.whyEarly.timeCrucial.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t.whyEarly.timeCrucial.description}
                  </p>
                  <Link
                    href="/learn-more"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    {t.whyEarly.cta}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </motion.main>
      </AnimatePresence>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t.footer.copyright}
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t.footer.terms}
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t.footer.privacy}
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default function LandingPage() {
  return (
    <LanguageProvider>
      <Content />
    </LanguageProvider>
  );
}
