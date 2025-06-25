
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, User, LayoutDashboard, LogIn, UserPlus, ShoppingBag, Upload } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AssignEase</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                
                <Link to="/order">
                  <Button 
                    variant={isActive('/order') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    New Order
                  </Button>
                </Link>

                <Link to="/notes">
                  <Button 
                    variant={isActive('/notes') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Notes</span>
                  </Button>
                </Link>

                <Link to="/sell-notes">
                  <Button 
                    variant={isActive('/sell-notes') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Sell Notes</span>
                  </Button>
                </Link>

                <Link to="/my-notes">
                  <Button 
                    variant={isActive('/my-notes') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    My Notes
                  </Button>
                </Link>
                
                <Link to="/services">
                  <Button 
                    variant={isActive('/services') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Services
                  </Button>
                </Link>

                <Link to="/about">
                  <Button 
                    variant={isActive('/about') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    About
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button 
                    variant={isActive('/contact') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Contact
                  </Button>
                </Link>
                
                <Link to="/admin">
                  <Button 
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Admin
                  </Button>
                </Link>
                
                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/notes">
                  <Button 
                    variant={isActive('/notes') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Notes</span>
                  </Button>
                </Link>

                <Link to="/services">
                  <Button 
                    variant={isActive('/services') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Services
                  </Button>
                </Link>

                <Link to="/about">
                  <Button 
                    variant={isActive('/about') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    About
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button 
                    variant={isActive('/contact') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Contact
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button 
                    variant={isActive('/login') ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                
                <Link to="/signup">
                  <Button 
                    variant={isActive('/signup') ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
