"use client";

import Link from "next/link";
import { Leaf, Droplets, BookOpen, MessageSquare, TrendingUp, ArrowRight, BarChart3, Globe, ShieldCheck, Scale, Sparkles, CheckCircle2, Zap, ChevronDown, ChevronUp, UserCheck, MousePointer2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import React, { useRef, useState } from "react";
import CarbonMolecules from "@/components/CarbonMolecules";
import DataFlowCircuit from "@/components/DataFlowCircuit";

// Helper component for Service Cards with 3D tilt and spotlight
const ServiceCard = ({
  title,
  desc,
  icon: Icon,
  href,
  colorClass,
  bgClass,
  borderColor,
  t,
  delay = 0,
  iconAnimation = {}
}: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) / rect.width);
    y.set((event.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`group relative h-full flex flex-col rounded-xl p-2.5 border ${bgClass} ${borderColor} transition-all duration-500 hover:shadow-2xl overflow-hidden`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([xVal, yVal]: any) => `radial-gradient(circle at ${(xVal + 0.5) * 100}% ${(yVal + 0.5) * 100}%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)`
          )
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-1.5">
          <motion.div
            animate={iconAnimation}
            className={`${colorClass.replace('text-', 'bg-')} text-white rounded-md p-1.5 shadow-md w-fit flex-shrink-0`}
          >
            <Icon size={16} />
          </motion.div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h3>
        </div>

        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal mb-2 flex-1">{desc}</p>

        <Link
          href={href}
          className="group inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-[9px] shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-emerald-500 transition-all active:scale-95 w-fit"
        >
          {t.home.explore || "Modülü İncele"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const { t } = useLanguage();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-brand-green/20">

      {/* 1. HERO SECTION & MOCK DASHBOARD */}
      <section id="hero" className="relative overflow-hidden min-h-[calc(100vh-3rem)] flex flex-col pt-4 lg:pt-6 pb-16">
        {/* Abstract Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[130px] opacity-50 mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Animated Backgrounds */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60 dark:opacity-80">
          <CarbonMolecules />
          <DataFlowCircuit />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">

            {/* Left Column: Text & CTA */}
            <motion.div
              initial="initial" animate="animate" variants={staggerContainer}
              className="lg:col-span-6 text-center lg:text-left z-10"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-3 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles size={14} />
                {t.home.heroBadge}
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl mb-2 leading-[1.1]">
                {t.home.heroTitle} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                  {t.home.heroTitleAccent}
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-1 text-sm sm:text-base leading-6 sm:leading-7 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                {t.home.heroDesc}
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/request-access"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  {t.home.demoRequest} <ArrowRight size={16} />
                </Link>
                <Link
                  href="#services"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all bg-slate-100 dark:bg-slate-800/80 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center gap-2"
                >
                  {t.home.services || "Hizmetlerimiz"}
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center gap-2"
                >
                  {t.home.loginButton}
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Floating Mockups */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="lg:col-span-6 mt-4 lg:mt-0 relative hidden lg:block scale-[0.55] xl:scale-[0.75] origin-center"
            >
              <div className="relative w-full aspect-[4/3] flex items-center justify-center">

                {/* Mock Card 1: Emisyon ve Su Ayak İzi */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[5%] left-[-5%] right-[5%] z-20 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl border border-white dark:border-slate-700/50"
                  style={{ width: '110%' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-6 items-center">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1"><Leaf size={14} className="text-emerald-500" /> Karbon Ayak İzi</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">1,428 <span className="text-sm font-medium text-slate-400">tCO2e</span></p>
                      </div>
                      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1"><Droplets size={14} className="text-blue-500" /> Su Ayak İzi</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">3,850 <span className="text-sm font-medium text-slate-400">m³</span></p>
                      </div>
                    </div>
                  </div>
                  {/* AI Prediction Line Chart */}
                  <div className="relative h-20 w-full mt-4 flex items-end">
                    <div className="absolute inset-0 flex items-end justify-between">
                      {[30, 45, 40, 60, 55, 75, 65, 90].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                          className="w-full mx-0.5 bg-gradient-to-t from-emerald-500/20 to-emerald-500/80 rounded-t-sm"
                        />
                      ))}
                    </div>
                    <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                      <TrendingUp size={12} /> YZ Tahmini: -18%
                    </div>
                  </div>
                </motion.div>

                {/* Mock Card 2: AI Verimlilik Analizi */}
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-[10%] right-[-10%] w-[65%] z-30 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Zap size={14} className="text-yellow-500" />
                    Yapay Zeka Tasarruf Analizi
                  </p>
                  <div className="space-y-4">
                    {/* Karbon Tasarrufu */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Karbon (CO2) Azaltımı</span>
                        <span className="text-xs font-bold text-emerald-500">%24</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "24%" }} transition={{ duration: 2, delay: 1 }} className="h-full bg-emerald-500 rounded-full relative">
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                    {/* Su Tasarrufu */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Su Verimliliği Artışı</span>
                        <span className="text-xs font-bold text-blue-500">%32</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "32%" }} transition={{ duration: 2, delay: 1.2 }} className="h-full bg-blue-500 rounded-full relative">
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mock Card 3: Global Hibe & Teşvik */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-[-5%] left-[-15%] w-[55%] z-25 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border border-slate-100 dark:border-slate-800"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Globe size={14} className="text-blue-500" />
                    Hibe & Teşvik Fırsatları
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Açık Programlar</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">1,248</p>
                      </div>
                      <Sparkles size={16} className="text-emerald-500 mb-1" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Toplam Fon Kaynağı</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">4.2B <span className="text-sm font-medium text-slate-400">€</span></p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Background Decoration */}
                <div className="absolute inset-x-10 bottom-10 top-20 bg-gradient-to-tr from-emerald-100 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-full blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-40 hidden lg:flex flex-col items-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">{t.home.aboutSubtitle}</p>
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ChevronDown size={24} />
          </motion.a>
        </div>
      </section>

      {/* 2. ABOUT/STATS SECTION */}
      <section id="about" className="relative pt-1 pb-2 min-h-[100vh] flex flex-col justify-start bg-background overflow-hidden border-y border-slate-200 dark:border-slate-800">
        {/* Decorative Background Elements for About Section */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-50" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-40" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl lg:text-center mb-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base font-semibold leading-7 text-emerald-600 tracking-wide uppercase"
            >
              {t.home.aboutSubtitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
            >
              {t.home.aboutTitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-lg leading-8 text-slate-600 dark:text-slate-400"
            >
              {t.home.aboutDesc}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            {[
              { id: 1, title: t.home.stat1Title, desc: t.home.stat1Desc, icon: ShieldCheck, color: "emerald" },
              { id: 2, title: t.home.stat2Title, desc: t.home.stat2Desc, icon: Zap, color: "blue" },
              { id: 3, title: t.home.stat3Title, desc: t.home.stat3Desc, icon: Sparkles, color: "cyan" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group relative scale-[0.85] origin-center"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative h-full flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-3xl bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                  <div className={`rounded-xl bg-${stat.color}-500/10 p-3 mb-4 ring-1 ring-${stat.color}-500/20 group-hover:scale-105 group-hover:bg-${stat.color}-500/20 transition-all duration-300`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <dt className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                    {stat.title}
                  </dt>
                  <dd className="text-xs leading-6 text-slate-600 dark:text-slate-400">
                    {stat.desc}
                  </dd>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 hidden lg:flex gap-6 items-center">
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-colors shadow-lg"
          >
            <ChevronUp size={24} />
          </motion.a>
          <motion.a
            href="#services"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-colors shadow-lg"
          >
            <ChevronDown size={24} />
          </motion.a>
        </div>
      </section>

      {/* 3. BENTO GRID MODULES */}
      <section id="services" className="relative pt-20 pb-24 bg-background overflow-hidden border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl lg:text-center mb-2">
            <h2 className="text-xs font-semibold leading-5 text-emerald-600 tracking-wide uppercase">{t.home.modulesTitle}</h2>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.home.modulesSubtitle}
            </p>
          </div>

          {/* Balanced Grid: 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr mt-2">

            <ServiceCard
              title={`${t.home.karbon} Yönetimi`}
              desc={t.home.carbonDesc}
              icon={Leaf}
              href="/carbon"
              colorClass="text-emerald-500"
              bgClass="bg-white dark:bg-slate-900"
              borderColor="border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
              t={t}
              iconAnimation={{ scale: [1, 1.1, 1], transition: { duration: 4, repeat: Infinity } }}
            />

            <ServiceCard
              title={t.home.su}
              desc={t.home.waterDesc}
              icon={Droplets}
              href="/water"
              colorClass="text-blue-500"
              bgClass="bg-blue-50/30 dark:bg-blue-900/10"
              borderColor="border-blue-100 dark:border-blue-900/30 hover:border-blue-500/50"
              t={t}
              delay={0.1}
              iconAnimation={{ y: [0, -5, 0], transition: { duration: 3, repeat: Infinity } }}
            />

            <ServiceCard
              title={t.home.financeAnalysis}
              desc={t.home.robotDesc}
              icon={TrendingUp}
              href="/robot"
              colorClass="text-rose-500"
              bgClass="bg-rose-50/30 dark:bg-rose-900/10"
              borderColor="border-rose-100 dark:border-rose-900/30 hover:border-rose-500/50"
              t={t}
              delay={0.2}
              iconAnimation={{ x: [0, 5, 0], transition: { duration: 2, repeat: Infinity, ease: "linear" } }}
            />

            <ServiceCard
              title={t.home.egitim}
              desc={t.home.learnDesc}
              icon={BookOpen}
              href="/learn"
              colorClass="text-amber-500"
              bgClass="bg-amber-50/30 dark:bg-amber-900/10"
              borderColor="border-amber-100 dark:border-amber-900/30 hover:border-amber-500/50"
              t={t}
              delay={0.3}
              iconAnimation={{ rotateZ: [0, 5, 0], transition: { duration: 4, repeat: Infinity } }}
            />

            <ServiceCard
              title={t.home.mevzuat}
              desc={t.home.legislationDesc}
              icon={Scale}
              href="/legislation"
              colorClass="text-purple-500"
              bgClass="bg-purple-50/30 dark:bg-purple-900/10"
              borderColor="border-purple-100 dark:border-purple-900/30 hover:border-purple-500/50"
              t={t}
              delay={0.4}
              iconAnimation={{ rotate: [0, -10, 10, 0], transition: { duration: 5, repeat: Infinity } }}
            />

            <ServiceCard
              title={t.home.danismanlik}
              desc={t.home.danismanlikDesc}
              icon={UserCheck}
              href="/consultancy"
              colorClass="text-emerald-500"
              bgClass="bg-emerald-50/30 dark:bg-emerald-900/10"
              borderColor="border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-500/50"
              t={t}
              delay={0.5}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 hidden lg:flex gap-4 items-center">
          <motion.a href="#about" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-colors shadow-lg">
            <ChevronUp size={24} />
          </motion.a>
          <motion.a href="#features" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-colors shadow-lg">
            <ChevronDown size={24} />
          </motion.a>
        </div>
      </section>

      {/* 4. WHY US / FEATURES */}
      <section id="features" className="relative py-24 bg-white dark:bg-background border-t border-slate-200 dark:border-slate-800 min-h-[100vh] flex flex-col justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-base font-semibold leading-7 text-emerald-600 tracking-wide uppercase">{t.home.whyUsTitle}</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6">
                {t.home.whyUsSubtitle}
              </p>

              <ul className="space-y-8 mt-10">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.home.why1Title}</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{t.home.why1Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.home.why2Title}</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{t.home.why2Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.home.why3Title}</h4>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{t.home.why3Desc}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Visual placeholder for Why Us */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 aspect-square sm:aspect-[4/3] border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ShieldCheck className="w-32 h-32 text-slate-300 dark:text-slate-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 dark:from-slate-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FOOTER */}
      <section id="cta" className="relative isolate py-24 px-6 sm:py-32 lg:px-8 border-t border-slate-200 dark:border-slate-800 min-h-[100vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.900/20),theme(colors.background))] opacity-50" />

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t.home.ctaDesc}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-access"
              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all hover:scale-105 text-center"
            >
              {t.home.demoRequest}
            </Link>
            <Link
              href="#services"
              className="w-full sm:w-auto rounded-xl bg-white dark:bg-slate-800 px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 text-center cursor-pointer"
            >
              {t.home.services || "Hizmetlerimiz"}
            </Link>
          </div>
        </div>

        {/* Scroll Arrows: Back to Top */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 hidden lg:flex gap-4 items-center">
          <motion.a href="#features" className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 text-slate-500 hover:text-emerald-500 transition-colors">
            <ChevronUp size={24} />
          </motion.a>
          <motion.a href="#hero" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 text-slate-500 hover:text-emerald-500 transition-colors" title="Başa Dön">
            <ChevronUp size={24} className="text-emerald-600" />
          </motion.a>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background">
        {t.home.footer}
      </footer>
    </div>
  );
}
