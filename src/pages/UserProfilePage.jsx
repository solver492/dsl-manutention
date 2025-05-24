import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, KeyRound, Camera } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

const UserProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth(); 
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || `https://avatar.vercel.sh/${user?.username || 'utilisateur'}.png?size=128`);
  const [fullName, setFullName] = useState(user?.fullName || (user?.username === 'genesis' ? 'Super Admin' : 'Utilisateur Test'));
  const [email, setEmail] = useState(user?.email || `${user?.username || 'utilisateur'}@example.com`);
  const [phone, setPhone] = useState(user?.phone || "+33 1 23 45 67 89");

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleAvatarChange = () => {
    const newUrl = prompt("Entrez l'URL de la nouvelle image d'avatar:", avatarUrl);
    if (newUrl) {
      setAvatarUrl(newUrl);
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre nouvelle photo de profil a été appliquée (simulation).",
      });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erreur de mot de passe",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Erreur de mot de passe",
        description: "Le nouveau mot de passe doit comporter au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }
    // Simuler la logique de changement de mot de passe
    console.log("Ancien MDP:", currentPassword, "Nouveau MDP:", newPassword);
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été changé avec succès (simulation).",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    // Mettre à jour les données utilisateur dans localStorage ou via API (simulation)
    const updatedUser = { ...user, fullName, email, phone, avatar: avatarUrl };
    localStorage.setItem('user', JSON.stringify(updatedUser)); 
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été sauvegardées.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil Utilisateur</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres de compte.</p>
      </div>

      <Card className="shadow-xl border-none bg-gradient-to-br from-slate-50 to-gray-100 dark:from-card dark:to-slate-800">
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
          <CardDescription>Mettez à jour votre photo et vos détails personnels ici.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 text-2xl">
                  <AvatarImage src={avatarUrl} alt="Avatar utilisateur" />
                  <AvatarFallback>{fullName ? fullName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 group-hover:bg-background transition-opacity"
                  onClick={handleAvatarChange}
                >
                  <Camera size={16} className="text-muted-foreground" />
                  <span className="sr-only">Changer la photo</span>
                </Button>
              </div>
              <div className="flex-grow text-center sm:text-left">
                 <h2 className="text-2xl font-semibold text-foreground">{fullName}</h2>
                 <p className="text-sm text-muted-foreground">{user?.isSuperAdmin ? "Super Administrateur" : "Utilisateur Standard"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName"><User className="inline-block mr-2 h-4 w-4 text-primary" />Nom complet</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4 text-primary" />Adresse e-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone"><Phone className="inline-block mr-2 h-4 w-4 text-primary" />Numéro de téléphone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
                Sauvegarder les informations
              </Button>
            </div>
          </form>
            
          <Separator className="my-8" />

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Changer le mot de passe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword"><KeyRound className="inline-block mr-2 h-4 w-4 text-primary" />Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword"><KeyRound className="inline-block mr-2 h-4 w-4 text-primary" />Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-start-2">
                  <Label htmlFor="confirmNewPassword"><KeyRound className="inline-block mr-2 h-4 w-4 text-primary" />Confirmer nouveau mot de passe</Label>
                  <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="outline">
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;