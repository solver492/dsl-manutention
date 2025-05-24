import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('last30days');
  const [reportData, setReportData] = useState({
    revenue: [],
    services: [],
    satisfaction: []
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports?timeRange=${timeRange}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rapports et Statistiques</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">7 derniers jours</SelectItem>
            <SelectItem value="last30days">30 derniers jours</SelectItem>
            <SelectItem value="last90days">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
            data={{
              labels: reportData.revenue?.map(d => d.month) || [],
              datasets: [{
                label: 'Chiffre d\'affaires',
                data: reportData.revenue?.map(d => d.total) || []
              }]
            }} 
            options={{ responsive: true }} 
          />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie 
              data={{
                labels: reportData.teamPerformance?.map(d => d.equipe) || [],
                datasets: [{
                  label: 'Prestations par équipe',
                  data: reportData.teamPerformance?.map(d => d.total_prestations) || []
                }]
              }} 
              options={{ responsive: true }} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Client</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={reportData.satisfaction} options={{ responsive: true }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}