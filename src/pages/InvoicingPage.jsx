import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, MoreHorizontal, FileText, Eye, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; 
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

const initialInvoices = [
  { id: "INV001", client: "Dupont & Fils", prestationId: "PRE001", dateEmission: new Date(2025, 5, 16), dateEcheance: new Date(2025, 6, 16), montantHT: 1200, tva: 240, montantTTC: 1440, statut: "Payée" },
  { id: "INV002", client: "Martin SARL", prestationId: "PRE002", dateEmission: new Date(2025, 5, 19), dateEcheance: new Date(2025, 6, 19), montantHT: 800, tva: 160, montantTTC: 960, statut: "En attente" },
  { id: "INV003", client: "Bernard SA", prestationId: "PRE003", dateEmission: new Date(2025, 5, 23), dateEcheance: new Date(2025, 6, 23), montantHT: 1500, tva: 300, montantTTC: 1800, statut: "En retard" },
];

const invoiceStatus = ["Payée", "En attente", "En retard", "Partiellement payée", "Annulée"];
const TVA_RATE = 0.20; // 20%

const InvoicingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [dateEmission, setDateEmission] = useState(null);
  const [dateEcheance, setDateEcheance] = useState(null);
  const [montantHT, setMontantHT] = useState(0);
  const { toast } = useToast();

  const [clients, setClients] = useState([]);
  const [prestations, setPrestations] = useState([]);

  useEffect(() => {
    // Charger les clients
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }

    // Charger les prestations
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      setPrestations(JSON.parse(storedServices));
    }
  }, []);


  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices).map(inv => ({
        ...inv,
        dateEmission: new Date(inv.dateEmission),
        dateEcheance: new Date(inv.dateEcheance)
      })));
    } else {
      setInvoices(initialInvoices);
      localStorage.setItem('invoices', JSON.stringify(initialInvoices));
    }
  }, []);

  const saveInvoicesToLocalStorage = (updatedInvoices) => {
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleAddInvoice = () => {
    setCurrentInvoice(null);
    setDateEmission(new Date());
    setDateEcheance(null);
    setMontantHT(0);
    setIsDialogOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setDateEmission(invoice.dateEmission ? new Date(invoice.dateEmission) : null);
    setDateEcheance(invoice.dateEcheance ? new Date(invoice.dateEcheance) : null);
    setMontantHT(invoice.montantHT || 0);
    setIsDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleting(true);
  };

  const handleViewInvoice = (invoice) => {
    const viewWindow = window.open('', '_blank');
    viewWindow.document.write(`
      <html>
        <head>
          <title>Facture ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .client-details { margin-bottom: 20px; }
            .amounts { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FACTURE</h1>
            <h2>${invoice.id}</h2>
          </div>
          <div class="invoice-details">
            <p><strong>Date d'émission:</strong> ${format(new Date(invoice.dateEmission), "dd/MM/yyyy", { locale: fr })}</p>
            <p><strong>Date d'échéance:</strong> ${format(new Date(invoice.dateEcheance), "dd/MM/yyyy", { locale: fr })}</p>
          </div>
          <div class="client-details">
            <h3>Client</h3>
            <p>${invoice.client}</p>
          </div>
          <div class="amounts">
            <table>
              <tr>
                <th>Montant HT</th>
                <td>${invoice.montantHT.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>TVA (20%)</th>
                <td>${invoice.tva.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>Montant TTC</th>
                <td>${invoice.montantTTC.toFixed(2)} €</td>
              </tr>
            </table>
          </div>
          <div class="status">
            <p><strong>Statut:</strong> ${invoice.statut}</p>
          </div>
        </body>
      </html>
    `);
    viewWindow.document.close();
  };

  const handleExportPDF = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .client-details { margin-bottom: 20px; }
            .amounts { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FACTURE</h1>
            <h2>${invoice.id}</h2>
          </div>
          <div class="invoice-details">
            <p><strong>Date d'émission:</strong> ${format(new Date(invoice.dateEmission), "dd/MM/yyyy", { locale: fr })}</p>
            <p><strong>Date d'échéance:</strong> ${format(new Date(invoice.dateEcheance), "dd/MM/yyyy", { locale: fr })}</p>
          </div>
          <div class="client-details">
            <h3>Client</h3>
            <p>${invoice.client}</p>
          </div>
          <div class="amounts">
            <table>
              <tr>
                <th>Montant HT</th>
                <td>${invoice.montantHT.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>TVA (20%)</th>
                <td>${invoice.tva.toFixed(2)} €</td>
              </tr>
              <tr>
                <th>Montant TTC</th>
                <td>${invoice.montantTTC.toFixed(2)} €</td>
              </tr>
            </table>
          </div>
          <div class="status">
            <p><strong>Statut:</strong> ${invoice.statut}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const confirmDelete = () => {
    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceToDelete.id);
    setInvoices(updatedInvoices);
    saveInvoicesToLocalStorage(updatedInvoices);
    setIsDeleting(false);
    setInvoiceToDelete(null);
    toast({
      title: "Facture supprimée",
      description: `La facture ${invoiceToDelete.id} a été supprimée.`,
      variant: "destructive"
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ht = parseFloat(montantHT);
    const tva = ht * TVA_RATE;
    const ttc = ht + tva;

    const invoiceData = {
      client: formData.get('client'),
      prestationId: formData.get('prestationId'),
      statut: formData.get('statut'),
      dateEmission: dateEmission,
      dateEcheance: dateEcheance,
      montantHT: ht,
      tva: tva,
      montantTTC: ttc,
    };

    if (currentInvoice) {
      const updatedInvoices = invoices.map(inv => inv.id === currentInvoice.id ? { ...inv, ...invoiceData } : inv);
      setInvoices(updatedInvoices);
      saveInvoicesToLocalStorage(updatedInvoices);
      toast({
        title: "Facture modifiée",
        description: `La facture ${currentInvoice.id} a été modifiée.`,
      });
    } else {
      invoiceData.id = `INV${String(invoices.length + 1).padStart(3, '0')}`;
      const updatedInvoices = [...invoices, invoiceData];
      setInvoices(updatedInvoices);
      saveInvoicesToLocalStorage(updatedInvoices);
      toast({
        title: "Facture créée",
        description: `La facture ${invoiceData.id} a été créée.`,
      });
    }
    setIsDialogOpen(false);
    setCurrentInvoice(null);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Sélectionner la ligne"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "id", header: ({ column }) => <DataTableColumnHeader column={column} title="N° Facture" /> },
    { accessorKey: "client", header: ({ column }) => <DataTableColumnHeader column={column} title="Client" /> },
    { 
      accessorKey: "dateEmission", 
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date Émission" />,
      cell: ({ row }) => format(new Date(row.original.dateEmission), "dd/MM/yyyy", { locale: fr })
    },
    { 
      accessorKey: "montantTTC", 
      header: ({ column }) => <DataTableColumnHeader column={column} title="Montant TTC" />,
      cell: ({ row }) => `${row.original.montantTTC.toFixed(2)} €`
    },
    { accessorKey: "statut", header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" /> },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                <Eye className="mr-2 h-4 w-4" /> Visualiser
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                <Edit className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportPDF(invoice)}>
                <Download className="mr-2 h-4 w-4" /> Exporter PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Facturation</h1>
          <p className="text-muted-foreground">Générez, suivez et gérez vos factures clients.</p>
        </div>
        <Button onClick={handleAddInvoice} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Créer une Facture
        </Button>
      </div>

      <Card className="shadow-xl border-none bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
          <CardDescription>Consultez et gérez toutes vos factures.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={invoices} filterColumn="client" />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setCurrentInvoice(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentInvoice ? "Modifier la Facture" : "Créer une Nouvelle Facture"}</DialogTitle>
            <DialogDescription>
              {currentInvoice ? "Modifiez les détails de la facture." : "Remplissez les détails de la nouvelle facture."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Select name="client" defaultValue={currentInvoice?.client} required>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.nom}>{c.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prestationId">Prestation Associée</Label>
                <Select name="prestationId" defaultValue={currentInvoice?.prestationId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner une prestation" /></SelectTrigger>
                  <SelectContent>
                    {prestations.map(p => <SelectItem key={p.id} value={p.id}>{p.id} - {p.type} pour {p.client}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateEmission">Date d'Émission</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <FileText className="mr-2 h-4 w-4" />
                      {dateEmission ? format(dateEmission, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateEmission} onSelect={setDateEmission} initialFocus locale={fr}/>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="dateEcheance">Date d'Échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <FileText className="mr-2 h-4 w-4" />
                      {dateEcheance ? format(dateEcheance, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateEcheance} onSelect={setDateEcheance} initialFocus locale={fr}/>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="montantHT">Montant HT (€)</Label>
                <Input id="montantHT" name="montantHT" type="number" step="0.01" value={montantHT} onChange={(e) => setMontantHT(e.target.value)} required />
              </div>
              <div>
                <Label>TVA ({TVA_RATE * 100}%)</Label>
                <Input value={(parseFloat(montantHT || 0) * TVA_RATE).toFixed(2)} disabled />
              </div>
              <div>
                <Label>Montant TTC (€)</Label>
                <Input value={(parseFloat(montantHT || 0) * (1 + TVA_RATE)).toFixed(2)} disabled />
              </div>
              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select name="statut" defaultValue={currentInvoice?.statut} required>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
                  <SelectContent>
                    {invoiceStatus.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); setCurrentInvoice(null); }}>Annuler</Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">{currentInvoice ? "Sauvegarder" : "Créer"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette facture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La facture "{invoiceToDelete?.id}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleting(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicingPage;