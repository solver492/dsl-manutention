import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';

const ServiceFormDialog = ({ isOpen, onClose, onSubmit, service, clients, chefsEquipe, vehicles, serviceTypes, serviceStatus }) => {
  const [formData, setFormData] = useState({
    client: '',
    type: '',
    date: new Date().toISOString(),
    time: '09:00',
    statut: '',
    equipe: '',
    vehicule: '',
    nbManutentionnairesRequis: '',
    notes: '',
  });

  useEffect(() => {
    if (service) {
      const serviceDate = service.date ? parseISO(service.date) : new Date();
      setFormData({
        client: service.client || '',
        type: service.type || '',
        date: serviceDate.toISOString(),
        time: format(serviceDate, "HH:mm"),
        statut: service.statut || '',
        equipe: service.equipe || '',
        vehicule: service.vehicule || '',
        nbManutentionnairesRequis: service.nbManutentionnairesRequis || '',
        notes: service.notes || '',
      });
    } else {
      setFormData({
        client: '', type: '', date: new Date().toISOString(), time: '09:00', statut: serviceStatus[0], equipe: '', vehicule: '', nbManutentionnairesRequis: '', notes: ''
      });
    }
  }, [service, isOpen, serviceStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDate) => {
    setFormData(prev => ({ ...prev, date: selectedDate.toISOString() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = formData.time.split(':');
    const combinedDateTime = parseISO(formData.date);
    combinedDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    onSubmit({ 
      ...formData, 
      date: combinedDateTime.toISOString(),
      nbManutentionnairesRequis: formData.nbManutentionnairesRequis ? parseInt(formData.nbManutentionnairesRequis, 10) : 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{service ? "Modifier la Prestation" : "Ajouter une Nouvelle Prestation"}</DialogTitle>
          <DialogDescription>
            {service ? "Modifiez les détails de la prestation." : "Remplissez les détails de la nouvelle prestation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select name="client" value={formData.client} onValueChange={(value) => handleSelectChange('client', value)} required>
                <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.nom}>{c.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type de Prestation</Label>
              <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(parseISO(formData.date), "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={parseISO(formData.date)} onSelect={handleDateChange} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select name="statut" value={formData.statut} onValueChange={(value) => handleSelectChange('statut', value)} required>
                <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
                <SelectContent>
                  {serviceStatus.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="equipe">Chef d'Équipe</Label>
              <Select name="equipe" value={formData.equipe} onValueChange={(value) => handleSelectChange('equipe', value)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un chef d'équipe" /></SelectTrigger>
                <SelectContent>
                  {chefsEquipe.map(eq => <SelectItem key={eq.id} value={eq.nom}>{eq.nom} ({eq.equipe || 'N/A'})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vehicule">Véhicule Affecté</Label>
              <Select name="vehicule" value={formData.vehicule} onValueChange={(value) => handleSelectChange('vehicule', value)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un véhicule" /></SelectTrigger>
                <SelectContent>
                  {vehicles.map(v => <SelectItem key={v.id} value={v.immatriculation}>{v.immatriculation} ({v.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nbManutentionnairesRequis"><Users className="inline-block mr-2 h-4 w-4 text-primary" />Manutentionnaires Requis</Label>
              <Input id="nbManutentionnairesRequis" name="nbManutentionnairesRequis" type="number" min="0" value={formData.nbManutentionnairesRequis} onChange={handleChange} placeholder="Nombre de personnes" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes / Instructions</Label>
              <Input as="textarea" id="notes" name="notes" value={formData.notes} onChange={handleChange} className="h-20" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">{service ? "Sauvegarder" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;