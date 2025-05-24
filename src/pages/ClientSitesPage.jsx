import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ClientFormDialog from "@/components/clients/ClientFormDialog";
import DeleteClientDialog from "@/components/clients/DeleteClientDialog";
import { getClientTableColumns } from "@/components/clients/clientTableColumns";

const defaultInitialClients = [
  { id: "CLI001", nom: "AZUR AZUR", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI002", nom: "IRIS", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI003", nom: "PIT", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI004", nom: "SAHARA", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI005", nom: "SOLEIL II", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI006", nom: "HORIZON", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI007", nom: "MASSIRA", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI008", nom: "MARSA", adresse: "Mohammedia", contact: "", telephone: "", email: "" },
  { id: "CLI009", nom: "OCEAN", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI010", nom: "SIEGE", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI011", nom: "PALMIER", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI012", nom: "SOLEIL 1", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI013", nom: "MJA", adresse: "Casablanca", contact: "", telephone: "", email: "" },
  { id: "CLI014", nom: "DUNE", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI015", nom: "ATLAS", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI016", nom: "TOUBKAL", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI017", nom: "MENARA", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI018", nom: "Hangar", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI019", nom: "KOUTOUBIA", adresse: "Marrakech", contact: "", telephone: "", email: "" },
  { id: "CLI020", nom: "M Avenue Regu", adresse: "Marrakech", contact: "", telephone: "", email: "" },
];


const ClientSitesPage = () => {
  const [clients, setClients] = useState([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const { toast } = useToast();

  const loadClients = useCallback(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      setClients(defaultInitialClients);
      localStorage.setItem('clients', JSON.stringify(defaultInitialClients));
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const saveClientsToLocalStorage = (updatedClients) => {
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  const handleAddClient = () => {
    setCurrentClient(null);
    setIsFormDialogOpen(true);
  };

  const handleEditClient = (client) => {
    setCurrentClient(client);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updatedClients = clients.filter(c => c.id !== clientToDelete.id);
    saveClientsToLocalStorage(updatedClients);
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
    toast({
      title: "Client supprimé",
      description: `Le client ${clientToDelete.nom} a été supprimé avec succès.`,
      variant: "destructive"
    });
  };

  const handleSubmitForm = (clientData) => {
    if (currentClient) {
      const updatedClients = clients.map(c => c.id === currentClient.id ? { ...c, ...clientData } : c);
      saveClientsToLocalStorage(updatedClients);
      toast({
        title: "Client modifié",
        description: `Le client ${clientData.nom} a été modifié avec succès.`,
      });
    } else {
      clientData.id = `CLI${String(clients.length + 1).padStart(3, '0')}`;
      const updatedClients = [...clients, clientData];
      saveClientsToLocalStorage(updatedClients);
      toast({
        title: "Client ajouté",
        description: `Le client ${clientData.nom} a été ajouté avec succès.`,
      });
    }
    setIsFormDialogOpen(false);
  };
  
  const columns = React.useMemo(() => getClientTableColumns(handleEditClient, handleDeleteClient), [handleEditClient, handleDeleteClient]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Sites Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations de contact.</p>
        </div>
        <Button onClick={handleAddClient} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Client
        </Button>
      </div>

      <Card className="shadow-xl border-none bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>Consultez et gérez la liste de tous vos clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={clients} filterColumn="nom" />
        </CardContent>
      </Card>

      <ClientFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleSubmitForm}
        client={currentClient}
      />

      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        clientName={clientToDelete?.nom}
      />
    </div>
  );
};

export default ClientSitesPage;