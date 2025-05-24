import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { TrendingUp, Users, Truck, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const demoKpiData = [
  { title: "Chiffre d'affaires (Mois)", value: "12,345 €", icon: <TrendingUp className="h-6 w-6 text-primary" />, trend: "+5.2%" },
  { title: "Nouveaux Clients", value: "23", icon: <Users className="h-6 w-6 text-green-500" />, trend: "+10" },
  { title: "Prestations Planifiées (Semaine)", value: "15", icon: <Truck className="h-6 w-6 text-blue-500" />, trend: "stable" },
  { title: "Taux d'occupation véhicules", value: "78%", icon: <Truck className="h-6 w-6 text-teal-500" />, trend: "+2%" },
];

const realKpiData = [
  { title: "Chiffre d'affaires (Mois)", value: "15,820 €", icon: <TrendingUp className="h-6 w-6 text-primary" />, trend: "+7.8%" },
  { title: "Nouveaux Clients", value: "31", icon: <Users className="h-6 w-6 text-green-500" />, trend: "+15" },
  { title: "Prestations Planifiées (Semaine)", value: "18", icon: <Truck className="h-6 w-6 text-blue-500" />, trend: "stable" },
  { title: "Taux d'occupation véhicules", value: "82%", icon: <Truck className="h-6 w-6 text-teal-500" />, trend: "+3%" },
];

const DashboardPage = () => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [dailyPlan, setDailyPlan] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  const kpiData = isDemoMode ? demoKpiData : realKpiData;

  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('services') || '[]');
    const todayServices = storedServices
      .filter(service => isToday(parseISO(service.date)))
      .sort((a, b) => parseISO(a.date) - parseISO(b.date));
    setDailyPlan(todayServices);

    const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const vehicleAlerts = storedVehicles
      .filter(vehicle => vehicle.prochaineMaintenance && isToday(parseISO(vehicle.prochaineMaintenance)))
      .map(vehicle => ({ id: `veh-${vehicle.id}`, type: 'warning', message: `Maintenance pour ${vehicle.immatriculation} (${vehicle.type}) due aujourd'hui.` }));

    const invoiceAlerts = [ 
      { id: 'inv-003', type: 'error', message: 'Facture #INV003 en retard de paiement.' },
    ];
    
    if (isDemoMode) {
      setAlerts([
        { id: 'demo-warn-1', type: 'warning', message: "Véhicule DEMO-01 - Maintenance prévue demain (Mode Démo)." },
        { id: 'demo-err-1', type: 'error', message: "Facture #DEMO999 en retard (Mode Démo)." },
        { id: 'demo-ok-1', type: 'success', message: "Aucune nouvelle alerte critique (Mode Démo)." },
      ]);
    } else {
      setAlerts([...vehicleAlerts, ...invoiceAlerts]);
    }

  }, [isDemoMode]);

  const getAlertIcon = (type) => {
    if (type === 'error') return <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-yellow-500" />;
    if (type === 'success') return <CheckCircle2 className="h-5 w-5 mr-3 mt-1 text-green-500" />;
    return <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-gray-500" />;
  };

  const getAlertClasses = (type) => {
    if (type === 'error') return "bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";
    if (type === 'warning') return "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300";
    if (type === 'success') return "bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300";
    return "bg-gray-100 border-l-4 border-gray-500 text-gray-700 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-300";
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre tableau de bord Mon Auxiliaire Déménagement.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Switch
            id="demo-mode"
            checked={isDemoMode}
            onCheckedChange={setIsDemoMode}
          />
          <Label htmlFor="demo-mode" className="text-sm text-muted-foreground whitespace-nowrap">Mode Démo</Label>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title + (isDemoMode ? '-demo' : '-real')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-slate-50 dark:from-card dark:to-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                {kpi.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
                {kpi.trend && <p className="text-xs text-muted-foreground pt-1">{kpi.trend} par rapport à la période précédente</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarClock className="h-5 w-5 mr-2 text-primary" />Planning du Jour</CardTitle>
              <CardDescription>{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {dailyPlan.length > 0 ? (
                <ul className="space-y-3">
                  {dailyPlan.map(service => (
                    <li key={service.id} className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted/20 rounded-md hover:bg-muted dark:hover:bg-muted/40 transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">{service.client} - {service.type}</p>
                        <p className="text-xs text-muted-foreground">{service.equipe ? `Équipe: ${service.equipe}` : 'Équipe non assignée'}</p>
                      </div>
                      <span className="text-sm text-primary font-semibold">{format(parseISO(service.date), "HH:mm")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucune prestation planifiée pour aujourd'hui.</p>
              )}
            </CardContent>
            <div className="p-6 pt-0">
             <Button onClick={() => navigate('/calendrier')} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">Voir le calendrier complet</Button>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle>Alertes et Notifications</CardTitle>
              <CardDescription>Informations importantes et rappels.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`flex items-start p-3 rounded-md ${getAlertClasses(alert.type)}`}>
                      {getAlertIcon(alert.type)}
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-muted-foreground text-center py-8">Aucune alerte pour le moment.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;