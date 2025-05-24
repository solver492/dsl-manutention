import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navLinks } from '@/config/navConfig';
import { Menu, Bell, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const currentLink = navLinks.find(link => link.path === location.pathname);
  
  let pageTitle = 'Mon Auxiliaire Déménagement';
  if (currentLink) {
    pageTitle = currentLink.label;
  } else if (location.pathname === '/profil') {
    pageTitle = 'Profil Utilisateur';
  } else if (location.pathname === '/parametres') {
    pageTitle = "Paramètres de l'Application";
  }

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté.",
    });
    navigate('/login');
  };

  return (
    <header className="flex h-20 items-center justify-between border-b bg-background px-6 shadow-sm print:hidden">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-4">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <UserCircle className="h-7 w-7 text-muted-foreground" />
              {user && <span className="hidden sm:inline text-sm font-medium">{user.isSuperAdmin ? "Super Admin" : user.username}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('/profil')}>Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/parametres')}>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-500 focus:bg-red-100/50 dark:focus:bg-red-900/50">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;