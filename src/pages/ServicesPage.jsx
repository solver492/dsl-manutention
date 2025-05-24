import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Printer } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ServiceFormDialog from "@/components/services/ServiceFormDialog";
import DeleteServiceDialog from "@/components/services/DeleteServiceDialog";
import { getServiceTableColumns } from "@/components/services/serviceTableColumns";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

const initialServices = [
  { id: "PRE001", client: "Dupont & Fils", type: "Déménagement Complet", date: new Date(2025, 5, 15).toISOString(), statut: "Planifié", equipe: "Équipe A", vehicule: "Camion 1", nbManutentionnairesRequis: 4, notes: "Appartement au 3ème étage sans ascenseur." },
  { id: "PRE002", client: "Martin SARL", type: "Livraison Meubles", date: new Date(2025, 5, 18).toISOString(), statut: "En cours", equipe: "Équipe B", vehicule: "Fourgonnette 2", nbManutentionnairesRequis: 2, notes: "Livraison fragile." },
  { id: "PRE003", client: "Bernard SA", type: "Garde-Meuble", date: new Date(2025, 5, 22).toISOString(), statut: "Terminé", equipe: "Équipe C", vehicule: "Camion 2", nbManutentionnairesRequis: 3, notes: "" },
];

export const serviceTypes = ["Déménagement Complet", "Livraison Meubles", "Garde-Meuble", "Petit Déménagement", "Transfert de bureaux"];
export const serviceStatus = ["Planifié", "En cours", "Terminé", "Annulé", "Reporté"];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const { toast } = useToast();

  const loadData = useCallback(() => {
    const storedServices = localStorage.getItem('services');
    setServices(storedServices ? JSON.parse(storedServices) : initialServices);

    const storedClients = localStorage.getItem('clients');
    setClients(storedClients ? JSON.parse(storedClients) : []);
    
    const storedEmployees = localStorage.getItem('employees');
    setEmployees(storedEmployees ? JSON.parse(storedEmployees) : []);

    const storedVehicles = localStorage.getItem('vehicles');
    setVehicles(storedVehicles ? JSON.parse(storedVehicles) : []);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval);
  }, [loadData]);


  const saveServicesToLocalStorage = (updatedServices) => {
    localStorage.setItem('services', JSON.stringify(updatedServices));
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setCurrentService(null);
    setIsFormDialogOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsFormDialogOpen(true);
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedServices = services.filter(s => s.id !== serviceToDelete.id);
    saveServicesToLocalStorage(updatedServices);
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
    toast({
      title: "Prestation supprimée",
      description: `La prestation pour ${serviceToDelete.client} a été supprimée.`,
      variant: "destructive"
    });
  };

  const handleSubmitForm = (serviceData) => {
    if (currentService) {
      const updatedServices = services.map(s => s.id === currentService.id ? { ...s, ...serviceData } : s);
      saveServicesToLocalStorage(updatedServices);
      toast({
        title: "Prestation modifiée",
        description: `La prestation pour ${serviceData.client} a été modifiée.`,
      });
    } else {
      serviceData.id = `PRE${String(services.length + 1).padStart(3, '0')}`;
      const updatedServices = [...services, serviceData];
      saveServicesToLocalStorage(updatedServices);
      toast({
        title: "Prestation ajoutée",
        description: `La prestation pour ${serviceData.client} a été ajoutée.`,
      });
    }
    setIsFormDialogOpen(false);
    setCurrentService(null);
  };

  const handlePrintService = (service) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Détail Prestation</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif; margin: 20px;} h1{color: #333;} .details {margin-top: 20px; border-collapse: collapse; width: 100%;} .details th, .details td {border: 1px solid #ddd; padding: 8px; text-align: left;} .details th {background-color: #f2f2f2;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>Détail de la Prestation: ${service.id}</h1>`);
    printWindow.document.write('<table class="details">');
    printWindow.document.write(`<tr><th>Client:</th><td>${service.client}</td></tr>`);
    printWindow.document.write(`<tr><th>Type:</th><td>${service.type}</td></tr>`);
    printWindow.document.write(`<tr><th>Date:</th><td>${format(new Date(service.date), "dd/MM/yyyy HH:mm", { locale: fr })}</td></tr>`);
    printWindow.document.write(`<tr><th>Statut:</th><td>${service.statut}</td></tr>`);
    printWindow.document.write(`<tr><th>Équipe:</th><td>${service.equipe || 'N/A'}</td></tr>`);
    printWindow.document.write(`<tr><th>Véhicule:</th><td>${service.vehicule || 'N/A'}</td></tr>`);
    printWindow.document.write(`<tr><th>Manutentionnaires Requis:</th><td>${service.nbManutentionnairesRequis || 'N/A'}</td></tr>`);
    printWindow.document.write(`<tr><th>Notes:</th><td>${service.notes || 'Aucune'}</td></tr>`);
    printWindow.document.write('</table>');
    printWindow.document.write('<script>setTimeout(() => { window.print(); window.close(); }, 500);</script>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  };
  
  const columns = React.useMemo(() => getServiceTableColumns(handleEditService, handleDeleteService, handlePrintService), [handleEditService, handleDeleteService, handlePrintService]);

  const chefsEquipe = employees.filter(emp => emp.poste === "Chef d'équipe");


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Prestations</h1>
          <p className="text-muted-foreground">Planifiez, suivez et gérez toutes vos prestations de déménagement.</p>
        </div>
        <Button onClick={handleAddService} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Prestation
        </Button>
      </div>

      <Card className="shadow-xl border-none bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle>Liste des Prestations</CardTitle>
          <CardDescription>Consultez et gérez toutes les prestations en cours et planifiées.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={services} filterColumn="client" />
        </CardContent>
      </Card>

      <ServiceFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleSubmitForm}
        service={currentService}
        clients={clients}
        chefsEquipe={chefsEquipe}
        vehicles={vehicles}
        serviceTypes={serviceTypes}
        serviceStatus={serviceStatus}
      />
      
      <DeleteServiceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        serviceInfo={serviceToDelete ? `ID: ${serviceToDelete.id}, Client: ${serviceToDelete.client}` : ""}
      />
    </div>
  );
};

export default ServicesPage;