
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Truck, DollarSign, TrendingUp, Download, Settings2 } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

const ReportCard = ({ title, value, icon, description, chartType, data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <Line
            data={data}
            options={chartOptions}
          />
        );
      case 'bar':
        return (
          <Bar
            data={data}
            options={chartOptions}
          />
        );
      case 'pie':
        return (
          <Pie
            data={data}
            options={chartOptions}
          />
        );
      default:
        return null;
    }
  };

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
          <div className="mt-4 h-32 bg-background rounded-md p-2">
            {renderChart()}
          </div>
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
    { id: "revenue", label: "Revenus Totaux" },
    { id: "expenses", label: "Dépenses Opérationnelles" },
    { id: "profit_margin", label: "Marge Bénéficiaire" },
    { id: "avg_invoice_value", label: "Valeur Moyenne Facture" }
  ],
  operational_efficiency: [
    { id: "completed_jobs", label: "Prestations Terminées" },
    { id: "avg_job_duration", label: "Durée Moyenne Prestation" },
    { id: "on_time_rate", label: "Taux de Ponctualité" },
    { id: "jobs_per_team", label: "Prestations par Équipe" }
  ],
  customer_insights: [
    { id: "new_customers", label: "Nouveaux Clients" },
    { id: "customer_retention_rate", label: "Taux de Rétention Client" },
    { id: "avg_customer_rating", label: "Note Moyenne Client" },
    { id: "top_customer_sources", label: "Principales Sources Clients" }
  ],
  employee_performance: [
    { id: "jobs_per_employee", label: "Prestations par Employé" },
    { id: "employee_satisfaction", label: "Satisfaction Employés" },
    { id: "overtime_hours", label: "Heures Supplémentaires" },
    { id: "training_completed", label: "Formations Terminées" }
  ],
  vehicle_utilization: [
    { id: "vehicle_uptime", label: "Disponibilité Véhicules" },
    { id: "fuel_efficiency", label: "Consommation Carburant" },
    { id: "maintenance_costs", label: "Coûts de Maintenance" },
    { id: "km_per_job", label: "Km par Prestation" }
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

  const generateAndDownloadReport = () => {
    if (!selectedReportType || selectedDataPoints.length === 0) {
      toast({
        title: "Configuration incomplète",
        description: "Veuillez sélectionner un type de rapport et au moins un point de donnée.",
        variant: "destructive",
      });
      return;
    }

    const reportDetails = {
      type: reportTypes.find(rt => rt.value === selectedReportType)?.label,
      points: selectedDataPoints.map(dp => dataPointsOptions[selectedReportType]?.find(opt => opt.id === dp)?.label).join(', '),
      period: timeRange,
      format: exportFormat,
      generatedAt: format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr }),
    };

    // Créer le contenu du rapport
    let content = '';
    const currentDate = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: fr });
    const fileName = `rapport_${selectedReportType}_${currentDate}.${exportFormat}`;

    // Générer le contenu selon le format
    if (exportFormat === 'csv') {
      content = `Type de rapport,${reportDetails.type}\nPériode,${reportDetails.period}\nDonnées,${reportDetails.points}\nDate de génération,${reportDetails.generatedAt}\n`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } else if (exportFormat === 'pdf') {
      // Pour PDF, on ouvre dans une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Rapport - ${reportDetails.type}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .section { margin: 20px 0; }
              .chart { margin: 15px 0; }
            </style>
          </head>
          <body>
            <h1>Rapport - ${reportDetails.type}</h1>
            <div class="section">
              <p><strong>Période:</strong> ${reportDetails.period}</p>
              <p><strong>Données analysées:</strong> ${reportDetails.points}</p>
              <p><strong>Généré le:</strong> ${reportDetails.generatedAt}</p>
            </div>
            <script>
              window.print();
              window.onafterprint = () => window.close();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    toast({
      title: "Rapport généré",
      description: `Type: ${reportDetails.type}. Format: ${reportDetails.format}.`,
      variant: "success"
    });
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{
      label: 'CA Mensuel',
      data: [12000, 19000, 15000, 25000, 22000, 75890],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.3
    }]
  };

  const teamData = {
    labels: ['Équipe A', 'Équipe B', 'Équipe C'],
    datasets: [{
      label: 'Prestations',
      data: [45, 38, 32],
      backgroundColor: ['rgba(99, 102, 241, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(147, 51, 234, 0.5)']
    }]
  };

  const occupancyData = {
    labels: ['Occupé', 'Disponible'],
    datasets: [{
      data: [78, 22],
      backgroundColor: ['rgba(99, 102, 241, 0.5)', 'rgba(200, 200, 200, 0.5)']
    }]
  };

  const satisfactionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Note moyenne',
      data: [4.2, 4.4, 4.5, 4.6, 4.6, 4.7],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.3
    }]
  };

  const reportData = {
    financial: {
      title: "Chiffre d'Affaires Total",
      value: "75,890 €",
      icon: <DollarSign />,
      description: `Sur ${timeRange === "last30days" ? "les 30 derniers jours" : "l'année en cours"}`,
      chartType: 'line',
      data: revenueData
    },
    teamPerformance: {
      title: "Prestations par Équipe",
      value: "Équipe A: 45",
      icon: <Users />,
      description: "Meilleure performance",
      chartType: 'bar',
      data: teamData
    },
    occupancyRate: {
      title: "Taux d'Occupation Véhicules",
      value: "78%",
      icon: <Truck />,
      description: "Moyenne de la flotte",
      chartType: 'pie',
      data: occupancyData
    },
    clientSatisfaction: {
      title: "Satisfaction Client",
      value: "4.7/5",
      icon: <TrendingUp />,
      description: "Basé sur 120 avis",
      chartType: 'line',
      data: satisfactionData
    },
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
            <Button onClick={generateAndDownloadReport} className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
              <Download className="mr-2 h-4 w-4" /> Générer le Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
