import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart, LineChart, PieChart, Users, Truck, DollarSign, TrendingUp, Download, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReportCard = ({ title, value, icon, description, chartType }) => {
  let ChartIcon;
  switch (chartType) {
    case 'bar': ChartIcon = BarChart; break;
    case 'line': ChartIcon = LineChart; break;
    case 'pie': ChartIcon = PieChart; break;
    default: ChartIcon = TrendingUp;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="mt-4 h-32 bg-muted/50 dark:bg-muted/20 rounded-md flex items-center justify-center">
            <ChartIcon className="h-16 w-16 text-primary/30" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Graphique de {title.toLowerCase()}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const reportTypes = [
  { value: "financial_summary", label: "Résumé Financier" },
  { value: "operational_efficiency", label: "Efficacité Opérationnelle" },
  { value: "customer_insights", label: "Aperçu Clientèle" },
  { value: "employee_performance", label: "Performance Employés" },
  { value: "vehicle_utilization", label: "Utilisation Véhicules" },
];

const dataPointsOptions = {
  financial_summary: [
    { id: "revenue", label: "Revenus Totaux" }, { id: "expenses", label: "Dépenses Opérationnelles" },
    { id: "profit_margin", label: "Marge Bénéficiaire" }, { id: "avg_invoice_value", label: "Valeur Moyenne Facture" }
  ],
  operational_efficiency: [
    { id: "completed_jobs", label: "Prestations Terminées" }, { id: "avg_job_duration", label: "Durée Moyenne Prestation" },
    { id: "on_time_rate", label: "Taux de Ponctualité" }, { id: "jobs_per_team", label: "Prestations par Équipe" }
  ],
  customer_insights: [
    { id: "new_customers", label: "Nouveaux Clients" }, { id: "customer_retention_rate", label: "Taux de Rétention Client" },
    { id: "avg_customer_rating", label: "Note Moyenne Client" }, { id: "top_customer_sources", label: "Principales Sources Clients" }
  ],
   employee_performance: [
    { id: "jobs_per_employee", label: "Prestations par Employé" }, { id: "employee_satisfaction", label: "Satisfaction Employés" },
    { id: "overtime_hours", label: "Heures Supplémentaires" }, { id: "training_completed", label: "Formations Terminées" }
  ],
  vehicle_utilization: [
    { id: "vehicle_uptime", label: "Disponibilité Véhicules" }, { id: "fuel_efficiency", label: "Consommation Carburant" },
    { id: "maintenance_costs", label: "Coûts de Maintenance" }, { id: "km_per_job", label: "Km par Prestation" }
  ],
};


const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("last30days");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedDataPoints, setSelectedDataPoints] = useState([]);
  const [exportFormat, setExportFormat] = useState("pdf");
  const { toast } = useToast();

  const handleDataPointChange = (pointId) => {
    setSelectedDataPoints(prev => 
      prev.includes(pointId) ? prev.filter(p => p !== pointId) : [...prev, pointId]
    );
  };

  const generateReport = () => {
    if (!selectedReportType || selectedDataPoints.length === 0) {
      toast({
        title: "Configuration incomplète",
        description: "Veuillez sélectionner un type de rapport et au moins un point de donnée.",
        variant: "destructive",
      });
      return;
    }
    // Simulation de la génération de rapport
    const reportDetails = {
      type: reportTypes.find(rt => rt.value === selectedReportType)?.label,
      points: selectedDataPoints.map(dp => dataPointsOptions[selectedReportType]?.find(opt => opt.id === dp)?.label).join(', '),
      period: timeRange,
      format: exportFormat,
      generatedAt: format(new Date(), "dd/MM/yyyy HH:mm", {locale: fr}),
    };

    console.log("Génération du rapport:", reportDetails);
    toast({
      title: "Rapport généré (simulation)",
      description: `Type: ${reportDetails.type}. Données: ${reportDetails.points}. Période: ${reportDetails.period}. Format: ${reportDetails.format}.`,
      action: <Button variant="outline" size="sm" onClick={() => alert(`Téléchargement simulé du rapport en ${exportFormat.toUpperCase()}`)}>Télécharger</Button>
    });
  };


  const reportData = {
    financial: { title: "Chiffre d'Affaires Total", value: "75,890 €", icon: <DollarSign />, description: `Sur ${timeRange === "last30days" ? "les 30 derniers jours" : "l'année en cours"}`, chartType: 'line' },
    teamPerformance: { title: "Prestations par Équipe", value: "Équipe A: 45", icon: <Users />, description: "Meilleure performance", chartType: 'bar' },
    occupancyRate: { title: "Taux d'Occupation Véhicules", value: "78%", icon: <Truck />, description: "Moyenne de la flotte", chartType: 'pie' },
    clientSatisfaction: { title: "Satisfaction Client", value: "4.7/5", icon: <TrendingUp />, description: "Basé sur 120 avis", chartType: 'line' },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rapports et Statistiques</h1>
          <p className="text-muted-foreground">Analysez les performances de votre entreprise.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">7 derniers jours</SelectItem>
              <SelectItem value="last30days">30 derniers jours</SelectItem>
              <SelectItem value="currentMonth">Mois en cours</SelectItem>
              <SelectItem value="lastQuarter">Dernier trimestre</SelectItem>
              <SelectItem value="currentYear">Année en cours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <ReportCard {...reportData.financial} />
        <ReportCard {...reportData.teamPerformance} />
        <ReportCard {...reportData.occupancyRate} />
        <ReportCard {...reportData.clientSatisfaction} />
      </div>

      <Card className="shadow-xl border-none bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary"/>Rapport Personnalisé</CardTitle>
          <CardDescription>Configurez et générez des rapports spécifiques à vos besoins.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="reportType" className="font-semibold">Type de Rapport</Label>
              <Select value={selectedReportType} onValueChange={(value) => { setSelectedReportType(value); setSelectedDataPoints([]); }}>
                <SelectTrigger id="reportType"><SelectValue placeholder="Choisir un type de rapport" /></SelectTrigger>
                <SelectContent>
                  {reportTypes.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exportFormat" className="font-semibold">Format d'Export</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="exportFormat"><SelectValue placeholder="Choisir un format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedReportType && dataPointsOptions[selectedReportType] && (
            <div className="space-y-3">
              <Label className="font-semibold">Données à Inclure:</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 p-4 border rounded-md bg-muted/20 dark:bg-muted/10">
                {dataPointsOptions[selectedReportType].map(point => (
                  <div key={point.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dp-${point.id}`}
                      checked={selectedDataPoints.includes(point.id)}
                      onCheckedChange={() => handleDataPointChange(point.id)}
                    />
                    <Label htmlFor={`dp-${point.id}`} className="text-sm font-normal cursor-pointer">{point.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={generateReport} className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
              <Download className="mr-2 h-4 w-4" /> Générer le Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;